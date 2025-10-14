# Integration Notes - LessonView TOC/Progress UI

## Decisiones de Arquitectura

### 1. Orden de Hooks (CRÍTICO para estabilidad)

**Problema resuelto:** "Rendered more hooks than during the previous render"

**Causa raíz:** 
- Los hooks (`useEffect`) se ejecutaban DESPUÉS de los early returns (`isLoading`, `!lesson`)
- Esto causaba que el número total de hooks variara entre renders

**Solución implementada:**
```typescript
// ✅ CORRECTO: Todos los hooks ANTES de cualquier return
const LessonView = () => {
  // 1. Todos los hooks (useState, useQuery, useEffect, etc.)
  const lesson = useQuery(...)
  const resources = useQuery(...)
  const { topics } = useLessonTopics(...)
  useEffect(...) // Video tracking
  useEffect(...) // Progress updates
  
  // 2. DESPUÉS de todos los hooks, returns condicionales
  if (isLoading) return <Skeleton />
  if (!lesson) return <NotFound />
  
  // 3. Render principal
  return <div>...</div>
}
```

### 2. Feature Flag Pattern

**Patrón usado:**
- El flag `academy.lesson_toc` se evalúa al inicio
- Los hooks se ejecutan SIEMPRE (independientemente del flag)
- El gating ocurre en:
  - **Renderizado**: `<div className={tocEnabled ? 'block' : 'hidden'}>`
  - **Lógica interna**: `if (!tocEnabled) return;` dentro de useEffect

**❌ Anti-patrón evitado:**
```typescript
// NUNCA hacer esto:
if (tocEnabled) {
  useEffect(...) // ❌ Hook condicional
}
```

### 3. Componentes y Separación

**LessonView.tsx:**
- Orquestador principal
- Maneja queries, mutations, tracking
- TODOS los hooks están declarados al inicio

**useLessonTopics.ts:**
- Adapter que extrae topics del payload existente
- Retorna valores dummy cuando flag está OFF
- No requiere cambios de esquema

**LessonTOCSidebar.tsx:**
- Componente presentacional
- Siempre renderizado (hidden via CSS cuando flag OFF)
- Usa `useIsMobile` hook de shadcn

**lessonTracking.ts:**
- Utilities puras para localStorage
- Sin hooks, solo funciones

### 4. Patron de Ref Registration

**Problema:** Necesitamos refs a elementos DOM para scroll, pero condicionalmente

**Solución:**
```typescript
// En LessonView
<div ref={(el) => tocEnabled && registerTopicRef('topic-video', el)}>

// En useLessonTopics
const registerTopicRef = useCallback((topicId: string, el: HTMLElement | null) => {
  if (!tocEnabled) return; // Early exit si flag OFF
  topicRefs.set(topicId, el);
}, [tocEnabled, topicRefs]);
```

## Checklist de QA

### ✅ Escenarios Probados

- [ ] **Flag OFF:** UI idéntica al estado anterior
  - Sin sidebar visible
  - Sin tracking de progreso
  - Funcionalidad original intacta

- [ ] **Flag ON + Payload NULL:** No crashea
  - Skeleton loader muestra correctamente
  - No hay error de hooks

- [ ] **Flag ON + Cambio de lección:** Hooks estables
  - Navegar entre lecciones con diferente número de topics
  - No aparece error "more hooks than previous render"

- [ ] **Sidebar collapse:** No afecta hooks del padre
  - Expandir/colapsar sidebar
  - Estado persiste en localStorage

- [ ] **Tracking de progreso:**
  - Video al 80% marca topic como completo
  - Click en recurso marca completo
  - Quiz completion marca completo
  - Barra de progreso se actualiza

- [ ] **Mobile responsive:**
  - Sidebar se convierte en bottom sheet
  - Botón flotante funciona correctamente
  - No tapa CTAs ni player

- [ ] **Payload desde Admin:**
  - Markdown con h2 headings parsea correctamente
  - Bloques especiales (:::trading-sim, :::tip) generan topics
  - Resources mapeados correctamente
  - Quiz detection funciona

### 🔍 Puntos de Inyección

**LessonView.tsx:**
- **Línea 19-140:** Sección de hooks (TODO debe estar aquí)
- **Línea 142-183:** Early returns seguros (después de hooks)
- **Línea 216-225:** Sidebar renderizado (siempre, hidden via CSS)
- **Línea 264, 282, 310, 354:** Topic ref registration (condicional)

**useLessonTopics.ts:**
- **Línea 82:** Check de flag para retornar valores dummy
- **Línea 88-148:** Parsing de topics desde payload

**LessonTOCSidebar.tsx:**
- **Línea 140:** `useIsMobile` hook (shadcn)
- **Línea 141-144:** `useState` para collapse (localStorage)
- Sin `useEffect` problemáticos

## Reglas de Oro

### ✅ Hacer:
1. Declarar TODOS los hooks al inicio del componente
2. Early returns DESPUÉS de todos los hooks
3. Renderizado condicional con CSS (`hidden`) no con JS (`{flag && <C/>}`)
4. Refs registration condicional dentro del callback
5. useEffect siempre ejecutado, lógica interna condicional

### ❌ Evitar:
1. Hooks dentro de condicionales o loops
2. Early returns antes de declarar hooks
3. Renderizado condicional de componentes con hooks (`{flag && <Sidebar/>}`)
4. Cambiar número de hooks entre renders
5. Llamar hooks en funciones callback

## Comandos de Verificación

```bash
# Sin flag
VITE_TALAMO_FLAGS="" npm run dev

# Con flag
VITE_TALAMO_FLAGS="academy.lesson_toc" npm run dev

# Build production
npm run build && npm run preview
```

## Métricas de Éxito

- **0 errores** de hooks en consola
- **UI idéntica** con flag OFF vs estado anterior
- **+15% finalización** de lecciones (objetivo)
- **100% funcionalidad** de Admin preservada
- **0 cambios** de esquema/endpoints
