-- ============================================================
-- Migration: Preparar signals para ingestión automática MT5
-- Idempotente: SÍ | Transaccional: SÍ
-- ============================================================

-- 1️⃣ Verificar/crear usuario de sistema
DO $$
DECLARE
  system_user_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000'
  ) INTO system_user_exists;
  
  IF NOT system_user_exists THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'system-mt5-' || extract(epoch from now())::bigint || '@internal.local',
      crypt('system-mt5-no-login-' || gen_random_uuid()::text, gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"system","providers":["system"]}'::jsonb,
      '{"first_name":"MT5 System","last_name":"Automated Signal Bot"}'::jsonb,
      false,
      '',
      ''
    );
    RAISE NOTICE 'Usuario de sistema creado';
  ELSE
    RAISE NOTICE 'Usuario de sistema ya existe';
  END IF;
END $$;

-- 2️⃣ Poblar dedup_key para filas existentes que no lo tengan
UPDATE public.signals
SET dedup_key = gen_random_uuid()::text
WHERE dedup_key IS NULL;

-- 3️⃣ Cambiar default de author_id
ALTER TABLE IF EXISTS public.signals
  ALTER COLUMN author_id SET DEFAULT '00000000-0000-0000-0000-000000000000';

-- 4️⃣ Relajar restricciones NOT NULL para compatibilidad
ALTER TABLE IF EXISTS public.signals
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN instrument DROP NOT NULL,
  ALTER COLUMN rr DROP NOT NULL,
  ALTER COLUMN invalidation DROP NOT NULL;

-- 5️⃣ Asignar defaults coherentes con señales automáticas
ALTER TABLE IF EXISTS public.signals
  ALTER COLUMN status SET DEFAULT 'published',
  ALTER COLUMN result SET DEFAULT 'pending',
  ALTER COLUMN source SET DEFAULT 'automated';

-- 6️⃣ Garantizar unicidad del dedup_key (ahora que no hay NULLs)
ALTER TABLE IF EXISTS public.signals
  ALTER COLUMN dedup_key SET NOT NULL;

-- Eliminar índice condicional anterior si existe
DROP INDEX IF EXISTS public.signals_dedup_key_idx;

-- Crear índice único absoluto
CREATE UNIQUE INDEX IF NOT EXISTS signals_dedup_key_unique
  ON public.signals(dedup_key);

-- 7️⃣ Crear/actualizar trigger para completar campos faltantes
CREATE OR REPLACE FUNCTION public.fill_signal_defaults() 
RETURNS TRIGGER AS $$
DECLARE
  risk NUMERIC;
  reward NUMERIC;
BEGIN
  -- Si no viene dedup_key, generar uno
  IF NEW.dedup_key IS NULL THEN
    NEW.dedup_key := gen_random_uuid()::text;
  END IF;

  -- Copiar symbol → instrument si instrument está vacío
  IF NEW.instrument IS NULL THEN
    NEW.instrument := COALESCE(
      (NEW.audit_trail->>'symbol')::TEXT,
      'UNKNOWN'
    );
  END IF;

  -- Auto-generar title si no viene
  IF NEW.title IS NULL THEN
    NEW.title := NEW.instrument 
                 || ' ' || COALESCE(NEW.direction, '') 
                 || ' ' || COALESCE(NEW.timeframe, '');
    NEW.title := TRIM(NEW.title);
  END IF;

  -- Auto-generar invalidation desde stop_loss
  IF NEW.invalidation IS NULL AND NEW.stop_loss IS NOT NULL THEN
    NEW.invalidation := 'Stop loss @ ' || NEW.stop_loss::TEXT;
  END IF;

  -- Calcular R:R ratio si faltan datos
  IF NEW.rr IS NULL
     AND NEW.entry_price IS NOT NULL
     AND NEW.stop_loss IS NOT NULL
     AND NEW.take_profit IS NOT NULL
  THEN
    risk := ABS(NEW.entry_price - NEW.stop_loss);
    reward := ABS(NEW.take_profit - NEW.entry_price);
    
    IF risk > 0 THEN
      NEW.rr := reward / risk;
    ELSE
      NEW.rr := 0;
    END IF;
  END IF;

  -- Asignar defaults si aún faltan
  IF NEW.source IS NULL THEN NEW.source := 'automated'; END IF;
  IF NEW.result IS NULL THEN NEW.result := 'pending'; END IF;
  IF NEW.status IS NULL THEN NEW.status := 'published'; END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Eliminar trigger anterior si existe y crear uno nuevo
DROP TRIGGER IF EXISTS trg_fill_signal_defaults ON public.signals;
CREATE TRIGGER trg_fill_signal_defaults
  BEFORE INSERT ON public.signals
  FOR EACH ROW 
  EXECUTE FUNCTION public.fill_signal_defaults();

-- 8️⃣ Comentarios para documentación
COMMENT ON COLUMN public.signals.dedup_key IS 
  'Clave de idempotencia (UUID) desde MT5 EA. Obligatoria y única, se genera automáticamente si no viene en payload.';
COMMENT ON COLUMN public.signals.author_id IS 
  'ID del autor. Por defecto: usuario de sistema (00000000-0000-0000-0000-000000000000)';
COMMENT ON FUNCTION public.fill_signal_defaults() IS 
  'Autocompleta campos obligatorios (title, rr, invalidation, dedup_key) antes de INSERT desde MT5 EA';