# NO-BREAK GUARDRAILS - Talamo Pro Hub

## Matriz de Riesgos

| Componente | Nivel de Riesgo | Descripción | Mitigación |
|------------|----------------|-------------|------------|
| Landing/Onboarding Flow | **CRÍTICO** | Flujo principal de adquisición de usuarios | NO MODIFICAR sin flags, pruebas E2E obligatorias |
| Endpoints Existentes | **CRÍTICO** | /api/partner/affiliation, /api/auth/register | Mantener contratos exactos, versionar por separado |
| UI/UX Landing | **CRÍTICO** | Textos, flujos, validaciones visibles | Solo cambios detrás de flags |
| Dashboard Navigation | **ALTO** | Enlaces principales Academy/Signals/Copy | Solo agregar, no modificar existentes |
| Supabase RLS | **ALTO** | Políticas de seguridad | Probar exhaustivamente antes de deploy |

## Feature Flags

| Flag | Estado Default | Descripción | Rollback |
|------|---------------|-------------|----------|
| `academy_v1` | OFF | Módulo de Academia | Remover flag de .env |
| `signals_v1` | OFF | Módulo de Señales de Trading | Remover flag de .env |
| `copy_v1` | OFF | Módulo de Copy Trading | Remover flag de .env |
| `rbac_v1` | OFF | Sistema RBAC avanzado | Remover flag de .env |
| `obs_v1` | OFF | Observabilidad y métricas | Remover flag de .env |
| `api_v1` | OFF | Nuevos endpoints versionados | Remover flag de .env |

## Checklist de Release

### Pre-Deploy
- [ ] Todas las pruebas de humo pasan (npm run test:smoke)
- [ ] Linting limpio (npm run lint:ci)
- [ ] TypeScript sin errores (npm run typecheck)
- [ ] Feature flags configurados correctamente en .env
- [ ] Secrets sensibles no están en el bundle
- [ ] Contract tests pasan para endpoints existentes

### Deploy
- [ ] Deploy con flags OFF por defecto
- [ ] Verificar que flujos existentes funcionan idénticamente
- [ ] Activar flags uno por uno con monitoreo
- [ ] Verificar logs de errores y métricas de rendimiento

### Post-Deploy
- [ ] Monitorear logs durante 24h
- [ ] Verificar que no hay nuevas excepciones en consola
- [ ] Confirmar que tiempos de respuesta se mantienen
- [ ] Plan de rollback preparado

## Plan de Rollback

### Rollback Inmediato (< 5 min)
1. Desactivar todos los feature flags en .env:
   ```bash
   TALAMO_FLAGS=""
   ```
2. Restart de la aplicación
3. Verificar que funcionalidad original está intacta

### Rollback de Base de Datos (si aplica)
1. Las migraciones deben ser siempre backward-compatible
2. No se permiten DROP COLUMN o cambios destructivos
3. Usar feature flags para nueva funcionalidad de DB

### Rollback de API (si aplica)
1. Endpoints versionados (/api/v1/*) se pueden desactivar
2. Endpoints existentes NUNCA se modifican
3. Proxy/adapter pattern para mantener compatibilidad

## Contratos Protegidos (NO TOCAR)

### Endpoints
- `POST /api/partner/affiliation` - Debe mantener misma respuesta (401/429/400/200)
- `POST /api/auth/register` - Debe mantener mismo flow
- Códigos de error y mensajes EXACTOS

### UI/UX 
- Textos de validación de afiliación
- Flujo choose → validate → eligible/blocked  
- Navegación del dashboard existente
- Estilos y layouts actuales

### Variables Críticas
- PARTNER_ID: "1141465940423171000" 
- PARTNER_LINK: debe mantener mismo comportamiento visible

## Procedimientos de Emergencia

### Detección de Problemas
- Monitorear logs cada 30 min post-deploy
- Alertas automáticas si error rate > 5%
- Verificación manual de flujo crítico cada 2h

### Escalación
1. **Nivel 1**: Desactivar feature flag específico
2. **Nivel 2**: Desactivar todos los flags (rollback completo)
3. **Nivel 3**: Revert commit completo si es necesario

### Contactos de Emergencia
- Responsable técnico: [DEFINIR]
- Product Owner: [DEFINIR]  
- DevOps/Infra: [DEFINIR]

## Testing Obligatorio

### Smoke Tests (Obligatorio antes de cada deploy)
- Landing page render sin errores
- Flujo completo choose → validate → eligible
- Dashboard navigation básica
- Formularios con mocks (todos los códigos de respuesta)

### Contract Tests 
- Verificar shape exacto de respuestas API
- Mismos códigos de error
- Mismos timeouts y comportamientos

### Performance Baselines
- Time to First Byte < 800ms
- Landing page load < 2s
- API response time < 3s (p95)
- No memory leaks en dashboard navigation

---
**REGLA DORADA: Si hay duda, NO DEPLOYAR. Mejor tarde que roto.**