-- Essential Security Fix: Remove overly permissive admin access to profiles

-- Drop the problematic policy that allows unrestricted admin access
DROP POLICY IF EXISTS "Admins can view basic profile data" ON public.profiles;

-- Create a secure function for basic profile access with proper restrictions
CREATE OR REPLACE FUNCTION public.get_basic_profile_for_admin(target_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', p.id,
    'user_id', p.user_id,
    'first_name', p.first_name,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'language', p.language,
    'goal', p.goal,
    'level', p.level,
    'risk_tolerance', p.risk_tolerance,
    'has_email', CASE WHEN p.email IS NOT NULL THEN true ELSE false END,
    'has_phone', CASE WHEN p.phone IS NOT NULL THEN true ELSE false END
  )
  FROM public.profiles p
  WHERE p.user_id = target_user_id
  AND has_admin_permission('users', 'read');
$$;