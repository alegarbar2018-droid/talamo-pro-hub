-- Add email column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower
  ON public.profiles (lower(email));

-- Create function to check if user exists by email
CREATE OR REPLACE FUNCTION public.user_exists(p_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE lower(email) = lower(p_email)
    LIMIT 1
  );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.user_exists(text) TO anon, authenticated;