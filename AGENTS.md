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
│       │   │   └── {entity}.emun.ts
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
---

## 🎯 Patrones Arquitectónicos

### 1. Dependency Inversion Principle (DIP)

**Regla:** domain/ define contratos. infrastructure/ los cumple. application/ los consume sin saber quién los implementa.

| Capa                     | Rol                     | Ejemplo                                                  |
| ------------------------ | ----------------------- | -------------------------------------------------------- |
| `domain/ports/`          | Contrato abstracto      | `interface TicketRepository`                             |
| `infrastructure/api/`    | Implementación concreta | `class HttpTicketRepository implements TicketRepository` |
| `application/use-cases/` | Consumidor desacoplado  | `constructor(private repo: TicketRepository)`            |

```typescript
// domain/ports/ticket-repository.port.ts
export interface TicketRepository {
  findById(id: TicketId): Promise<Ticket | null>
  save(ticket: Ticket): Promise<void>
}

// infrastructure/api/ticket.repository.http.ts
export class HttpTicketRepository implements TicketRepository {
  constructor(private http: HttpClient) {}
  async findById(id: TicketId): Promise<Ticket | null> {
    return this.http.get(`/tickets/${id.value}`)
  }
}
```

### 2. Repository Pattern

**Ubicación:** domain/ports/ + infrastructure/api/ + infrastructure/mocks/
**Propósito:** Abstraer el origen de datos. El dominio no sabe si viene de HTTP, LocalStorage, IndexedDB o mock.

| Variante | Archivo                      | Cuándo usar                    |
| -------- | ---------------------------- | ------------------------------ |
| HTTP     | `ticket.repository.http.ts`  | Producción                     |
| Mock     | `ticket.repository.mock.ts`  | Desarrollo offline, tests      |
| Local    | `ticket.repository.local.ts` | Cache, IndexedDB, modo offline |


```typescript
// presentation/composables/use-fetch-tickets.ts
import { HttpTicketRepository } from '@/features/ticket-management/infrastructure/api/ticket.repository.http'
import { MockTicketRepository } from '@/features/ticket-management/infrastructure/mocks/ticket.repository.mock'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

const repository = USE_MOCKS 
  ? new MockTicketRepository() 
  : new HttpTicketRepository(core.api.client)
```

### 3. Use Case Pattern (Application Service)

**Ubicación:** application/use-cases/
**Regla:** Un archivo = un caso de uso completo. Orquesta entidades y ports. Sin frameworks.

```typescript
// application/use-cases/create-ticket.use-case.ts
export class CreateTicketUseCase {
  constructor(
    private ticketRepo: TicketRepository,
    private notifier: NotifierPort  // otro port para notificaciones
  ) {}

  async execute(dto: CreateTicketDto): Promise<Result<Ticket, DomainError>> {
    const ticket = Ticket.create(dto.title, dto.description)
    
    if (ticket.isInvalid()) {
      return Result.fail(ticket.errors)
    }

    await this.ticketRepo.save(ticket)
    this.notifier.success('Ticket creado')
    
    return Result.ok(ticket)
  }
}
```

### 4. Result Pattern (Error Handling sin excepciones)

**Ubicación:** shared/utils/result.utils.ts o core/types/result.type.ts
**Propósito:** Evitar try/catch como control de flujo. Los errores de dominio son valores.

```typescript
// shared/utils/result.utils.ts
export class Result<T, E> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static ok<T>(value: T): Result<T, never> { return new Result(value) }
  static fail<E>(error: E): Result<<never, E> { return new Result(undefined, error) }

  isSuccess(): boolean { return this._error === undefined }
  isFailure(): boolean { return !this.isSuccess() }
  
  getValue(): T { 
    if (this.isFailure()) throw new Error('Cannot get value from failure')
    return this._value! 
  }
  
  getError(): E {
    if (this.isSuccess()) throw new Error('Cannot get error from success')
    return this._error!
  }
}
```

**Uso en caso de uso:**

```typescript
const result = await createTicketUseCase.execute(dto)

if (result.isFailure()) {
  return result.getError() // DomainError[]
}

const ticket = result.getValue()
```

### 5. TanstackQuey

**Ubicación:** presentation/queries/ + application/use-cases/

```typescript
// presentation/queries/ticket.queries.ts
import { useQuery, useMutation } from '@tanstack/vue-query'

// QUERY: leer tickets (cacheable, reintentable)
export function useTicketsQuery() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketRepository.findAll()
  })
}

// MUTATION: crear ticket (no cacheable, side effects)
export function useCreateTicketMutation() {
  return useMutation({
    mutationFn: (dto: CreateTicketDto) => createTicketUseCase.execute(dto)
  })
}
```

### 6. Factory Pattern (Registro de Features)

**Ubicación:** app/router/router.factory.ts + main.ts

```typescript
// app/router/router.factory.ts
export function registerFeatureRoutes(router: Router) {
  const routeModules = import.meta.glob(
    '@/features/*/presentation/routes/*.routes.ts',
    { eager: true, import: 'default' }
  )

  Object.entries(routeModules).forEach(([path, module]) => {
    const routes = module as RouteRecordRaw[]
    routes.forEach(route => router.addRoute(route))
  })
}
```

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from 'vue-router'
import { registerFeatureRoutes } from '@/app/router/router.factory'

const app = createApp(App)
const router = createRouter({ history: createWebHistory() })

registerFeatureRoutes(router) // Auto-registro LEGO

app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 7. Adapter Pattern (Ports & Adapters / Hexagonal)

**Ubicación:** Todo infrastructure/
**Regla:** Nuevo origen de datos = nuevo archivo, sin tocar domain/ ni application/.

| Port (contrato)    | Adapter HTTP           | Adapter Mock           | Adapter Local           |
| ------------------ | ---------------------- | ---------------------- | ----------------------- |
| `TicketRepository` | `HttpTicketRepository` | `MockTicketRepository` | `LocalTicketRepository` |

### 7. Adapter Pattern (Ports & Adapters / Hexagonal)

**Ubicación:** presentation/stores/ (local) vs app/stores/ (global)
**Regla:** Si un store usa localStorage o afecta a >1 feature, es global. Si no, es local.

| Tipo       | Ubicación                         | Contiene             | Ejemplo                                                           |
| ---------- | --------------------------------- | -------------------- | ----------------------------------------------------------------- |
| **Local**  | `features/X/presentation/stores/` | Estado del feature   | `useTicketManagementStore` — tickets filtrados, seleccionados     |
| **Global** | `app/stores/`                     | Estado cross-cutting | `useUiStore` — toast, modal, sidebar. `useThemeStore` — dark mode |

### 9. DTO Pattern (Anti-Corruption Layer)

**Ubicación:** application/dto/
**Propósito:** Proteger el dominio de la forma de los datos entrantes. Validar en el límite.

```typescript
// application/dto/create-ticket.dto.ts
import { z } from 'zod'

export const CreateTicketSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
})

export type CreateTicketDto = z.infer<<typeof CreateTicketSchema>

// En el composable, antes de llamar al use case:
const validated = CreateTicketSchema.parse(rawFormData) // Falla aquí, no en dominio
```

### 10. Event Bus / Pub-Sub (Comunicación Feature-to-Feature)

**Ubicación:** core/composables/use-event-bus.ts
**Regla:** Features no se importan entre sí. Se comunican por eventos tipados.

```typescript
// core/composables/use-event-bus.ts
import { useEventBus } from '@vueuse/core'

export const TicketEvents = {
  CREATED: 'ticket:created',
  UPDATED: 'ticket:updated',
  DELETED: 'ticket:deleted'
} as const

// En feature A (ticket-management):
const bus = useEventBus(TicketEvents.CREATED)
bus.emit({ ticketId: '123' })

// En feature B (notifications):
const bus = useEventBus(TicketEvents.CREATED)
bus.on(({ ticketId }) => showToast(`Ticket ${ticketId} creado`))
```

### 📋 Tabla resumen: Patrón → Carpeta

| Patrón       | Carpeta                                 | Archivo ejemplo              |
| ------------ | --------------------------------------- | ---------------------------- |
| Repository   | `domain/ports/` + `infrastructure/api/` | `ticket-repository.port.ts`  |
| Use Case     | `application/use-cases/`                | `create-ticket.use-case.ts`  |
| DTO          | `application/dto/`                      | `create-ticket.dto.ts`       |
| CQRS Query   | `presentation/queries/`                 | `ticket.queries.ts`          |
| CQRS Command | `application/use-cases/`                | `delete-ticket.use-case.ts`  |
| Factory      | `app/router/`                           | `router.factory.ts`          |
| Adapter      | `infrastructure/*/`                     | `ticket.repository.http.ts`  |
| Result       | `shared/utils/`                         | `result.utils.ts`            |
| Event Bus    | `core/composables/`                     | `use-event-bus.ts`           |
| State Local  | `presentation/stores/`                  | `ticket-management.store.ts` |
| State Global | `app/stores/`                           | `ui.store.ts`                |

---

## 🧠 Gestión de Estado

### Cuándo Usar Cada Uno

| Tipo                         | Cuándo Usar                                                                                                | Dónde va                                                   | Ejemplo                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **`ref` / `computed` local** | Estado efímero de un componente. No necesita persistir ni compartirse.                                     | Dentro del `<script setup>` del componente                 | `const isExpanded = ref(false)`, `const fullName = computed(() => `${firstName} ${lastName}`)` |
| **`reactive`**               | Estado complejo con múltiples propiedades relacionadas en un solo componente o composable.                 | `presentation/composables/` cuando es lógica reactiva pura | `const formState = reactive({ email: '', password: '', errors: [] })`                          |
| **Pinia Store (local)**      | Estado que debe compartirse entre múltiples componentes del **mismo feature**, pero no fuera de él.        | `features/{name}/presentation/stores/`                     | `useTicketManagementStore` — filtros activos, ticket seleccionado, paginación                  |
| **Pinia Store (global)**     | Estado cross-cutting que afecta a **múltiples features** o a la UI shell.                                  | `app/stores/`                                              | `useUiStore` (toast, modal, sidebar), `useThemeStore` (dark mode), `useAuthStore` (sesión)     |
| **TanStack Query**           | Datos **servidor-remotos** que necesitan cache, revalidación, stale-while-revalidate, paginación infinita. | `features/{name}/presentation/queries/`                    | `useTicketsQuery()`, `useTicketDetailQuery(id)`                                                |

### 🧭 Árbol de decisión

¿El estado viene del servidor?
  ├── SÍ → ¿Necesita cache, revalidación automática, o paginación?
  │         ├── SÍ → TanStack Query (presentation/queries/)
  │         └── NO → Pinia Store local + fetch manual en use-case
  │
  └── NO → ¿Múltiples componentes del mismo feature lo necesitan?
            ├── SÍ → Pinia Store local (presentation/stores/)
            └── NO → ¿Múltiples features lo necesitan?
                      ├── SÍ → Pinia Store global (app/stores/)
                      └── NO → ref/computed local en el componente

### 📁 Ubicación por arquitectura

| Capa                        | Tecnología                    | Responsabilidad                                                            |
| --------------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `domain/entities/`          | Clases/Objetos puros          | Estado de negocio con comportamiento y validación. Sin reactivos.          |
| `application/use-cases/`    | Funciones/Clases puras        | Orquestan estado de dominio. Devuelven `Result<T, E>`.                     |
| `presentation/composables/` | `ref`, `reactive`, `computed` | Estado reactivo de UI: loading, errores, formularios, visibilidad.         |
| `presentation/stores/`      | Pinia                         | Estado compartido del feature: selecciones, filtros, preferencias locales. |
| `presentation/queries/`     | TanStack Query                | Estado servidor-cliente: cache, revalidación, optimización de requests.    |
| `app/stores/`               | Pinia                         | Estado global de aplicación: auth, tema, notificaciones, layout.           |


### 🔴 Reglas de oro

| Regla                                              | Violación típica                                             | Consecuencia                                                              |
| -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Un feature no importa el store de otro feature** | `features/ticket` importa `useAuthStore` de `features/user`  | Acoplamiento. Ya no es LEGO. Usa `app/stores/` para estado cross-feature. |
| **TanStack Query no almacena estado de UI**        | Guardar `isModalOpen` en `queryClient`                       | Abuso de cache. Perdida de semántica.                                     |
| **Pinia local no cachea respuestas HTTP**          | Guardar array de tickets en store con lógica de fetch manual | Reinvención de TanStack Query. Stale data, race conditions.               |
| **`ref` local no se eleva a store "por si acaso"** | `const isLoading = ref(false)` en store global               | Store inflado. Difícil de rastrear.                                       |
| **Entidades de dominio nunca son reactivas**       | `class Ticket { @ref price }`                                | Dominio acoplado a Vue. Imposible testear en Node.                        |


## 📝 Ejemplos por capa

### 1. ref / computed local (Componente)

```vue
<!-- presentation/components/ticket-card.vue -->
<script setup lang="ts">
const props = defineProps<{ ticket: Ticket }>()

const isExpanded = ref(false)                           // Estado efímero
const formattedDate = computed(() => 
  formatDate(props.ticket.createdAt)
)                                                       // Derivado
</script>
```

### 2. reactive (Composable local)

```typescript
// presentation/composables/use-ticket-form.ts
export function useTicketForm() {
  const form = reactive({
    title: '',
    description: '',
    priority: 'medium' as TicketPriority,
    errors: [] as string[]
  })

  const isValid = computed(() => 
    form.title.length >= 5 && form.description.length >= 10
  )

  function reset() {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.errors = []
  }

  return { form, isValid, reset }
}
```

### 3. Pinia Store local (Feature)

**Uso:** Solo dentro de features/ticket-management/. Nunca exportado fuera.

```typescript
// features/ticket-management/presentation/stores/ticket-management.store.ts
export const useTicketManagementStore = defineStore('ticket-management', () => {
  // Estado
  const selectedTicketId = ref<string | null>(null)
  const activeFilters = reactive({
    status: 'all' as TicketStatus | 'all',
    priority: 'all' as TicketPriority | 'all',
    assignee: null as string | null
  })
  const currentPage = ref(1)
  const itemsPerPage = ref(20)

  // Getters
  const hasActiveFilters = computed(() => 
    activeFilters.status !== 'all' || 
    activeFilters.priority !== 'all' ||
    activeFilters.assignee !== null
  )

  // Actions
  function setFilter(filter: keyof typeof activeFilters, value: unknown) {
    activeFilters[filter] = value
    currentPage.value = 1 // Reset paginación al filtrar
  }

  function selectTicket(id: string | null) {
    selectedTicketId.value = id
  }

  return {
    selectedTicketId,
    activeFilters,
    currentPage,
    hasActiveFilters,
    setFilter,
    selectTicket
  }
})
```

### 4. Pinia Store global (App shell)

**Uso:** Cualquier feature puede importar useUiStore desde app/stores/. Es cross-cutting intencional.

```typescript
// app/stores/ui.store.ts
export const useUiStore = defineStore('ui', () => {
  const toastQueue = ref<<Toast[]>([])
  const activeModal = ref<string | null>(null)
  const sidebarCollapsed = ref(false)

  function showToast(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID()
    toastQueue.value.push({ id, message, type })
    setTimeout(() => removeToast(id), 5000)
  }

  function openModal(id: string) {
    activeModal.value = id
  }

  return { toastQueue, activeModal, sidebarCollapsed, showToast, openModal }
})
```

### 5. TanStack Query (Servidor)

```typescript
// features/ticket-management/presentation/queries/ticket.queries.ts
const TICKET_QUERY_KEYS = {
  all: ['tickets'] as const,
  detail: (id: string) => ['tickets', id] as const,
  byStatus: (status: TicketStatus) => ['tickets', { status }] as const
}

// QUERY: Lista de tickets
export function useTicketsQuery(filters?: TicketFilters) {
  return useQuery({
    queryKey: filters ? TICKET_QUERY_KEYS.byStatus(filters.status) : TICKET_QUERY_KEYS.all,
    queryFn: () => ticketRepository.findAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30    // 30 minutos (antes cacheTime)
  })
}

// QUERY: Detalle de ticket
export function useTicketDetailQuery(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => TICKET_QUERY_KEYS.detail(id.value)),
    queryFn: () => ticketRepository.findById(id.value),
    enabled: computed(() => !!id.value),
    staleTime: 1000 * 60 * 10
  })
}

// MUTATION: Crear ticket
export function useCreateTicketMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (dto: CreateTicketDto) => createTicketUseCase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.all })
    }
  })
}
```

### 🔄 Ejemplo de un Flujo completo: Crear un ticket

Usuario llena formulario
  ↓
presentation/composables/use-ticket-form.ts  [reactive: estado del form]
  ↓
Validación con CreateTicketSchema (zod)
  ↓
presentation/queries/ticket.queries.ts  [useCreateTicketMutation]
  ↓
application/use-cases/create-ticket.use-case.ts  [orquesta dominio]
  ↓
domain/entities/ticket.entity.ts  [crea instancia con comportamiento]
  ↓
infrastructure/api/ticket.repository.http.ts  [adapter HTTP]
  ↓
core/api/client.ts  [Axios/fetch]
  ↓
Servidor
  ↓
onSuccess: invalida cache en TanStack Query
  ↓
app/stores/ui.store.ts  [showToast: éxito]

---

## 🌐 Rutas y Router

### Principios arquitectónicos

| Principio                                              | Implementación                                         |
| ------------------------------------------------------ | ------------------------------------------------------ |
| **Auto-registro**                                      | Cada feature declara sus rutas. El shell las descubre. |
| **Cero tocar `app/router/` al agregar/quitar feature** | `import.meta.glob` escanea automáticamente             |
| **Rutas nombreadas**                                   | Navegación desacoplada de paths hardcodeados           |
| **Lazy loading por feature**                           | Cada feature es un chunk separado                      |
| **Guards en capa de presentación**                     | Auth, roles, permisos — no en dominio                  |


### 📁 Ubicación en arquitectura

| Elemento                        | Carpeta                                              | Responsabilidad                                    |
| ------------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| Definición de rutas del feature | `features/{name}/presentation/routes/`               | Declara paths, componentes, meta, guards           |
| Registro automático             | `app/router/router.factory.ts`                       | Escanea y monta rutas en router                    |
| Router instance                 | `app/router/index.ts`                                | Configura history, scroll behavior, error handling |
| Constantes de rutas             | `features/{name}/domain/constants/route.constant.ts` | Nombres de rutas para navegación type-safe         |
| Guards reutilizables            | `app/router/guards/`                                 | AuthGuard, RoleGuard, OnboardingGuard              |


### 🔴 Reglas de oro

| Regla                                          | Violación                                                           | Consecuencia                                              |
| ---------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| **Un feature solo declara rutas propias**      | Ruta `/users` en `features/tickets`                                 | Acoplamiento. Feature ya no es LEGO.                      |
| **No hardcodear paths**                        | `router.push('/tickets/123')`                                       | Refactor imposible. Usa nombres de ruta.                  |
| **Lazy load a nivel de feature**               | `component: () => import('@/features/tickets/...')` en `app/router` | Router conoce internals del feature. Rompe encapsulación. |
| **Guards no acceden a stores de otro feature** | `authGuard` importa `useTicketStore`                                | Violación de independencia. Usa `app/stores/` o ports.    |
| **Rutas anidadas dentro del feature**          | Layout propio del feature en su `routes.ts`                         | Cada feature controla su propia navegación.               |

### 📝 Convenciones de rutas

| Elemento                         | Convención                                        | Ejemplo                                                      |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Archivo de rutas                 | `{feature}.routes.ts`                             | `ticket-management.routes.ts`                                |
| Nombre de ruta                   | `{feature}-{action}`                              | `ticket-management-list`, `ticket-management-detail`         |
| Path                             | `slug-case`, sin prefijo feature si es redundante | `/tickets`, `/tickets/:id`, no `/ticket-management/tickets`  |
| Componente de layout del feature | `{feature}-layout.vue`                            | `ticket-management-layout.vue`                               |
| Redirect por defecto             | En ruta padre con `redirect`                      | `{ path: '', redirect: { name: 'ticket-management-list' } }` |

### 📄 Estructura de archivo de rutas

```typescript
// features/ticket-management/presentation/routes/ticket-management.routes.ts
import type { RouteRecordRaw } from 'vue-router'

import { 
  TICKET_MANAGEMENT_LIST,
  TICKET_MANAGEMENT_CREATE,
  TICKET_MANAGEMENT_DETAIL,
} from '@/features/ticket-management/domain/constants/route.constant'

// Lazy imports del propio feature — nunca de otro feature
const TicketManagementLayout = () => import('../views/ticket-management-layout.vue')
const TicketListPage = () => import('../views/ticket-list.page.vue')
const TicketDetailPage = () => import('../views/ticket-detail.page.vue')
const TicketCreatePage = () => import('../views/ticket-create.page.vue')

export default [
  {
    path: '/tickets',
    component: TicketManagementLayout,
    meta: {
      requiresAuth: true,
      feature: 'ticket-management',
      title: 'Tickets'
    },
    children: [
      {
        path: '',
        name: TICKET_MANAGEMENT.LIST,
        component: TicketListPage,
        meta: { breadcrumb: 'Lista de Tickets' }
      },
      {
        path: 'create',
        name: TICKET_MANAGEMENT.CREATE,
        component: TicketCreatePage,
        meta: { 
          breadcrumb: 'Nuevo Ticket',
          requiresPermission: 'ticket:create'
        }
      },
      {
        path: ':id',
        name: TICKET_MANAGEMENT.DETAIL,
        component: TicketDetailPage,
        props: true,
        meta: { breadcrumb: 'Detalle de Ticket' }
      }
    ]
  }
] as RouteRecordRaw[]
```

### 📄 Constantes de rutas (type-safe navigation)

```typescript
// features/ticket-management/domain/constants/route.constant.ts
export const TICKET_MANAGEMENT = {
  LIST: 'ticket-management-list',
  CREATE: 'ticket-management-create',
  DETAIL: 'ticket-management-detail'
} as const

export type TicketRouteName = (typeof TICKET_MANAGEMENT)[keyof typeof TICKET_MANAGEMENT]
```

Uso en navegación:

```typescript
// presentation/composables/use-ticket-navigation.ts
import { TICKET_ROUTES } from '@/features/ticket-management/domain/constants/route.constant'

export function useTicketNavigation() {
  const router = useRouter()
  
  function goToDetail(id: string) {
    router.push({ 
      name: TICKET_ROUTES.DETAIL, 
      params: { id } 
    })
  }
  
  function goToCreate() {
    router.push({ name: TICKET_ROUTES.CREATE })
  }
  
  return { goToDetail, goToCreate }
}
```

### 📄 Factory de registro automático

```typescript
// app/router/router.factory.ts
import type { RouteRecordRaw, Router } from 'vue-router'

export function registerFeatureRoutes(router: Router) {
  // Escanea todas las rutas de features
  const routeModules = import.meta.glob<<RouteRecordRaw[]>(
    '@/features/*/presentation/routes/*.routes.ts',
    { eager: true, import: 'default' }
  )

  Object.entries(routeModules).forEach(([path, routes]) => {
    routes.forEach(route => router.addRoute(route))
  })
}
```

```typescript
// app/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { registerFeatureRoutes } from './router.factory'
import { authGuard } from './guards/auth.guard'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, left: 0 }
  }
})

// Guards globales
router.beforeEach(authGuard)

// Auto-registro de features
registerFeatureRoutes(router)

export default router
```

### 📄 Guards reutilizables

```typescript
// app/router/guards/auth.guard.ts
import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/app/stores/auth.store'

export const authGuard: NavigationGuard = async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'auth-login', query: { redirect: to.fullPath } })
  }
  
  if (to.meta.requiresPermission) {
    const hasPermission = await authStore.hasPermission(to.meta.requiresPermission as string)
    if (!hasPermission) return next({ name: 'forbidden' })
  }
  
  next()
}
```

```typescript
// app/router/guards/onboarding.guard.ts
import type { NavigationGuard } from 'vue-router'
import { useUserStore } from '@/app/stores/user.store'

export const onboardingGuard: NavigationGuard = (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresOnboarding && !userStore.hasCompletedOnboarding) {
    return next({ name: 'onboarding-welcome' })
  }
  
  next()
}
```

### 📄 Layout de feature (anidación interna)

```vue
<!-- features/ticket-management/presentation/views/ticket-management-layout.vue -->
<<template>
  <div class="ticket-layout">
    <ticket-sidebar />
    <main class="ticket-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <ticket-toast-container />
  </div>
</template>
```

### 🔄 Flujo completo: Agregar un nuevo feature

```plain
1. Crear features/payments/presentation/routes/payments.routes.ts
   └── Define rutas: /payments, /payments/:id, /payments/create

2. Crear features/payments/domain/constants/route.constant.ts
   └── PAYMENT_ROUTES = { LIST: 'payments-list', ... }

3. Crear views en features/payments/presentation/views/

4. No tocar app/router/ — auto-registro lo detecta al reiniciar dev server

5. Opcional: agregar meta.requiresPermission en rutas sensibles
```

### 📋 Tabla resumen

| Concern                   | Ubicación                              | Ejemplo                           |
| ------------------------- | -------------------------------------- | --------------------------------- |
| Declarar rutas de feature | `features/X/presentation/routes/`      | `ticket-management.routes.ts`     |
| Constantes de nombres     | `features/X/domain/constants/`         | `route.constant.ts`               |
| Registro automático       | `app/router/router.factory.ts`         | `registerFeatureRoutes()`         |
| Configuración de router   | `app/router/index.ts`                  | `createRouter()`, guards globales |
| Guards reutilizables      | `app/router/guards/`                   | `auth.guard.ts`, `role.guard.ts`  |
| Layout de feature         | `features/X/presentation/views/`       | `ticket-management-layout.vue`    |
| Navegación type-safe      | `features/X/presentation/composables/` | `use-ticket-navigation.ts`        |

---

## 🎨 UI y Estilos

### Reglas de Estilizado

1. **SOLO Tailwind utility classes** en templates
2. **NO** usar `<style scoped>` ni `<style>` en componentes
3. **NO** crear archivos CSS nuevos
4. Variables CSS para tema dinámico están en `style.css`
5. **Siempre** importar componentes base ui desde @/shared/components/ui/
6. **No se debe crear componentes personalizdos** se deben mantener un mismo estilo para toda la app

```vue
<!-- ✅ CORRECTO -->
<template>
  <div class="flex items-center gap-4 p-6 bg-dark-surface rounded-lg">
    <BaseButton variant="primary">Comprar</BaseButton>
  </div>
</template>

<!-- ❌ INCORRECTO -->
<template>
  <div class="container">
    <button class="btn-primary">Comprar</button>
  </div>
</template>
<style scoped>
.container { padding: 2rem; }
.btn-primary { background: red; }
</style>
```

### Componentes UI Disponibles

Importar desde `@/shared/components/ui/`:

```typescript
import { ... } from '@/shared/components/ui';
```

### Layout & Tipografía

| Componente      | Props Principales                                                                                                                                            | Events |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `PageContainer` | `maxWidth: 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`, `padding: boolean`                                                                                       | —      |
| `Title` (h1-h6) | `level: 1 \| 2 \| 3 \| 4 \| 5 \| 6`, `variant: 'display' \| 'heading' \| 'subheading'`, `truncate: boolean`                                                  | —      |
| `Text`          | `variant: 'body' \| 'caption' \| 'overline'`, `color: 'default' \| 'muted' \| 'primary' \| 'danger'`, `weight: 'normal' \| 'medium' \| 'semibold' \| 'bold'` | —      |


### Botones

| Componente    | Props Principales                                                                                                                                                                                            | Events  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `BaseButton`  | `variant: 'primary' \| 'secondary' \| 'danger' \| 'info' \| 'warning'`, `size: 'sm' \| 'md' \| 'lg'`, `disabled: boolean`, `loading: boolean`, `fullWidth: boolean`, `iconLeft: string`, `iconRight: string` | `click` |
| `FloatButton` | `variant: 'primary' \| 'secondary'`, `icon: string`, `position: 'bottom-right' \| 'bottom-left'`, `offset: number`                                                                                           | `click` |

### Formularios

| Componente        | Props Principales                                                                                                                                                                                                                                                                                              | Events                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `BaseInput`       | `modelValue: string`, `label: string`, `placeholder: string`, `type: 'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'url'`, `error: string`, `hint: string`, `iconLeft: string`, `iconRight: string`, `clearable: boolean`, `disabled: boolean`, `readonly: boolean`, `maxLength: number` | `update:modelValue`, `blur`, `focus`, `clear` |
| `BaseSelect`      | `modelValue: T`, `label: string`, `options: SelectOption[]`, `placeholder: string`, `error: string`, `multiple: boolean`, `searchable: boolean`, `disabled: boolean`                                                                                                                                           | `update:modelValue`, `search`                 |
| `BaseTextArea`    | `modelValue: string`, `label: string`, `placeholder: string`, `rows: number`, `maxLength: number`, `error: string`, `hint: string`, `autoResize: boolean`, `disabled: boolean`                                                                                                                                 | `update:modelValue`, `blur`, `focus`          |
| `BaseCheckbox`    | `modelValue: boolean`, `label: string`, `indeterminate: boolean`, `disabled: boolean`                                                                                                                                                                                                                          | `update:modelValue`                           |
| `BaseRadio`       | `modelValue: T`, `options: RadioOption[]`, `label: string`, `error: string`, `disabled: boolean`                                                                                                                                                                                                               | `update:modelValue`                           |
| `BaseSwitch`      | `modelValue: boolean`, `label: string`, `disabled: boolean`, `loading: boolean`                                                                                                                                                                                                                                | `update:modelValue`                           |
| `BaseColorPicker` | `modelValue: string`, `label: string`, `presetColors: string[]`, `disabled: boolean`                                                                                                                                                                                                                           | `update:modelValue`                           |
| `BaseDatePicker`  | `modelValue: Date \| null`, `label: string`, `placeholder: string`, `format: string`, `minDate: Date`, `maxDate: Date`, `disabled: boolean`                                                                                                                                                                    | `update:modelValue`, `open`, `close`          |
| `BaseTimePicker`  | `modelValue: string`, `label: string`, `format: '12h' \| '24h'`, `disabled: boolean`                                                                                                                                                                                                                           | `update:modelValue`                           |
| `BaseUpload`      | `modelValue: File[]`, `label: string`, `accept: string`, `maxSize: number`, `maxFiles: number`, `multiple: boolean`, `disabled: boolean`                                                                                                                                                                       | `update:modelValue`, `error`, `remove`        |

### Contenedores

| Componente     | Props Principales                                                                                                                                           | Events              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `BaseCard`     | `variant: 'default' \| 'elevated' \| 'outlined'`, `padding: 'none' \| 'sm' \| 'md' \| 'lg'`, `hoverable: boolean`, `clickable: boolean`, `loading: boolean` | `click`             |
| `BaseForm`     | `submitLabel: string`, `cancelLabel: string`, `loading: boolean`, `showCancel: boolean`                                                                     | `submit`, `cancel`  |
| `BaseCollapse` | `modelValue: boolean`, `title: string`, `disabled: boolean`                                                                                                 | `update:modelValue` |

### Navegación

| Componente       | Props Principales                                                                                                                     | Events                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `BaseBreadcrumb` | `items: BreadcrumbItem[]`, `separator: 'slash' \| 'arrow' \| 'chevron'`                                                               | `click` (por item)               |
| `BaseMenu`       | `items: MenuItem[]`, `mode: 'vertical' \| 'horizontal'`, `collapsed: boolean`, `selectedKeys: string[]`                               | `select`, `openChange`           |
| `BaseDropdown`   | `trigger: 'click' \| 'hover'`, `placement: 'top' \| 'bottom' \| 'left' \| 'right'`, `disabled: boolean`                               | `visibleChange`                  |
| `BasePagination` | `page: number`, `total: number`, `pageSize: number`, `pageSizeOptions: number[]`, `showSizeChanger: boolean`, `showTotal: boolean`    | `update:page`, `update:pageSize` |
| `BaseSteps`      | `current: number`, `items: StepItem[]`, `direction: 'horizontal' \| 'vertical'`, `size: 'default' \| 'small'`                         | `change`                         |
| `BaseTabs`       | `modelValue: string`, `items: TabItem[]`, `type: 'line' \| 'card' \| 'pill'`, `position: 'top' \| 'left'`, `destroyInactive: boolean` | `update:modelValue`, `change`    |


### Feedback & Overlay

| Componente         | Props Principales                                                                                                                                                                                                 | Events                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `BaseModal`        | `modelValue: boolean`, `title: string`, `width: string \| number`, `closable: boolean`, `maskClosable: boolean`, `footer: boolean`, `confirmLoading: boolean`, `okText: string`, `cancelText: string`             | `update:modelValue`, `ok`, `cancel`, `close` |
| `BaseAlert`        | `variant: 'info' \| 'success' \| 'warning' \| 'error'`, `title: string`, `message: string`, `closable: boolean`, `showIcon: boolean`, `banner: boolean`                                                           | `close`                                      |
| `BaseDrawer`       | `modelValue: boolean`, `title: string`, `placement: 'left' \| 'right' \| 'top' \| 'bottom'`, `width: string \| number`, `closable: boolean`, `maskClosable: boolean`                                              | `update:modelValue`, `close`                 |
| `BaseNotification` | `type: 'info' \| 'success' \| 'warning' \| 'error'`, `message: string`, `description: string`, `duration: number`, `placement: 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'`, `closable: boolean` | `close`, `click`                             |
| `BaseTour`         | `steps: TourStep[]`, `current: number`, `mask: boolean`, `type: 'default' \| 'primary'`, `showArrow: boolean`                                                                                                     | `change`, `finish`, `close`                  |
| `BasePopover`      | `trigger: 'click' \| 'hover' \| 'focus'`, `placement: Placement`, `title: string`, `content: string`, `disabled: boolean`                                                                                         | `visibleChange`                              |
| `BaseTooltip`      | `trigger: 'hover' \| 'focus' \| 'click'`, `placement: Placement`, `content: string`, `disabled: boolean`                                                                                                          | —                                            |

### Datos & Media

| Componente     | Props Principales                                                                                                                                                                                                            | Events                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `BaseTable`    | `data: T[]`, `columns: TableColumn[]`, `loading: boolean`, `pagination: PaginationConfig`, `rowSelection: RowSelection`, `sortable: boolean`, `filterable: boolean`, `emptyText: string`, `scroll: { x: number, y: number }` | `rowClick`, `sortChange`, `filterChange`, `selectionChange`, `pageChange` |
| `BaseAvatar`   | `src: string`, `alt: string`, `size: 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`, `shape: 'circle' \| 'square'`, `fallback: string`, `badge: AvatarBadge`                                                                          | `error`, `click`                                                          |
| `BaseImage`    | `src: string`, `alt: string`, `width: string \| number`, `height: string \| number`, `fit: 'fill' \| 'contain' \| 'cover' \| 'none'`, `preview: boolean`, `loading: 'eager' \| 'lazy'`, `fallback: string`                   | `load`, `error`, `click`                                                  |
| `BaseCarousel` | `items: CarouselItem[]`, `autoplay: boolean`, `interval: number`, `dots: boolean`, `arrows: boolean`, `effect: 'slide' \| 'fade'`, `vertical: boolean`                                                                       | `change`, `click`                                                         |
| `BaseEmpty`    | `image: string`, `description: string`, `imageStyle: object`                                                                                                                                                                 | —                                                                         |
| `BaseSkeleton` | `active: boolean`, `avatar: boolean`, `paragraph: { rows: number, width: string \| string[] }`, `title: boolean`, `loading: boolean`                                                                                         | —                                                                         |


### Estados & Tags

| Componente   | Props Principales                                                                                                                                                      | Events           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `BaseBadge`  | `variant: 'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'`, `text: string`, `dot: boolean`, `count: number`, `overflowCount: number`, `showZero: boolean` | —                |
| `BaseTag`    | `variant: 'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'`, `closable: boolean`, `icon: string`, `disabled: boolean`                                      | `close`, `click` |
| `BaseLoader` | `size: 'xs' \| 'sm' \| 'md' \| 'lg'`, `variant: 'spinner' \| 'dots' \| 'bar' \| 'skeleton'`, `fullscreen: boolean`, `tip: string`                                      | —                |

### 📋 Catálogo organizado por categoría

| Categoría        | Componentes                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**       | `PageContainer`                                                                                                                                                       |
| **Tipografía**   | `Title` (h1-h6), `Text`                                                                                                                                               |
| **Botones**      | `BaseButton`, `FloatButton`                                                                                                                                           |
| **Formularios**  | `BaseInput`, `BaseSelect`, `BaseTextArea`, `BaseCheckbox`, `BaseRadio`, `BaseSwitch`, `BaseColorPicker`, `BaseDatePicker`, `BaseTimePicker`, `BaseUpload`, `BaseForm` |
| **Contenedores** | `BaseCard`, `BaseCollapse`                                                                                                                                            |
| **Navegación**   | `BaseBreadcrumb`, `BaseMenu`, `BaseDropdown`, `BasePagination`, `BaseSteps`, `BaseTabs`                                                                               |
| **Feedback**     | `BaseAlert`, `BaseNotification`, `BaseDrawer`, `BaseTour`                                                                                                             |
| **Overlay**      | `BaseModal`, `BasePopover`, `BaseTooltip`                                                                                                                             |
| **Datos**        | `BaseTable`, `BaseEmpty`, `BaseSkeleton`                                                                                                                              |
| **Media**        | `BaseAvatar`, `BaseImage`, `BaseCarousel`                                                                                                                             |
| **Estados**      | `BaseBadge`, `BaseTag`, `BaseLoader`                                                                                                                                  |


### 🔴 Reglas de uso

| Regla                                      | Ejemplo correcto                          | Ejemplo incorrecto                          |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| **Nunca clases Tailwind sueltas**          | `<BaseButton variant="danger">`           | `<button class="bg-red-500 px-4 py-2">`     |
| **Nunca `<style>` en componentes**         | —                                         | `<style scoped>.btn { color: red }</style>` |
| **Props de variante, no clases**           | `<BaseCard variant="elevated">`           | `<BaseCard class="shadow-lg border">`       |
| **Iconos por nombre, no SVG inline**       | `<BaseButton iconLeft="trash">`           | `<BaseButton><svg>...</svg></BaseButton>`   |
| **Slots para contenido, no props de HTML** | `<BaseModal><p>Contenido</p></BaseModal>` | `<BaseModal content="<p>Contenido</p>">`    |


### Iconos

Usar `lucide-vue-next`:

```typescript
import { Check, X, Loader2, AlertCircle, Ticket, User } from 'lucide-vue-next';
```

---

## 📋 Checklist para Nuevas Features

Al crear una **nueva feature**, seguir estos pasos en orden:

### 1. Definición Inicial
- [ ] Identificar nombre del feature en `camelCase` (ej: `raffles`, `payments`)
- [ ] Definir rutas necesarias y sus meta fields
- [ ] Identificar entidades y tipos necesarios

### 2. Tipos
- [ ] Agregar interfaces a `src/core/types/api.types.ts`

### 3. Mocks (DESARROLLO)
- [ ] Crear funciones mock en `src/mocks/api.ts`
- [ ] Simular delays con `await new Promise(r => setTimeout(r, 500))`
- [ ] Retornar estructura `ApiResponse<T>`

### 4. Servicio
- [ ] Crear `features/<feature>/services/<feature>Service.ts`
- [ ] Exportar objeto con métodos asíncronos
- [ ] Implementar flag `USE_MOCKS = import.meta.env.DEV`
- [ ] Usar `axiosInstance` para llamadas reales

### 5. Manager (Página)
- [ ] Crear `features/<feature>/managers/<Feature>Manager.vue`
- [ ] Usar `<script setup lang="ts">`
- [ ] Importar servicios y stores necesarios
- [ ] Usar `useQuery` / `useMutation` para datos del servidor
- [ ] Estado local con `ref` / `computed`
- [ ] Notificaciones vía `uiStore`
- [ ] Estilos SOLO con Tailwind utility classes

### 6. Subcomponentes (si aplica)
- [ ] Crear `features/<feature>/components/<Component>.vue` si la vista es compleja
- [ ] Componentes reciben props y emiten events (no acceden a stores directamente)
- [ ] Estilos SOLO con Tailwind utility classes

### 7. Rutas
- [ ] Agregar ruta en `src/router/index.ts`
- [ ] Configurar `meta: { title, requiresAuth, public }`
- [ ] Usar lazy loading: `component: () => import('@/features/...')`

### 8. Estado Global (si aplica)
- [ ] Crear store en `src/stores/<feature>Store.ts` solo si el estado es cross-feature
- [ ] Usar `defineStore` con Composition API
- [ ] Exponer refs, computed y funciones explícitamente

### 9. Validación y Errores
- [ ] Usar `errorHandler.extractErrorMessage()` para errores de API
- [ ] Validación manual de formularios con `errors` ref
- [ ] Notificaciones vía `uiStore.showError()` / `uiStore.showSuccess()`

### 10. Revisión Final
- [ ] No hay imports de otros features
- [ ] No hay `<style scoped>` en componentes
- [ ] Rutas configuradas con meta fields correctos

---

## 🚫 Anti-Patrones (NO HACER)

```typescript
// ❌ NO importar entre features
```

---

## 📚 Referencias Rápidas

### Imports Comunes

```typescript
// Componentes UI
import { BaseButton, BaseInput, BaseCard, BaseModal } from '@/shared/components/ui';

// Stores
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

// Servicios
import { ticketService } from '@/features/tickets/services/ticketService';

// Tipos
import type { User, Ticket, ApiResponse } from '@/core/types/api.types';

// API
import { axiosInstance } from '@/core/api/axiosInstance';
import { extractErrorMessage } from '@/core/api/errorHandler';

// Iconos
import { Ticket, User, Check, X, Loader2 } from 'lucide-vue-next';

// TanStack Query
import { useQuery, useMutation } from '@tanstack/vue-query';
```

### Snippet de Service Template

```typescript

```

### Snippet de View Template

```vue
<script setup lang="ts">
</script>

<template>
</template>
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Type check
npm run type-check  # (vue-tsc -b)
```

---

**Última actualización**: 2026-05-22  
**Mantenimiento**: Actualizar este documento cuando se agreguen nuevos patrones o convenciones.
