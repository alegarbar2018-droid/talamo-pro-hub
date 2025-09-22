-- Fix circular dependency in admin_users RLS policies
-- Remove the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Keep only the policy that allows users to view their own admin record
-- This is sufficient for the getCurrentAdminRole() function to work
-- The policy "Users can view their own admin record" already exists and is correct

-- Create a new policy for admin management that doesn't cause recursion
-- This policy allows any authenticated user to read admin_users if they have admin role in the user_roles table
CREATE POLICY "Allow admin access via user_roles" 
ON public.admin_users 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) 
  OR auth.uid() = admin_users.user_id
);