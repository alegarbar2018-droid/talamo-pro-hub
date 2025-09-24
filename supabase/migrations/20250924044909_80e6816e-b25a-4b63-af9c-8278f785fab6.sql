-- Fix CRITICAL security warnings from linter
-- P0: Function Search Path Security + Password Protection

-- Fix Function Search Path Mutable warnings
-- Update functions to have immutable search_path for security

-- Fix has_active_mfa_session function 
CREATE OR REPLACE FUNCTION public.has_active_mfa_session(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_mfa_sessions
    WHERE user_id = _user_id
    AND expires_at > now()
    LIMIT 1
  )
$$;

-- Fix requires_mfa_for_operation function
CREATE OR REPLACE FUNCTION public.requires_mfa_for_operation(_operation text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
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