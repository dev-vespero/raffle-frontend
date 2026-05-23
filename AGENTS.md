# 🤖 OpenCode Agent Orchestrator — Moto Moto Rifas

> **Propósito**: Este archivo es el punto de entrada. NO contiene reglas técnicas directas. Su único trabajo es **delegar** a los subagentes especializados que viven en `.agents/*`.

---

## 🗺️ Mapa de Subagentes

| Subagente | Archivo | Cuándo usar |
|-----------|---------|-------------|
| **Arquitectura** | `.agents/01-architecture.md` | Siempre. Stack, carpetas, nomenclatura. Base obligatoria. |
| **Patrones** | `.agents/02-patterns.md` | Al diseñar `domain/`, `application/`, `infrastructure/`. |
| **Estado** | `.agents/03-state-management.md` | Al decidir dónde poner un estado o elegir tecnología reactiva. |
| **Rutas** | `.agents/04-routing.md` | Al crear/modificar rutas, guards o navegación. |
| **UI & Estilos** | `.agents/05-ui-styles.md` | Al construir componentes visuales o usar el design system. |
| **Checklists** | `.agents/06-checklists.md` | Al iniciar cualquier feature, fix, mejora, staging o release. |
| **Anti-Patrones** | `.agents/07-anti-patterns.md` | Como referencia rápida de prohibiciones. |
| **Referencias** | `.agents/08-references.md` | Snippets, imports comunes, comandos. |
| **Workflow CI** | `.agents/09-workflow-ci.md` | Proceso obligatorio: tests → commits → git flow → changelog. |

---

## ⚙️ Flujo de Orquestación

Antes de ejecutar cualquier tarea, sigue este flujo:

1. **Clasificar** la petición del usuario en: `feature`, `fix`, `refactor`, `docs`, `chore`, `staging`, o `release`.
2. **Leer** los subagentes obligatorios para esa categoría:
   - **Todas**: Arquitectura + Checklists + Anti-Patrones + Workflow CI
   - **Feature**: + Patrones + Estado + Rutas + UI
   - **Fix**: + Patrones + Estado (si aplica) + Workflow CI
   - **UI puro**: + UI & Estilos
   - **Staging / Promoción**: + Workflow CI (sección 5: Git Flow con Staging)
   - **Release / Versionado**: + Workflow CI (sección 5: Promover Staging → Main)
3. **Ejecutar** la tarea siguiendo las reglas leídas.
4. **Verificar** contra el checklist del subagente correspondiente.
5. **Ejecutar** `.agents/09-workflow-ci.md` según lo que pida el usuario:
   - Si dice **"verifica"**, **"corre tests"** o **"valida"** → ejecuta solo sección 3 (Tests & Build) y reporta resultados. No tocar git.
   - Si dice **"commitea"** o **"termina la tarea"** → ejecuta secciones 3, 4 (Tests + Commit) y si es feature/fix, realiza el merge a `develop` siguiendo Git Flow.
   - Si dice **"pásalo a staging"** o **"despliega staging"** → ejecuta el checklist de Promover Develop → Staging.
   - Si dice **"prepara release"**, **"PR a main"** o **"pasa a producción"** → ejecuta el checklist de Promover Staging → Main.
6. **Reportar** al usuario con el checklist completado y el estado de las ramas.

---

## 📝 Changelog

Toda modificación que salga del workflow CI debe reflejarse en `.agents/CHANGELOG.md`.

Los releases estables deben mover el contenido de `[Unreleased]` a una versión con fecha (`## [X.Y.Z] - YYYY-MM-DD`) siguiendo SemVer.

---

**Última actualización**: 2026-05-23  
**Mantenimiento**: Actualizar este orquestador solo si cambia la estructura de `.agents/`.
