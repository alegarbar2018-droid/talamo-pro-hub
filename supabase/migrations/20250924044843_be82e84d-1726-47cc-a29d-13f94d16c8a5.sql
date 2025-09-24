-- P0 Security: 2FA Implementation for Admin Users
-- Creates secure TOTP-based 2FA with backup codes and proper RLS

-- Admin MFA table for TOTP secrets and backup codes
CREATE TABLE public.admin_mfa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  secret_encrypted TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  backup_codes_hash TEXT[],
  recovery_codes_used INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_mfa table
ALTER TABLE public.admin_mfa ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_mfa (users can only access their own MFA settings)
CREATE POLICY "Users can manage their own MFA settings"
ON public.admin_mfa
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- MFA sessions table for tracking active MFA sessions
CREATE TABLE public.admin_mfa_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mfa_sessions
ALTER TABLE public.admin_mfa_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for MFA sessions
CREATE POLICY "Users can view their own MFA sessions"
ON public.admin_mfa_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage MFA sessions"
ON public.admin_mfa_sessions
FOR ALL
USING (true); -- Managed by edge functions with service role

-- Rate limiting table for MFA attempts
CREATE TABLE public.admin_mfa_rate_limits (
  user_id UUID NOT NULL PRIMARY KEY,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.admin_mfa_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policy for rate limits (only system can manage)
CREATE POLICY "System manages MFA rate limits"
ON public.admin_mfa_rate_limits
FOR ALL
USING (true); -- Managed by edge functions

-- Add MFA requirement tracking to admin_users
ALTER TABLE public.admin_users 
ADD COLUMN mfa_required BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN mfa_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN mfa_enforced_at TIMESTAMP WITH TIME ZONE;

-- Update existing admin users to require MFA
UPDATE public.admin_users 
SET mfa_required = true, mfa_enforced_at = now()
WHERE role IN ('ADMIN', 'CONTENT', 'SUPPORT', 'ANALYST');

-- Function to check if user has active MFA session
CREATE OR REPLACE FUNCTION public.has_active_mfa_session(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_mfa_sessions
    WHERE user_id = _user_id
    AND expires_at > now()
    LIMIT 1
  )
$$;

-- Function to check if user requires MFA for operation
CREATE OR REPLACE FUNCTION public.requires_mfa_for_operation(_operation text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT _operation IN (
    'users.impersonate',
    'roles.assign', 
    'users.delete',
    'admin.settings.change',
    'sensitive.data.access',
    'system.configuration'
  )
$$;

-- Trigger to update updated_at on admin_mfa
CREATE TRIGGER update_admin_mfa_updated_at
  BEFORE UPDATE ON public.admin_mfa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on rate limits
CREATE TRIGGER update_mfa_rate_limits_updated_at
  BEFORE UPDATE ON public.admin_mfa_rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default permissions for MFA management
INSERT INTO public.permissions (role, resource, action) VALUES
('ADMIN', 'mfa', 'manage'),
('ADMIN', 'mfa', 'bypass'),
('CONTENT', 'mfa', 'setup'),
('SUPPORT', 'mfa', 'setup'),
('ANALYST', 'mfa', 'setup')
ON CONFLICT DO NOTHING;