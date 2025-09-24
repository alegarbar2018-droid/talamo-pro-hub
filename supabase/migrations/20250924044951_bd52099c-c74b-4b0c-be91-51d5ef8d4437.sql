-- P0 CRITICAL: Fix remaining security warnings

-- Fix the function without search_path set
CREATE OR REPLACE FUNCTION public.get_sensitive_profile_fields()
RETURNS text[]
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT ARRAY['email', 'phone', 'last_name', 'bio', 'risk_tolerance', 'interested_assets', 'notification_preferences'];
$$;