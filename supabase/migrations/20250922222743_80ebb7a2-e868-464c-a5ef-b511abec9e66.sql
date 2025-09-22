-- Security Enhancement: Fix the overly permissive admin access to profiles
-- Simple and direct approach

-- First, drop the problematic policy that allows admins to see all profile data
DROP POLICY IF EXISTS "Admins can view basic profile data" ON public.profiles;

-- Create a secure function for admins to access only basic profile data
CREATE OR REPLACE FUNCTION public.get_basic_profile_for_admin(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  first_name text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  language text,
  goal text,
  level text,
  risk_tolerance text,
  has_email boolean,
  has_phone boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Only return non-sensitive fields for admin access
  -- Excludes: email, phone, last_name, bio, avatar_url, notification_preferences, interested_assets
  SELECT 
    p.id,
    p.user_id,
    p.first_name,
    p.created_at,
    p.updated_at,
    p.language,
    p.goal,
    p.level,
    p.risk_tolerance,
    CASE WHEN p.email IS NOT NULL THEN true ELSE false END as has_email,
    CASE WHEN p.phone IS NOT NULL THEN true ELSE false END as has_phone
  FROM public.profiles p
  WHERE p.user_id = target_user_id
  AND has_admin_permission('users', 'read');
$$;

-- Create a highly secure function for accessing sensitive profile data
-- This requires ADMIN role (not just any admin permission) and logs all access
CREATE OR REPLACE FUNCTION public.get_sensitive_profile_for_admin(
  target_user_id uuid,
  justification text
)
RETURNS TABLE (
  user_id uuid,
  email text,
  phone text,
  last_name text,
  bio text,
  avatar_url text,
  notification_preferences jsonb,
  interested_assets text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role text;
BEGIN
  -- Get current admin role
  admin_role := get_current_admin_role();
  
  -- Only highest level ADMIN role can access sensitive data
  IF admin_role != 'ADMIN' THEN
    -- Log the denied access attempt
    INSERT INTO public.audit_logs (
      actor_id,
      action,
      resource,
      meta
    ) VALUES (
      auth.uid(),
      'profiles.sensitive_access_denied',
      'profile',
      jsonb_build_object(
        'target_user_id', target_user_id,
        'admin_role', admin_role,
        'justification', justification,
        'timestamp', now()
      )
    );
    
    RAISE EXCEPTION 'Access denied: Only ADMIN role can access sensitive profile data. Current role: %', admin_role;
  END IF;
  
  -- Require justification for sensitive data access
  IF justification IS NULL OR length(trim(justification)) < 10 THEN
    RAISE EXCEPTION 'Justification required: Please provide a detailed reason (minimum 10 characters) for accessing sensitive profile data';
  END IF;
  
  -- Log the sensitive data access for audit purposes
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    resource,
    meta
  ) VALUES (
    auth.uid(),
    'profiles.sensitive_data_accessed',
    'profile',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'justification', justification,
      'timestamp', now(),
      'admin_role', admin_role
    )
  );
  
  -- Return sensitive data
  RETURN QUERY
  SELECT 
    p.user_id,
    p.email,
    p.phone,
    p.last_name,
    p.bio,
    p.avatar_url,
    p.notification_preferences,
    p.interested_assets
  FROM public.profiles p
  WHERE p.user_id = target_user_id;
END;
$$;

-- Create a function for admin user search that only returns basic data
CREATE OR REPLACE FUNCTION public.search_users_for_admin(
  search_term text DEFAULT '',
  limit_count integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  first_name text,
  has_email boolean,
  has_phone boolean,
  created_at timestamp with time zone,
  goal text,
  level text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.first_name,
    CASE WHEN p.email IS NOT NULL THEN true ELSE false END as has_email,
    CASE WHEN p.phone IS NOT NULL THEN true ELSE false END as has_phone,
    p.created_at,
    p.goal,
    p.level
  FROM public.profiles p
  WHERE 
    has_admin_permission('users', 'read') AND
    (
      search_term = '' OR
      p.first_name ILIKE '%' || search_term || '%'
    )
  ORDER BY p.created_at DESC
  LIMIT limit_count;
$$;