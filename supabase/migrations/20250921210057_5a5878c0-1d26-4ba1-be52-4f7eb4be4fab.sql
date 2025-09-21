-- Critical Security Fixes - Simplified Migration

-- 1. Fix access_leads RLS policies (currently has no useful access)
DROP POLICY IF EXISTS "Only admins can view leads" ON public.access_leads;

CREATE POLICY "Admins and support can view leads" 
ON public.access_leads 
FOR SELECT 
USING (has_admin_permission('leads', 'read'));

CREATE POLICY "Admins can manage leads" 
ON public.access_leads 
FOR ALL 
USING (get_current_admin_role() = 'ADMIN');

-- 2. Add missing permissions for lead management (without ON CONFLICT)
DO $$
BEGIN
  -- Check and insert permissions individually to avoid conflicts
  IF NOT EXISTS (SELECT 1 FROM public.permissions WHERE role = 'ADMIN' AND resource = 'leads' AND action = 'read') THEN
    INSERT INTO public.permissions (role, resource, action) VALUES ('ADMIN', 'leads', 'read');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.permissions WHERE role = 'SUPPORT' AND resource = 'leads' AND action = 'read') THEN
    INSERT INTO public.permissions (role, resource, action) VALUES ('SUPPORT', 'leads', 'read');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.permissions WHERE role = 'ADMIN' AND resource = 'leads' AND action = 'manage') THEN
    INSERT INTO public.permissions (role, resource, action) VALUES ('ADMIN', 'leads', 'manage');
  END IF;
  
  -- Add user permissions for sensitive access
  IF NOT EXISTS (SELECT 1 FROM public.permissions WHERE role = 'ADMIN' AND resource = 'users' AND action = 'read_sensitive') THEN
    INSERT INTO public.permissions (role, resource, action) VALUES ('ADMIN', 'users', 'read_sensitive');
  END IF;
END $$;

-- 3. Add constraint to prevent admin role escalation
CREATE OR REPLACE FUNCTION public.validate_admin_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only ADMINs can assign ADMIN role
  IF NEW.role = 'ADMIN' AND get_current_admin_role() != 'ADMIN' THEN
    RAISE EXCEPTION 'Only ADMINs can assign ADMIN role';
  END IF;
  
  -- Prevent removing the last ADMIN
  IF OLD.role = 'ADMIN' AND NEW.role != 'ADMIN' THEN
    IF (SELECT COUNT(*) FROM public.admin_users WHERE role = 'ADMIN' AND user_id != NEW.user_id) = 0 THEN
      RAISE EXCEPTION 'Cannot remove the last ADMIN user';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_admin_role_before_update
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_admin_role_assignment();