-- Fix function search path security warnings

-- Update existing functions to have proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Also fix the audit_profile_access function if it exists
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;