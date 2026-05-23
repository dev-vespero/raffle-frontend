# 🎯 Patrones Arquitectónicos

### 1. Dependency Inversion Principle (DIP)

**Regla:** `domain/` define contratos. `infrastructure/` los cumple. `application/` los consume sin saber quién los implementa.

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

**Ubicación:** `domain/ports/` + `infrastructure/api/` + `infrastructure/mocks/`
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

**Ubicación:** `application/use-cases/`
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

**Ubicación:** `shared/utils/result.utils.ts` o `core/types/result.type.ts`
**Propósito:** Evitar try/catch como control de flujo. Los errores de dominio son valores.

```typescript
// shared/utils/result.utils.ts
export class Result<T, E> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static ok<T>(value: T): Result<T, never> { return new Result(value) }
  static fail<E>(error: E): Result<never, E> { return new Result(undefined, error) }

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

### 5. Tanstack Query

**Ubicación:** `presentation/queries/` + `application/use-cases/`

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

**Ubicación:** `app/router/router.factory.ts` + `main.ts`

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

**Ubicación:** Todo `infrastructure/`
**Regla:** Nuevo origen de datos = nuevo archivo, sin tocar `domain/` ni `application/`.

| Port (contrato)    | Adapter HTTP           | Adapter Mock           | Adapter Local           |
| ------------------ | ---------------------- | ---------------------- | ----------------------- |
| `TicketRepository` | `HttpTicketRepository` | `MockTicketRepository` | `LocalTicketRepository` |

### 8. DTO Pattern (Anti-Corruption Layer)

**Ubicación:** `application/dto/`
**Propósito:** Proteger el dominio de la forma de los datos entrantes. Validar en el límite.

```typescript
// application/dto/create-ticket.dto.ts
import { z } from 'zod'

export const CreateTicketSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
})

export type CreateTicketDto = z.infer<typeof CreateTicketSchema>

// En el composable, antes de llamar al use case:
const validated = CreateTicketSchema.parse(rawFormData) // Falla aquí, no en dominio
```

### 9. Event Bus / Pub-Sub (Comunicación Feature-to-Feature)

**Ubicación:** `core/composables/use-event-bus.ts`
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

### 10. State Adapter Pattern (Stores locales vs globales)

**Ubicación:** `presentation/stores/` (local) vs `app/stores/` (global)
**Regla:** Si un store usa localStorage o afecta a >1 feature, es global. Si no, es local.

| Tipo       | Ubicación                         | Contiene             | Ejemplo                                                           |
| ---------- | --------------------------------- | -------------------- | ----------------------------------------------------------------- |
| **Local**  | `features/X/presentation/stores/` | Estado del feature   | `useTicketManagementStore` — tickets filtrados, seleccionados     |
| **Global** | `app/stores/`                     | Estado cross-cutting | `useUiStore` — toast, modal, sidebar. `useThemeStore` — dark mode |

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
