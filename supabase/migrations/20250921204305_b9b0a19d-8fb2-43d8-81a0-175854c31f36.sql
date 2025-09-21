-- Add granular permissions for user data access
INSERT INTO public.permissions (role, resource, action) VALUES
  ('SUPPORT', 'users', 'read'),
  ('ANALYST', 'users', 'read'),
  ('CONTENT', 'users', 'read'),
  ('ADMIN', 'users', 'read'),
  ('ADMIN', 'users', 'read_sensitive');

-- Update profiles RLS policy to be more restrictive
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create more granular RLS policies for profiles
CREATE POLICY "Admins can view basic profile data" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_admin_permission('users', 'read')
);

-- Create audit function for profile access
CREATE OR REPLACE FUNCTION public.audit_profile_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when admin users access profile data
  IF current_setting('role', true) != 'authenticated' AND 
     get_current_admin_role() IS NOT NULL THEN
    INSERT INTO public.audit_logs (
      actor_id,
      action,
      resource,
      meta
    ) VALUES (
      auth.uid(),
      'profiles.accessed',
      'profile',
      jsonb_build_object(
        'target_user_id', NEW.user_id,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;