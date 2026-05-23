# 🔧 Workflow CI — Tests, Commits, Git Flow & Releases

> **Propósito**: Proceso obligatorio que debe ejecutarse al final de **cualquier** tarea que modifique código (`feature`, `fix`, `refactor`, `chore` con código).
> Sigue **Git Flow** con una rama `staging` intermedia entre `develop` y `main`.

---

## 1. Precondiciones

Antes de tocar código, asegúrate de que ya leíste los subagentes obligatorios según el tipo de tarea (ver `AGENTS.md` → Flujo de Orquestación).

---

## 2. Implementación

- Sigue las reglas de los subagentes leídos.
- Coloca cada archivo en la carpeta correcta según `.agents/01-architecture.md`.
- Respeta los anti-patrones de `.agents/07-anti-patterns.md`.

---

## 3. Verificación Automática (Tests & Build)

> **El usuario puede pedirme directamente: "verifica mis cambios" o "corre los tests". Debo ejecutar los siguientes comandos y reportar resultados.**

Ejecuta en orden y reporta el resultado:

```bash
# 1. Type check obligatorio
npm run type-check
```
- [ ] **DEBE pasar sin errores.** Si falla, corrige antes de continuar.

```bash
# 2. Tests unitarios (si el proyecto tiene suite de tests)
npm run test
```
- [ ] **Todos los tests existentes deben seguir pasando.**
- [ ] Si agregaste lógica de dominio, considera agregar tests unitarios para ella.

```bash
# 3. Build (verificación final)
npm run build
```
- [ ] **Build debe completarse exitosamente.**

> **Si el usuario dice: "solo verifica" o "no commitees todavía"**, detente aquí y reporta resultados. No continues a paso 4.

---

## 4. Commit

Si y solo si los pasos anteriores pasaron **y el usuario no dijo lo contrario**, procede al commit:

1. Revisa `git status` y `git diff`.
2. Stagea solo los archivos intencionales (no secrets, no archivos temporales).
3. Escribe un mensaje de commit claro y descriptivo siguiendo **Conventional Commits**:

```
<type>(<scope>): <descripción breve en imperativo>

<body opcional explicando el porqué>
```

Tipos permitidos:
- `feat`: nueva feature
- `fix`: corrección de bug
- `refactor`: refactor sin cambio de comportamiento
- `docs`: solo documentación
- `chore`: tareas de mantenimiento
- `test`: agregar o corregir tests
- `ci`: cambios en CI/CD o workflow

Ejemplo:
```
feat(ticket-management): add ticket filtering by status and priority

Implements use-case, repository port and UI components following
vertical slice architecture. Adds local Pinia store for filter state.
```

- [ ] Commit realizado.

> **NOTA**: NO hacer force-push, amend a menos de que se solicite explícitamente, ni commits vacíos.

---

## 5. Flujo Git Flow con Staging

### 📋 Resumen de ramas

| Rama | Propósito | Origen | Destino |
|------|-----------|--------|---------|
| `main` | Producción estable. Refleja exactamente lo que está en producción. | Merge de `staging` (vía PR) o `hotfix/*` | — |
| `develop` | Integración continua. Rama por defecto para desarrollo. Todas las features se integran aquí. | — | `staging` |
| `staging` | Pre-producción / QA. Refleja el estado que se está probando antes de liberar a `main`. | Merge de `develop` | `main` (vía PR) |
| `feature/*` | Desarrollo de una feature aislada. | `develop` | `develop` (merge `--no-ff`) |
| `fix/*` | Corrección de bug no urgente. | `develop` | `develop` |
| `hotfix/*` | Corrección urgente en producción. | `main` | `main` y `develop` (y opcionalmente `staging`) |
| `release/vX.Y.Z` | Preparación formal de release (opcional si staging es suficiente). | `develop` | `staging` o `main` |

### 🔄 Flujo de vida completo

```
feature/ticket-filter
   |
   | (desarrollo + tests + commit)
   v
develop
   |
   | (merge --no-ff de la feature)
   v
staging
   |
   | (pruebas manuales / QA / staging deploy)
   | (si falla: fix → develop → staging)
   v
Pull Request → main
   |
   | (review + aprobación + merge)
   v
main (producción estable)
   |
   | (si bug crítico en prod)
   v
hotfix/v1.2.1 ──→ main + develop + staging
```

### 🏷️ Política de versionado (SemVer)

Formato: `MAJOR.MINOR.PATCH` (ej: `1.2.3`)

| Cambio en versión | Cuándo aplicar | Ejemplo |
|-------------------|----------------|---------|
| **MAJOR** (`X+1.0.0`) | Breaking change. Incompatible con versiones anteriores. | Cambio de API pública, eliminación de rutas, cambio de contrato de dominio. |
| **MINOR** (`X.Y+1.0`) | Nueva feature. Compatible hacia atrás. | Nueva feature, nueva ruta, nuevo componente reutilizable. |
| **PATCH** (`X.Y.Z+1`) | Fix o mejora interna. Compatible hacia atrás. | Corrección de bug, refactor interno, mejora de performance. |

### 📝 Comandos por escenario

#### A. Iniciar una tarea (Feature o Fix)

```bash
# 1. Asegúrate de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crea la rama de trabajo
git checkout -b feature/nombre-de-la-tarea
# o
git checkout -b fix/descripcion-del-bug
```

#### B. Finalizar una tarea (merge a develop)

```bash
# 1. Asegúrate de que la rama de trabajo está limpia y pasó tests
git checkout feature/nombre-de-la-tarea

# 2. Actualiza con develop por si hubo cambios concurrentes
git rebase develop
# (o merge si prefieres: git merge develop)

# 3. Merge a develop
git checkout develop
git merge feature/nombre-de-la-tarea --no-ff -m "feat(ticket-management): merge feature"

# 4. Limpia la rama local
git branch -d feature/nombre-de-la-tarea

# 5. Push de develop
git push origin develop
```

#### C. Promover develop → staging (para QA)

```bash
# 1. Actualiza staging con lo último de develop
git checkout staging
git pull origin staging
git merge develop --no-ff -m "chore(staging): sync develop into staging"
git push origin staging

# 2. Despliega staging si aplica (el usuario maneja el deploy)
# npm run build && deploy-to-staging...
```

#### D. Preparar release a producción (staging → main)

```bash
# 1. Asegúrate de que staging está validado (QA pasó, pruebas OK)
git checkout staging
git pull origin staging

# 2. Crea un PR (Pull Request) en GitHub/GitLab de staging → main
# Esto se hace vía UI de GitHub/GitLab. Desde CLI puedes usar gh/cli.
# El PR debe incluir:
#   - Título descriptivo con versión: "Release v1.2.0"
#   - Descripción copiada del CHANGELOG.md para esta versión
#   - Checklist de validación

# 3. Una vez aprobado el PR, merge en main (siempre merge commit, NO squash para preservar historia)
# Desde GitHub/GitLab UI: "Create a merge commit"
```

#### E. Taguear release estable

```bash
# Después de que el PR staging→main fue mergeado:
git checkout main
git pull origin main

# Decidir versión revisando CHANGELOG:
# - Breaking changes → MAJOR bump
# - Nuevas features → MINOR bump
# - Solo fixes → PATCH bump

git tag -a v1.2.0 -m "Release v1.2.0 - Ticket filtering and payment gateway"
git push origin v1.2.0
```

#### F. Hotfix urgente (producción)

```bash
# 1. Crea hotfix desde main (producción actual)
git checkout main
git pull origin main
git checkout -b hotfix/v1.2.1

# 2. Aplica la corrección mínima + tests + commit

# 3. Merge a main + tag
git checkout main
git merge hotfix/v1.2.1 --no-ff -m "fix(auth): hotfix login timeout"
git tag -a v1.2.1 -m "Hotfix v1.2.1 - login timeout"
git push origin main
git push origin v1.2.1

# 4. Propaga el fix a develop y staging
git checkout develop
git merge main --no-ff -m "chore(merge): sync hotfix v1.2.1 into develop"
git push origin develop

git checkout staging
git merge main --no-ff -m "chore(merge): sync hotfix v1.2.1 into staging"
git push origin staging

# 5. Limpia
git branch -d hotfix/v1.2.1
```

### 🔴 Reglas de oro del flujo

1. **Nunca commitear directamente en `main`** o `staging`. Solo vía merge de otras ramas.
2. **Nunca pushear código sin pasar tests** en la rama de trabajo.
3. **Staging es la única rama que puede tener bugs** (por eso existe). Si hay bug en staging, se fixea en `develop` y se re-mergea.
4. **Main refleja producción**. Si hay un bug en main, es hotfix urgente.
5. **Feature branches son desechables**. Se crean desde `develop`, se mergean y se borran.
6. **Usar `--no-ff`** en los merges para preservar la historia de qué feature entró en qué momento.

---

## 6. Changelog

Actualiza `.agents/CHANGELOG.md` agregando una entrada bajo la sección `## [Unreleased]` con el formato de [Keep a Changelog](https://keepachangelog.com/):

```markdown
### <Tipo>
- <Descripción del cambio> ([#<issue/PR>])
```

Categorías permitidas: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

Ejemplo:
```markdown
## [Unreleased]

### Added
- feat(ticket-management): filtrado de tickets por estado y prioridad.

### Fixed
- fix(auth): redirección post-login cuando redirect query param está ausente.
```

**Al momento de release**, mover el contenido de `[Unreleased]` a una nueva versión:

```markdown
## [1.2.0] - 2026-05-30

### Added
- feat(ticket-management): filtrado de tickets por estado y prioridad.
```

- [ ] CHANGELOG.md actualizado.

---

## 7. Verificación Final del Checklist

Según el tipo de tarea, abre `.agents/06-checklists.md` y marca cada ítem:

- [ ] Checklist de Nueva Feature (si aplica)
- [ ] Checklist de Fix (si aplica)
- [ ] Checklist de Mejora / Refactor (si aplica)
- [ ] Checklist de Docs / Chore (si aplica)
- [ ] Checklist de Git & Staging (si aplica)

Reporta al usuario:
1. Qué se hizo.
2. Resultado de tests/type-check/build.
3. Rama(s) creada(s) y merge(s) realizado(s).
4. Estado del checklist (completado / ítems pendientes con justificación).
5. Referencia al commit y CHANGELOG.
6. Siguiente paso sugerido (ej: "Listo para promover a staging" o "PR listo: staging → main").

---

**Última actualización**: 2026-05-23
