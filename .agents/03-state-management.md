# 🧠 Gestión de Estado

### Cuándo Usar Cada Uno

| Tipo                         | Cuándo Usar                                                                                                | Dónde va                                                   | Ejemplo                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **`ref` / `computed` local** | Estado efímero de un componente. No necesita persistir ni compartirse.                                     | Dentro del `<script setup>` del componente                 | `const isExpanded = ref(false)`, `const fullName = computed(() => \`${firstName} ${lastName}\`)` |
| **`reactive`**               | Estado complejo con múltiples propiedades relacionadas en un solo componente o composable.                 | `presentation/composables/` cuando es lógica reactiva pura | `const formState = reactive({ email: '', password: '', errors: [] })`                          |
| **Pinia Store (local)**      | Estado que debe compartirse entre múltiples componentes del **mismo feature**, pero no fuera de él.        | `features/{name}/presentation/stores/`                     | `useTicketManagementStore` — tickets filtrados, seleccionados, paginación                  |
| **Pinia Store (global)**     | Estado cross-cutting que afecta a **múltiples features** o a la UI shell.                                  | `app/stores/`                                              | `useUiStore` (toast, modal, sidebar), `useThemeStore` (dark mode), `useAuthStore` (sesión)     |
| **TanStack Query**           | Datos **servidor-remotos** que necesitan cache, revalidación, stale-while-revalidate, paginación infinita. | `features/{name}/presentation/queries/`                    | `useTicketsQuery()`, `useTicketDetailQuery(id)`                                                |

### 🧭 Árbol de decisión

```
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
```

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
  const toastQueue = ref<Toast[]>([])
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

```
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
```
