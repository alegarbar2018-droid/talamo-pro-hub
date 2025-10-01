-- 1. Agregar campo email a affiliations para búsquedas rápidas
ALTER TABLE public.affiliations 
ADD COLUMN IF NOT EXISTS email text;

-- 2. Crear índice para búsquedas eficientes por email
CREATE INDEX IF NOT EXISTS idx_affiliations_email ON public.affiliations(email);

-- 3. Crear índice compuesto para user_id + email
CREATE INDEX IF NOT EXISTS idx_affiliations_user_email ON public.affiliations(user_id, email);

-- 4. Migrar datos existentes: copiar emails de profiles a affiliations
UPDATE public.affiliations aff
SET email = p.email
FROM public.profiles p
WHERE aff.user_id = p.user_id 
AND aff.email IS NULL
AND p.email IS NOT NULL;

-- 5. Migrar usuarios afiliados de affiliation_reports que no estén en affiliations
INSERT INTO public.affiliations (user_id, email, partner_id, is_affiliated, verified_at)
SELECT 
  p.user_id,
  ar.email,
  ar.partner_id,
  true,
  ar.created_at
FROM public.affiliation_reports ar
JOIN public.profiles p ON LOWER(p.email) = LOWER(ar.email)
WHERE ar.status = 'affiliated'
AND NOT EXISTS (
  SELECT 1 FROM public.affiliations aff 
  WHERE aff.user_id = p.user_id
)
ON CONFLICT (user_id) DO NOTHING;

-- 6. Crear función auxiliar para verificar afiliación por email
CREATE OR REPLACE FUNCTION public.check_affiliation_by_email(p_email text)
RETURNS TABLE(
  is_affiliated boolean,
  user_exists boolean,
  user_id uuid,
  partner_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    aff.is_affiliated,
    true as user_exists,
    aff.user_id,
    aff.partner_id
  FROM public.affiliations aff
  WHERE LOWER(aff.email) = LOWER(p_email)
  AND aff.is_affiliated = true
  LIMIT 1;
  
  -- Si no encuentra nada, retornar valores por defecto
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT false, false, NULL::uuid, NULL::text;
  END IF;
END;
$$;