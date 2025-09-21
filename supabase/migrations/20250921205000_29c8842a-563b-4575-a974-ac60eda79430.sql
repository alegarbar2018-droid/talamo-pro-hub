-- Critical Security Fixes Migration

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

-- 2. Add database constraint to prevent admin role escalation
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

-- 3. Add comprehensive audit logging trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all admin_users table changes
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    resource,
    meta
  ) VALUES (
    auth.uid(),
    TG_OP || '_admin_user',
    'admin_users',
    jsonb_build_object(
      'target_user_id', COALESCE(NEW.user_id, OLD.user_id),
      'old_role', CASE WHEN TG_OP != 'INSERT' THEN OLD.role::text ELSE NULL END,
      'new_role', CASE WHEN TG_OP != 'DELETE' THEN NEW.role::text ELSE NULL END,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_admin_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_admin_action();

-- 4. Add missing permissions for lead management
INSERT INTO public.permissions (role, resource, action) VALUES
  ('ADMIN', 'leads', 'read'),
  ('SUPPORT', 'leads', 'read'),
  ('ADMIN', 'leads', 'manage')
ON CONFLICT (role, resource, action) DO NOTHING;

-- 5. Create security definer function for safe profile access with masking
CREATE OR REPLACE FUNCTION public.get_masked_profile_access(target_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  level TEXT,
  created_at TIMESTAMPTZ,
  -- Sensitive fields are conditionally returned based on permissions
  full_phone TEXT,
  full_email TEXT
) AS $$
BEGIN
  -- Log the access attempt
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    resource,
    meta
  ) VALUES (
    auth.uid(),
    'profile_access',
    'profiles',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'has_sensitive_access', has_admin_permission('users', 'read_sensitive'),
      'timestamp', now()
    )
  );

  -- Return masked or full data based on permissions
  RETURN QUERY
  SELECT 
    p.user_id,
    p.first_name,
    p.last_name,
    CASE 
      WHEN has_admin_permission('users', 'read_sensitive') THEN p.email
      ELSE CONCAT(LEFT(p.email, 3), '***@', SPLIT_PART(p.email, '@', 2))
    END as email,
    CASE 
      WHEN has_admin_permission('users', 'read_sensitive') THEN p.phone
      ELSE CONCAT('***', RIGHT(p.phone, 4))
    END as phone,
    p.level,
    p.created_at,
    CASE WHEN has_admin_permission('users', 'read_sensitive') THEN p.phone ELSE NULL END as full_phone,
    CASE WHEN has_admin_permission('users', 'read_sensitive') THEN p.email ELSE NULL END as full_email
  FROM public.profiles p
  WHERE p.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add rate limiting table for security operations
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  operation TEXT NOT NULL,
  attempts INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, operation)
);

ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rate limits" 
ON public.security_rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

-- 7. Session security table for tracking admin sessions
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" 
ON public.admin_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
ON public.admin_sessions 
FOR SELECT 
USING (get_current_admin_role() = 'ADMIN');

-- 8. Add data retention policies helper function
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
  -- Keep audit logs for 2 years
  DELETE FROM public.audit_logs 
  WHERE created_at < now() - INTERVAL '2 years';
  
  -- Keep rate limit data for 24 hours
  DELETE FROM public.security_rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
  
  -- Clean up inactive sessions older than 7 days
  DELETE FROM public.admin_sessions 
  WHERE (NOT is_active OR expires_at < now()) 
  AND created_at < now() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;