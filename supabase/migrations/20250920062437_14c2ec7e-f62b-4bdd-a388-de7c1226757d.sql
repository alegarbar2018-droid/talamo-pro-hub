-- CRITICAL SECURITY FIXES

-- 1. Create security definer function to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- 2. Fix profiles table - Remove public access policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 3. Create secure profile policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- 4. Fix user_roles table - Remove recursive policy
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- 5. Create secure role management policies
CREATE POLICY "Admins can manage all roles (secure)" 
ON public.user_roles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');