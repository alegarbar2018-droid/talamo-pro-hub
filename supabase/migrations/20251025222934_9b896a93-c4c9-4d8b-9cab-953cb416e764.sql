-- FASE 1: Agregar columnas faltantes a profiles para sistema de referidos
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS exness_id TEXT,
ADD COLUMN IF NOT EXISTS link_code TEXT,
ADD COLUMN IF NOT EXISTS exness_referral_link TEXT;

-- Agregar índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_profiles_exness_id ON public.profiles(exness_id);
CREATE INDEX IF NOT EXISTS idx_profiles_link_code ON public.profiles(link_code);

-- Agregar comentarios para documentación
COMMENT ON COLUMN public.profiles.exness_id IS 'ID del agente de referidos en Exness API';
COMMENT ON COLUMN public.profiles.link_code IS 'Código del link de referido desde Exness API';
COMMENT ON COLUMN public.profiles.exness_referral_link IS 'Link de referido final construido con formato one.exnessonelink.com';