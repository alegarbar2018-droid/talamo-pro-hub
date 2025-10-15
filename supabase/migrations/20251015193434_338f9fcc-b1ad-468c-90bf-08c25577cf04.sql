-- Add onboarding-specific fields to profiles table
-- This enables post-registration onboarding flow with personalized recommendations

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS capital_band TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS trading_style TEXT,
ADD COLUMN IF NOT EXISTS platform_preference TEXT,
ADD COLUMN IF NOT EXISTS experience_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS recommended_account TEXT,
ADD COLUMN IF NOT EXISTS recommended_route TEXT;

-- Create index for fast onboarding status checks
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx 
ON public.profiles(onboarding_completed)
WHERE onboarding_completed = FALSE;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.capital_band IS 'Initial capital range selected during onboarding (<500, 500-2000, 2000-10000, >10000)';
COMMENT ON COLUMN public.profiles.availability IS 'Weekly time availability for trading (<2h, 2-5h, 5-10h, >10h)';
COMMENT ON COLUMN public.profiles.trading_style IS 'Preferred trading style (tranquila, moderada, rapida)';
COMMENT ON COLUMN public.profiles.platform_preference IS 'Preferred trading platform (MT4, MT5, solo_copiar, no_lo_se)';
COMMENT ON COLUMN public.profiles.experience_score IS 'Calculated experience score from onboarding quiz (0-9)';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed the initial post-registration onboarding flow';
COMMENT ON COLUMN public.profiles.onboarding_completed_at IS 'Timestamp when user completed the onboarding flow';
COMMENT ON COLUMN public.profiles.recommended_account IS 'Trading account recommended by onboarding algorithm (e.g., Standard Cent, Pro, Zero)';
COMMENT ON COLUMN public.profiles.recommended_route IS 'Learning/trading route recommended (e.g., Aprender y operar, Copy Trading)';