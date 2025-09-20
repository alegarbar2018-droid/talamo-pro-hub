-- FIX AFFILIATION_REPORTS SECURITY ISSUE

-- 1. Drop the existing inconsistent admin policy that uses auth.users metadata
DROP POLICY IF EXISTS "Admin can manage affiliation reports" ON public.affiliation_reports;

-- 2. Create secure admin-only access policy using the proper role system
CREATE POLICY "Only admins can manage affiliation reports" 
ON public.affiliation_reports 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- 3. Add explicit deny policy for non-admins (defense in depth)
CREATE POLICY "Deny access to non-admins" 
ON public.affiliation_reports 
FOR ALL 
USING (false);