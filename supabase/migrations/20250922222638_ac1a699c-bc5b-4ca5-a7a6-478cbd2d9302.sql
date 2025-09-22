-- Security Enhancement: Restrict admin access to profiles and add audit logging
-- Fixed version without SELECT triggers

-- First, let's create a function to get only basic (non-sensitive) profile data for admins
CREATE OR REPLACE FUNCTION public.get_admin_safe_profile_data(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  first_name text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  language text,
  goal text,
  level text,
  risk_tolerance text
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
    p.risk_tolerance
  FROM public.profiles p
  WHERE p.user_id = target_user_id
  AND has_admin_permission('users', 'read');
$$;

-- Create a secure function for accessing sensitive profile data with enhanced verification
CREATE OR REPLACE FUNCTION public.get_sensitive_profile_data(
  target_user_id uuid,
  reason text DEFAULT 'administrative_review'
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
  
  -- Only ADMIN role can access sensitive data, not lower level admins
  IF admin_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Access denied: Only ADMIN role can access sensitive profile data';
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
      'reason', reason,
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

-- Create a secure admin profile view that only shows basic data
CREATE OR REPLACE VIEW public.admin_profile_view AS
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
  -- Add computed fields for admin convenience
  CASE 
    WHEN p.email IS NOT NULL THEN true 
    ELSE false 
  END as has_email,
  CASE 
    WHEN p.phone IS NOT NULL THEN true 
    ELSE false 
  END as has_phone
FROM public.profiles p;

-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admins can view basic profile data" ON public.profiles;

-- Recreate user policies to ensure they're correct
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Grant permissions on the admin view
GRANT SELECT ON public.admin_profile_view TO authenticated;

-- Enable RLS on the admin view and create policy
DROP POLICY IF EXISTS "Admins can use profile view" ON public.admin_profile_view;
CREATE POLICY "Admins can use profile view"
ON public.admin_profile_view
FOR SELECT
USING (has_admin_permission('users', 'read'));

-- Create a function to safely search users for admin purposes
CREATE OR REPLACE FUNCTION public.admin_search_users(
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
    apv.id,
    apv.user_id,
    apv.first_name,
    apv.has_email,
    apv.has_phone,
    apv.created_at,
    apv.goal,
    apv.level
  FROM public.admin_profile_view apv
  WHERE 
    has_admin_permission('users', 'read') AND
    (
      search_term = '' OR
      apv.first_name ILIKE '%' || search_term || '%'
    )
  ORDER BY apv.created_at DESC
  LIMIT limit_count;
$$;