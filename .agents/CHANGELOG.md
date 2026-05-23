# Changelog

Todas las modificaciones notables a este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Changed
- refactor(router): implementado auto-registro de rutas con import.meta.glob y rutas por feature.
- refactor(home): migrado feature home a clean architecture con capas domain/application/infrastructure/presentation.
- Reorganizado `AGENTS.md` monolito en subagentes modulares bajo `.agents/`.
- Creado flujo de orquestación con checklist, tests y commits obligatorios.
- **Git Flow con Staging**: actualizado el flujo profesional para incluir rama `staging` entre `develop` y `main`.
- **Checklists de Staging y Release**: agregados checklists separados para promover `develop → staging` y `staging → main`.
- **Verificación condicional**: el agente ahora distingue entre "verificar" (solo tests), "commitear" (tests + commit + merge a develop) y "pasar a staging/release".

### Added
- Flujo Git profesional en `.agents/09-workflow-ci.md`: ramas (`feature/*`, `fix/*`, `hotfix/*`, `release/*`), versionado SemVer, comandos exactos por escenario.
- Checklist de Git & Release en `.agents/06-checklists.md`.
- Verificación automática en Workflow CI: cuando el usuario pide "verifica" o "corre tests", se ejecutan `type-check`, `test` y `build` sin hacer commit.

---

## Notas de uso

- Agrega entradas bajo `## [Unreleased]`.
- Al releasear, mueve el contenido de `[Unreleased]` a una nueva versión (`## [X.Y.Z] - YYYY-MM-DD`).
- Categorías permitidas: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
