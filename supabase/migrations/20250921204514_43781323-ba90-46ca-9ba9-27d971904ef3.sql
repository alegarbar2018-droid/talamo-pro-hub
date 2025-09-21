-- Add granular permissions for user data access (skip if already exists)
DO $$
BEGIN
    INSERT INTO public.permissions (role, resource, action) VALUES
      ('SUPPORT', 'users', 'read'),
      ('ANALYST', 'users', 'read'),
      ('CONTENT', 'users', 'read'),
      ('ADMIN', 'users', 'read'),
      ('ADMIN', 'users', 'read_sensitive');
EXCEPTION 
    WHEN unique_violation THEN
        -- Permissions already exist, continue
        NULL;
END $$;

-- Update profiles RLS policy to be more restrictive
DROP POLICY IF EXISTS "Admins can view basic profile data" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create more granular RLS policies for profiles
CREATE POLICY "Admins can view basic profile data" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_admin_permission('users', 'read')
);