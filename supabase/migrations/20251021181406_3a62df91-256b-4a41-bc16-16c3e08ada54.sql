-- Marcar usuarios existentes como que completaron el onboarding
-- Los usuarios que ya tienen una cuenta deben tener onboarding_completed = true

UPDATE public.profiles
SET 
  onboarding_completed = true,
  onboarding_completed_at = COALESCE(onboarding_completed_at, created_at)
WHERE onboarding_completed IS NULL OR onboarding_completed = false;