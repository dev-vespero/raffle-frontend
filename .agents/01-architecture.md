# 🏗️ Arquitectura del Proyecto - Moto Moto Rifas Frontend

> **Propósito**: Este documento establece las convenciones y patrones arquitectónicos que DEBEN seguirse al desarrollar nuevas features. Mantener consistencia es obligatorio.

---

## 📦 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Vue | 3.5.34 | Framework con Composition API |
| TypeScript | ~5.7 | Tipado estático |
| Vite | ^8.0 | Build tool |
| Tailwind CSS | ^4.3.0 | Estilos utilitarios |
| Pinia | ^3.0.4 | State management |
| Vue Router | ^4.6.4 | Enrutamiento |
| TanStack Query | ^5.100.11 | Server state / caching |
| Axios | ^1.16.1 | Cliente HTTP |
| Zod | ^4.4.3 | Validación de schemas |
| Lucide Vue Next | ^1.0.0 | Iconos |

---

## 📁 Estructura de Carpetas

```
src/
├── main.ts                          # Entry point
├── App.vue                          # Root layout
│
├── core/                            # Infraestructura compartida
│   ├── api/
│   │   ├── client.ts                # Instancia Axios configurada
│   │   └── error-handler.ts         # Normalización de errores
│   ├── config/                      # Configuración validada
│   │   ├── env.config.ts            # Variables de entorno con Zod
│   │   └── theme.config.ts          # Colores del tema dinámico
│   └── types/
│       └── global.d.ts              # SOLO tipos infraestructurales: ID, Timestamp, Nullable
│
├── features/                        # Vertical Slices (CARPETA PRINCIPAL)
│   └── {feature-name}/
│       ├── domain/                         # Pura. Sin frameworks. Testable en Node.
│       │   ├── constants/
│       │   │   ├── route.constant.ts
│       │   │   └── {entity}.enum.ts
│       │   ├── entities/                   # Modelos con comportamiento + validación
│       │   │   └── {entity}.entity.ts
│       │   └── ports/                      # Interfaces (ports) que la infraestructura implementa
│       │       └── {service}.port.ts       # Ej: IOrderRepository, IPaymentGateway
│       │
│       ├── application/                    # Orquesta dominio. Sin Vue, sin HTTP directo.
│       │   ├── use-cases/                  # Un archivo = un caso de uso completo
│       │   │   └── {action}-{entity}.use-case.ts # Recibe ports por inyección, ejecuta lógica pura
│       │   └── dto/                        # Objetos planos para entrada/salida de use-cases
│       │       └── {action}-{entity}.dto.ts
│       │
│       ├── infrastructure/                 # Adapters externos. Implementa los ports del dominio.
│       │   ├── api/                        # Implementaciones HTTP usando httpClient de shared
│       │   │   └── {entity}.repository.http.ts  # Cumple contrato IOrderRepository
│       │   ├── mocks/                      # JSON mocks cumpliendo mismo contrato
│       │   │   └── {entity}.repository.mock.ts
│       │   └── config/                     # Config específica del feature
│       │       └── {feature}.config.ts
│       │
│       └── presentation/                   # Todo lo Vue-specific. Desechable si migras a React.
|           ├── views/                      # Páginas (rutas)
|           │   └── {entity}-{action}.page.vue
|           ├── components/                 # Componentes atómicos del feature
|           │   └── {entity}-{component}.vue
|           ├── composables/                # Hooks reactivos que orquestan use-cases + stores
|           │   └── use-{action}-{entity}.ts # Llama al use-case, maneja estado UI, errores
|           ├── stores/                     # Estado local del feature (Pinia)
|           │   └── feature.store.ts
|           ├── queries/                    # TanStack Query wrappers (opcional, desacoplable)
|           │   └── feature.query.ts
|           └── routes/                     # Definición de rutas del feature
|               └── feature.route.ts
│    
├── shared/                          # Código reusable cross-feature, sin estado de negocio
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.vue
│   │   │   ├── footer.vue
│   │   │   ├── internal-server-error.vue
│   │   │   └── not-found.vue
│   │   └── ui/
│   │       ├── index.ts             # Barrel export
│   │       ├── core-button.vue
│   │       ├── core-input.vue
│   │       ├── core-select.vue
│   │       ├── core-card.vue
│   │       ├── core-modal.vue
│   │       ├── core-alert.vue
│   │       ├── core-badge.vue
│   │       └── core-loader.vue
│   └── utils/
│       ├── currency.utils.ts
│       └── date.utils.ts
│
├── app/                             # Shell de la aplicación
│   ├── router/
│   │   ├── index.ts                 # Auto-registro: escanea features/*/presentation/routes/
│   │   └── router.factory.ts        # Lógica de registro dinámico
│   ├── stores/
│   │   ├── global.store.ts          # Pinia stores global.sore.ts
│   │   ├── ui.store.ts              # Estado UI global (sidebar, toast, modal)
│   │   └── theme.store.ts           # Tema: puede ir a core/config/ si es puro
│   └── styles/
│       └── global.css               # Renombrado: desde core/config/style.css
```

---

## 📝 Convenciones de Nomenclatura

### 1. Carpetas
| Elemento                      | Convención  | Ejemplos                                             | Regla                                      |
| ----------------------------- | ----------- | ---------------------------------------------------- | ------------------------------------------ |
| **Carpetas raíz**             | `slug-case` | `features/`, `shared/`, `core/`, `app/`              | Siempre plural para contenedores           |
| **Carpetas de feature**       | `slug-case` | `features/ticket-management/`, `features/user-auth/` | Nombre descriptivo del dominio, no técnico |
| **Carpetas internas de capa** | `slug-case` | `domain/entities/`, `presentation/views/`            | Fijos por arquitectura, no cambiar         |

### 2. Archivos
| Elemento                              | Convención                      | Ejemplos                                                        | Regla                                                            |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Entry point / Config**              | `*.config.ts` / `*.d.ts`        | `env.config.ts`, `global.d.ts`, `theme.config.ts`               | Sufijo indica propósito                                          |
| **Entidades de dominio**              | `{entity}.entity.ts`            | `ticket.entity.ts`, `user.entity.ts`                            | Sustantivo singular                                              |
| **Ports (interfaces de repositorio)** | `{contrato}.port.ts`            | `ticket-repository.port.ts`, `payment-gateway.port.ts`          | Indica que es un contrato, no implementación                     |
| **Casos de uso**                      | `{action}-{entity}.use-case.ts` | `create-ticket.use-case.ts`, `cancel-order.use-case.ts`         | Verbo en infinitivo + sustantivo                                 |
| **DTOs**                              | `{action}-{entity}.dto.ts`      | `create-ticket.dto.ts`, `update-user.dto.ts`                    | Paralelo al caso de uso que lo usa                               |
| **Implementaciones HTTP**             | `{entity}.repository.http.ts`   | `ticket.repository.http.ts`, `user.repository.http.ts`          | Indica adapter: `.http`, `.mock`, `.local`                       |
| **Implementaciones Mock**             | `{entity}.repository.mock.ts`   | `ticket.repository.mock.ts`                                     | Mismo contrato, diferente adapter                                |
| **Config de feature**                 | `{feature}.config.ts`           | `ticket-management.config.ts`                                   | Nombre del feature, no del archivo técnico                       |
| **Constantes de dominio**             | `{dominio}.constant.ts`         | `route.constant.ts`, `ticket-status.constant.ts`                | Sustantivo del dominio + `.constant`                             |
| **Enums**                             | `{dominio}.enum.ts`             | `ticket-status.enum.ts`, `user-role.enum.ts`                    | Nunca `{entity}.enum.ts` — un entity puede tener múltiples enums |
| **Páginas/Vistas**                    | `{entity}-{action}.page.vue`    | `ticket-list.page.vue`, `user-profile.page.vue`                 | Sustantivo + verbo + `.page.vue`                                 |
| **Componentes**                       | `{dominio}-{rol}.vue`           | `ticket-card.vue`, `ticket-filter.vue`, `core-button.vue`       | Prefijo de dominio para evitar colisiones                        |
| **Composables**                       | `use-{action}-{entity}.ts`      | `use-create-ticket.ts`, `use-fetch-users.ts`, `use-ui-toast.ts` | Siempre `use-` + verbo + sustantivo. Nunca `useTickets`.         |
| **Stores (archivo)**                  | `{feature}.store.ts`            | `ticket-management.store.ts`, `auth.store.ts`                   | Nombre del feature                                               |
| **Stores (función exportada)**        | `use{Feature}Store`             | `useTicketManagementStore`, `useAuthStore`                      | PascalCase, prefijo `use`, sufijo `Store`                        |
| **Queries TanStack**                  | `{entity}.queries.ts`           | `ticket.queries.ts`, `user.queries.ts`                          | Plural: un archivo agrupa todas las queries de una entidad       |
| **Rutas de feature**                  | `{feature}.routes.ts`           | `ticket-management.routes.ts`, `auth.routes.ts`                 | Nombre del feature                                               |
| **Utilidades**                        | `{dominio}.utils.ts`            | `date.utils.ts`, `currency.utils.ts`, `validation.utils.ts`     | Sustantivo del dominio que resuelve                              |

### 3. Código (dentro de archivos)
| Elemento                 | Convención                                                | Ejemplos                                                                | Regla                                                                                |
| ------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Interfaces**           | `PascalCase`, sin prefijo `I`                             | `Ticket`, `User`, `ApiResponse<T>`, `TicketRepository`                  | Tu port es `ticket-repository.port.ts` pero la interfaz dentro es `TicketRepository` |
| **Tipos**                | `PascalCase`                                              | `TicketId`, `Nullable<T>`, `CreateTicketInput`                          | Diferenciar tipo de interfaz cuando aplica                                           |
| **Enums**                | `PascalCase` para nombre, `UPPER_SNAKE_CASE` para valores | `enum TicketStatus { OPEN = 'open', CLOSED = 'closed' }`                | Valores como constantes                                                              |
| **Clases**               | `PascalCase`                                              | `CreateTicketUseCase`, `HttpTicketRepository`                           | Solo en infraestructura/application si usas clases                                   |
| **Funciones/Variables**  | `camelCase`                                               | `selectedTickets`, `handleSubmit`, `isLoading`                          | Verbo para acciones, sustantivo para estados                                         |
| **Constantes**           | `UPPER_SNAKE_CASE`                                        | `USE_MOCKS`, `MAX_TICKETS_PER_PAGE`, `DEFAULT_TIMEOUT`                  | Solo valores verdaderamente constantes                                               |
| **Booleanos**            | Prefijo `is`, `has`, `should`, `can`                      | `isVisible`, `hasPermission`, `canEdit`                                 | Semántica explícita                                                                  |
| **Event handlers**       | Prefijo `handle`                                          | `handleClick`, `handleSubmit`, `handleTicketCreated`                    | Nunca `onClick` en methods (eso es para props)                                       |
| **Props de componentes** | `camelCase` en definición, `kebab-case` en template       | `defineProps({ userName: String })` → `<ticket-card user-name="..." />` | Vue convierte automáticamente                                                        |
| **Emit events**          | `kebab-case`                                              | `emit('ticket-created')`, `emit('user-logged-out')`                     | Siempre en pasado (indica que ya ocurrió)                                            |
| **Slots**                | `camelCase`                                               | `<slot name="emptyState" />`, `<slot name="itemActions" />`             | Sustantivo descriptivo                                                               |

### 4. Reglas de arquitectura (naming como guardián)
| Regla                                                                                                 | Aplicación                                                                                |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Si un archivo no tiene prefijo de dominio, va en `shared/` o `core/`                                  | `ticket-card.vue` → feature. `core-button.vue` → shared.                                  |
| Si un composable no empieza con `use-`, no es composable                                              | `ticketService.ts` → no es composable, es un servicio (¿dónde va? No en tu arquitectura). |
| Si un archivo en `domain/` importa de `vue`, `pinia`, o `axios`, está mal nombrado o mal ubicado      | `domain/` es puro.                                                                        |
| Si un caso de uso conoce `ref`, `reactive`, o `useRouter`, está mal                                   | `application/` orquesta dominio, no UI.                                                   |
| Si un repositorio en `infrastructure/api/` no implementa un port de `domain/ports/`, es código muerto | Todo adapter debe cumplir un contrato.                                                    |

### 5. Ejemplo completo de un feature aplicando convenciones
```
features/ticket-management/
├── domain/
│   ├── constants/
│   │   ├── route.constant.ts           # TICKET_ROUTES = { LIST: '/tickets', DETAIL: '/tickets/:id' }
│   │   └── ticket-status.enum.ts       # enum TicketStatus { OPEN = 'open', ... }
│   ├── entities/
│   │   └── ticket.entity.ts            # class Ticket { constructor(...) }
│   └── ports/
│       └── ticket-repository.port.ts   # interface TicketRepository { findById(id: TicketId): Promise<Ticket> }
│
├── application/
│   ├── use-cases/
│   │   └── create-ticket.use-case.ts   # class CreateTicketUseCase { constructor(private repo: TicketRepository) }
│   └── dto/
│       └── create-ticket.dto.ts        # interface CreateTicketDto { title: string; description: string }
│
├── infrastructure/
│   ├── api/
│   │   └── ticket.repository.http.ts   # class HttpTicketRepository implements TicketRepository
│   ├── mocks/
│   │   └── ticket.repository.mock.ts   # class MockTicketRepository implements TicketRepository
│   └── config/
│       └── ticket-management.config.ts # { baseUrl: '/api/tickets', useMock: false }
│
└── presentation/
    ├── views/
    │   └── ticket-list.page.vue
    ├── components/
    │   ├── ticket-card.vue
    │   ├── ticket-filter.vue
    │   └── ticket-empty-state.vue
    ├── composables/
    │   ├── use-create-ticket.ts        # Llama a CreateTicketUseCase, maneja toast/loading
    │   └── use-fetch-tickets.ts        # Llama a repo, maneja paginación
    ├── stores/
    │   └── ticket-management.store.ts  # export const useTicketManagementStore = defineStore(...)
    ├── queries/
    │   └── ticket.queries.ts           # useTicketsQuery(), useTicketDetailQuery(id)
    └── routes/
        └── ticket-management.routes.ts
```
