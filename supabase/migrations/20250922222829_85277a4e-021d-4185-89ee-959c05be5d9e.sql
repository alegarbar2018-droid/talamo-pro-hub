-- Add secure sensitive data access with audit logging

CREATE OR REPLACE FUNCTION public.get_sensitive_profile_for_admin(
  target_user_id uuid,
  justification text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role text;
  result jsonb;
BEGIN
  -- Get current admin role
  admin_role := get_current_admin_role();
  
  -- Only highest level ADMIN role can access sensitive data
  IF admin_role != 'ADMIN' THEN
    -- Log the denied access attempt
    INSERT INTO public.audit_logs (
      actor_id,
      action,
      resource,
      meta
    ) VALUES (
      auth.uid(),
      'profiles.sensitive_access_denied',
      'profile',
      jsonb_build_object(
        'target_user_id', target_user_id,
        'admin_role', admin_role,
        'justification', justification,
        'timestamp', now()
      )
    );
    
    RAISE EXCEPTION 'Access denied: Only ADMIN role can access sensitive profile data';
  END IF;
  
  -- Require justification for sensitive data access
  IF justification IS NULL OR length(trim(justification)) < 10 THEN
    RAISE EXCEPTION 'Justification required: Provide detailed reason (min 10 chars) for accessing sensitive data';
  END IF;
  
  -- Get sensitive data
  SELECT jsonb_build_object(
    'user_id', p.user_id,
    'email', p.email,
    'phone', p.phone,
    'last_name', p.last_name,
    'bio', p.bio,
    'avatar_url', p.avatar_url,
    'notification_preferences', p.notification_preferences,
    'interested_assets', p.interested_assets
  ) INTO result
  FROM public.profiles p
  WHERE p.user_id = target_user_id;
  
  -- Log the successful sensitive data access
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    resource,
    meta
  ) VALUES (
    auth.uid(),
    'profiles.sensitive_data_accessed',
    'profile',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'justification', justification,
      'timestamp', now(),
      'admin_role', admin_role
    )
  );
  
  RETURN result;
END;
$$;