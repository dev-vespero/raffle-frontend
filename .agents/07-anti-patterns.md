# 🚫 Anti-Patrones (NO HACER)

Estas son las prohibiciones absolutas del proyecto. Si ves una de estas, corrígela inmediatamente.

---

## ❌ Arquitectura

| Prohibición | Por qué está mal | Cómo hacerlo bien |
|-------------|------------------|-------------------|
| Importar entre features | Rompe el encapsulamiento LEGO. Un feature no puede conocer a otro. | Usar `app/stores/` para estado cross-feature o el Event Bus (`core/composables/use-event-bus.ts`). |
| Lógica de negocio en componentes Vue | El componente deja de ser desechable. Imposible testear sin montar Vue. | Mover lógica a `application/use-cases/` o `domain/entities/`. |
| Llamadas HTTP directas desde `presentation/` | Acopla la UI a Axios/fetch. Rompe Ports & Adapters. | Usar repositorios que implementan ports definidos en `domain/ports/`. |
| `domain/` importa Vue, Pinia, Axios, etc. | Contamina la capa pura. Pierde testabilidad en Node. | `domain/` solo TypeScript puro. Sin frameworks. |
| `application/` usa `ref`, `reactive`, `useRouter` | La capa de aplicación orquesta dominio, no UI. | Estado reactivo vive en `presentation/`. |
| Repositorio sin port correspondiente | Código muerto o acoplamiento oculto. | Todo adapter debe implementar una interfaz de `domain/ports/`. |
| Guard importa store de otro feature | Rompe independencia entre features. | Guards usan `app/stores/` (estado global) o verifican meta fields. |

## ❌ Estado

| Prohibición | Por qué está mal | Cómo hacerlo bien |
|-------------|------------------|-------------------|
| Guardar estado de UI en TanStack Query | Abuso de cache. Query es para datos servidor, no flags de UI. | Estado de UI en `ref` local o Pinia store. |
| Cachear respuestas HTTP en Pinia local | Reinventa TanStack Query. Problemas de stale data y race conditions. | Usar `presentation/queries/` con TanStack Query. |
| Elevar `ref` local a store "por si acaso" | Store inflado. Difícil de rastrear y mantener. | Mantener `ref` local si solo lo usa un componente. |
| Hacer reactivas las entidades de dominio | `class Ticket { @ref price }` acopla dominio a Vue. | Entidades son clases/objetos puros. La reactividad va en `presentation/`. |
| Un feature lee/escribe store de otro feature | Acoplamiento directo. Ya no son LEGO. | Estado cross-feature va en `app/stores/`. |

## ❌ UI & Estilos

| Prohibición | Por qué está mal | Cómo hacerlo bien |
|-------------|------------------|-------------------|
| Usar `<style scoped>` o CSS custom | Rompe consistencia del design system. | Tailwind utility classes exclusivamente. |
| Crear componentes personalizados ad-hoc | Fragmentación visual. Cada página se ve diferente. | Reutilizar componentes base de `@/shared/components/ui/`. |
| Pasar clases Tailwind sueltas como props | Difícil de mantener. Rompe abstracción del componente. | Usar props de variante (`variant="elevated"`). |
| SVG inline en templates | Inconsistencia de iconos. No hay átomo de icono controlado. | `lucide-vue-next` importado como componente. |
| Hardcodear strings de contenido | Imposible internacionalizar. | Usar constantes o composables de i18n si aplica. |

## ❌ Rutas

| Prohibición | Por qué está mal | Cómo hacerlo bien |
|-------------|------------------|-------------------|
| Hardcodear paths (`router.push('/tickets/123')`) | Refactor imposible si cambia la URL. | Usar nombres de ruta (`router.push({ name: TICKET_ROUTES.DETAIL, params: { id } })`). |
| Declarar rutas de otro feature | Acoplamiento. Rompe auto-registro. | Cada feature solo declara sus rutas propias. |
| Lazy load fuera del feature | `app/router` conoce internals del feature. | Los lazy imports deben ser relativos dentro del propio feature (`../views/...`). |

## ❌ Nomenclatura

| Prohibición | Por qué está mal | Cómo hacerlo bien |
|-------------|------------------|-------------------|
| Composable sin prefijo `use-` | No es reconocible como composable. | `use-fetch-tickets.ts`, nunca `ticketService.ts` en `composables/`. |
| Prefijo `I` en interfaces | Convención antigua. En TypeScript no es necesario. | `TicketRepository`, no `ITicketRepository`. |
| Archivo de enum con nombre de entidad | Una entidad puede tener múltiples enums. | `ticket-status.enum.ts`, no `ticket.enum.ts`. |
| Store exportado como función sin `use` + `Store` | Difícil de identificar en imports. | `useTicketManagementStore` (PascalCase, `use` + `Store`). |
