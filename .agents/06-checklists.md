# 📋 Checklists para Tareas

Usar el checklist correspondiente según el tipo de tarea: `feature`, `fix`, `refactor`, `docs`, `chore`, `staging`, `release`.

---

## 🆕 Checklist: Nueva Feature

### 1. Definición Inicial
- [ ] Identificar nombre del feature en `slug-case` (ej: `ticket-management`, `payment-gateway`)
- [ ] Definir entidades de dominio necesarias y sus comportamientos
- [ ] Definir rutas necesarias y sus meta fields
- [ ] Identificar ports (contratos) que necesitará la infraestructura
- [ ] Decidir si este cambio será **MINOR** (nueva funcionalidad compatible) o **MAJOR** (breaking change)

### 2. Dominio (`domain/`)
- [ ] Crear entidad en `features/<feature>/domain/entities/{entity}.entity.ts`
- [ ] Crear ports en `features/<feature>/domain/ports/{service}.port.ts`
- [ ] Crear constantes/enums en `features/<feature>/domain/constants/`
- [ ] Verificar que `domain/` NO importa Vue, Pinia, Axios, ni ningún framework

### 3. Aplicación (`application/`)
- [ ] Crear DTOs con Zod en `features/<feature>/application/dto/`
- [ ] Crear use-cases en `features/<feature>/application/use-cases/`
- [ ] Verificar que use-cases reciben ports por inyección, no instancian infraestructura directamente
- [ ] Verificar que use-cases NO usan `ref`, `reactive`, ni `useRouter`

### 4. Infraestructura (`infrastructure/`)
- [ ] Implementar repositorios HTTP en `features/<feature>/infrastructure/api/`
- [ ] Implementar repositorios Mock en `features/<feature>/infrastructure/mocks/` (si aplica)
- [ ] Verificar que implementaciones cumplen el contrato del port
- [ ] Crear config de feature en `features/<feature>/infrastructure/config/`

### 5. Presentación (`presentation/`)
- [ ] Crear rutas en `features/<feature>/presentation/routes/{feature}.routes.ts`
- [ ] Crear constantes de rutas en `features/<feature>/domain/constants/route.constant.ts`
- [ ] Crear views en `features/<feature>/presentation/views/`
- [ ] Crear componentes en `features/<feature>/presentation/components/`
- [ ] Crear composables en `features/<feature>/presentation/composables/`
- [ ] Crear stores locales en `features/<feature>/presentation/stores/` (solo si el estado es intra-feature)
- [ ] Crear queries TanStack en `features/<feature>/presentation/queries/` (solo para datos de servidor)

### 6. UI & Estilos
- [ ] Usar componentes base de `@/shared/components/ui/`
- [ ] NO usar `<style scoped>` ni CSS custom
- [ ] Usar solo clases utilitarias de Tailwind
- [ ] Iconos vía `lucide-vue-next`, nunca SVG inline

### 7. Estado
- [ ] Estado efímero de componente → `ref`/`computed` local
- [ ] Estado compartido intra-feature → Pinia local
- [ ] Estado global cross-feature → `app/stores/`
- [ ] Datos servidor → TanStack Query
- [ ] Nunca un feature importa el store de otro feature

### 8. Verificación de arquitectura
- [ ] No hay imports de otros features
- [ ] `domain/` es 100% puro (sin frameworks)
- [ ] `application/` orquesta dominio sin saber de UI
- [ ] `infrastructure/` implementa ports sin lógica de negocio
- [ ] `presentation/` es lo único Vue-specific

### 9. Tests & Build
- [ ] `npm run type-check` pasa sin errores
- [ ] Tests existentes (si los hay) siguen pasando
- [ ] `npm run build` genera el bundle correctamente

### 10. Git Flow — Feature → Develop
- [ ] Rama creada desde `develop`: `git checkout -b feature/<nombre>`
- [ ] Commits siguen Conventional Commits (`feat(scope): descripción`)
- [ ] No hay commits de debug, secrets ni archivos temporales en el diff
- [ ] Merge a `develop` con `--no-ff`: `git checkout develop && git merge feature/<nombre> --no-ff`
- [ ] Rama de feature eliminada localmente
- [ ] `develop` pusheado a `origin`

### 11. Changelog
- [ ] CHANGELOG.md actualizado con entrada bajo `[Unreleased]` → `### Added`

---

## 🐛 Checklist: Fix / Bug

### 1. Diagnóstico
- [ ] Reproducir el bug consistentemente
- [ ] Identificar la capa donde reside el error (domain, application, infrastructure, presentation)
- [ ] Verificar si es un error de lógica de negocio, un error de adapter, o un error de UI
- [ ] Decidir si este cambio será **PATCH** (fix normal en develop) o **HOTFIX** (urgente desde main)

### 2. Corrección
- [ ] Implementar la menor cantidad de cambios posible (principio de mínima sorpresa)
- [ ] Si el fix está en `domain/`, agregar/regresar tests unitarios
- [ ] Si el fix está en `infrastructure/`, verificar que no rompe el contrato del port
- [ ] Si el fix está en `presentation/`, verificar que no introduce regresiones de estado

### 3. Tests & Build
- [ ] `npm run type-check` pasa
- [ ] Tests existentes pasan
- [ ] `npm run build` pasa

### 4. Git Flow — Fix → Develop
- [ ] Rama creada desde `develop`: `git checkout -b fix/<descripcion>`
- [ ] Commits siguen Conventional Commits (`fix(scope): descripción`)
- [ ] Merge a `develop` con `--no-ff`
- [ ] Rama de fix eliminada localmente

### 5. Changelog
- [ ] CHANGELOG.md actualizado con entrada bajo `[Unreleased]` → `### Fixed`

---

## 🔧 Checklist: Mejora / Refactor

### 1. Justificación
- [ ] La mejora resuelve una deuda técnica documentada o mejora legibilidad/performance
- [ ] No cambia el comportamiento externo (si es refactor puro)
- [ ] Decidir si este cambio es **PATCH** (refactor interno) o **MINOR** (mejora visible para el usuario)

### 2. Ejecución
- [ ] Cambios atómicos: un concepto por commit
- [ ] Si se renombra algo, actualizar TODAS las referencias (no dejar imports rotos)
- [ ] Si se mueve un archivo, verificar que los imports se actualizan

### 3. Tests & Build
- [ ] `npm run type-check` pasa
- [ ] Tests pasan
- [ ] `npm run build` pasa

### 4. Git Flow — Refactor → Develop
- [ ] Rama creada desde `develop`: `git checkout -b refactor/<descripcion>`
- [ ] Commits siguen Conventional Commits (`refactor(scope): descripción`)
- [ ] Merge a `develop` con `--no-ff`

### 5. Changelog
- [ ] CHANGELOG.md actualizado con entrada bajo `[Unreleased]` → `### Changed`

---

## 📄 Checklist: Docs / Chore

- [ ] El cambio no afecta lógica de negocio
- [ ] `npm run type-check` pasa (si toca código)
- [ ] CHANGELOG.md actualizado (si aplica)
- [ ] Commits siguen Conventional Commits (`docs:` o `chore:`)

---

## 🚀 Checklist: Promover Develop → Staging

> **Cuándo usar**: Cuando el usuario dice "pásalo a staging", "despliega a staging" o "quiero probar en staging".

### 1. Pre-condiciones
- [ ] `develop` tiene todos los tests pasando (`npm run type-check`, `npm run test`, `npm run build`)
- [ ] Las features/fixes que se van a probar ya están mergeados en `develop`

### 2. Merge a Staging
- [ ] `git checkout staging && git pull origin staging`
- [ ] `git merge develop --no-ff -m "chore(staging): sync develop into staging"`
- [ ] Resolver conflictos si los hay (preferir versión de `develop` si es código nuevo)
- [ ] `git push origin staging`

### 3. Reporte
- [ ] Listar qué cambios incluye esta versión de staging (basado en CHANGELOG `[Unreleased]`)
- [ ] Sugerir al usuario que ejecute sus pruebas manuales / QA en staging
- [ ] Si el usuario reporta bugs en staging: corregir en una rama `fix/*` desde `develop`, mergear a `develop`, y re-mergear `develop → staging`

---

## 🏷️ Checklist: Promover Staging → Main (Release)

> **Cuándo usar**: Cuando staging está validado por QA y el usuario dice "pasa a producción", "release" o "PR a main".

### 1. Preparación
- [ ] `staging` tiene todos los tests pasando
- [ ] Se decidió la versión objetivo revisando `[Unreleased]` en CHANGELOG:
  - ¿Hay breaking changes? → **MAJOR** bump (`X+1.0.0`)
  - ¿Hay nuevas features? → **MINOR** bump (`X.Y+1.0`)
  - ¿Solo fixes y mejoras internas? → **PATCH** bump (`X.Y.Z+1`)
- [ ] CHANGELOG.md tiene la versión final documentada (mover `[Unreleased]` a `## [X.Y.Z] - YYYY-MM-DD`)

### 2. Pull Request Staging → Main
- [ ] Crear Pull Request en GitHub/GitLab: origen `staging`, destino `main`
- [ ] Título del PR: `Release vX.Y.Z`
- [ ] Descripción del PR: copiar el contenido de la sección `## [X.Y.Z]` del CHANGELOG
- [ ] Asignar reviewer si aplica

### 3. Merge y Tag
- [ ] Una vez aprobado el PR, hacer **merge commit** (NO squash) para preservar historia
- [ ] `git checkout main && git pull origin main`
- [ ] `git tag -a vX.Y.Z -m "Release vX.Y.Z - <breve descripción>"`
- [ ] `git push origin vX.Y.Z`

### 4. Sincronización descendente
- [ ] `git checkout develop && git merge main --no-ff -m "chore(merge): sync release vX.Y.Z into develop"`
- [ ] `git push origin develop`
- [ ] Opcional: resetear `staging` a `main` si se quiere staging limpio para el siguiente ciclo

### 5. Hotfix (si aplica después del release)
- [ ] Si surge bug crítico en producción (`main`):
  - `git checkout main && git checkout -b hotfix/vX.Y.Z+1`
  - Corregir + test + commit + merge a `main` + tag `vX.Y.Z+1`
  - Propagar a `develop` y `staging`
