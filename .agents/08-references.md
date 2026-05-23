# 📚 Referencias Rápidas

## Imports Comunes

```typescript
// Componentes UI
import { BaseButton, BaseInput, BaseCard, BaseModal } from '@/shared/components/ui';

// Stores
import { useAuthStore } from '@/app/stores/auth.store';
import { useUiStore } from '@/app/stores/ui.store';

// Tipos
import type { User, Ticket, ApiResponse } from '@/core/types/global.d.ts';

// API
import { axiosInstance } from '@/core/api/client';
import { extractErrorMessage } from '@/core/api/error-handler';

// Iconos
import { Check, X, Loader2, AlertCircle, Ticket, User } from 'lucide-vue-next';

// TanStack Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

// Validación
import { z } from 'zod';
```

## Snippets

### Entity Template
```typescript
// features/<feature>/domain/entities/<entity>.entity.ts
export class Ticket {
  constructor(
    public readonly id: string,
    public title: string,
    public status: TicketStatus
  ) {}

  static create(title: string): Ticket {
    // validaciones
    return new Ticket(crypto.randomUUID(), title, TicketStatus.OPEN)
  }
}
```

### Port Template
```typescript
// features/<feature>/domain/ports/<repository>.port.ts
export interface TicketRepository {
  findById(id: string): Promise<Ticket | null>
  save(ticket: Ticket): Promise<void>
  delete(id: string): Promise<void>
}
```

### Use Case Template
```typescript
// features/<feature>/application/use-cases/<action>-<entity>.use-case.ts
export class CreateTicketUseCase {
  constructor(private ticketRepo: TicketRepository) {}

  async execute(dto: CreateTicketDto): Promise<Result<Ticket, DomainError>> {
    // lógica
  }
}
```

### Repository HTTP Template
```typescript
// features/<feature>/infrastructure/api/<entity>.repository.http.ts
export class HttpTicketRepository implements TicketRepository {
  constructor(private http: HttpClient) {}

  async findById(id: string): Promise<Ticket | null> {
    const response = await this.http.get<ApiResponse<Ticket>>(`/tickets/${id}`)
    return response.data ?? null
  }
}
```

### Composable Template
```typescript
// features/<feature>/presentation/composables/use-<action>-<entity>.ts
export function useFetchTickets() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTickets() {
    isLoading.value = true
    try {
      // lógica
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, fetchTickets }
}
```

### Store Local Template
```typescript
// features/<feature>/presentation/stores/<feature>.store.ts
export const useTicketManagementStore = defineStore('ticket-management', () => {
  // estado, getters, actions
  return { /* ... */ }
})
```

### Query Template
```typescript
// features/<feature>/presentation/queries/<entity>.queries.ts
export function useTicketsQuery() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketRepository.findAll()
  })
}
```

### View Template
```vue
<script setup lang="ts">
// imports, lógica de setup
</script>

<template>
  <PageContainer>
    <!-- contenido con componentes base -->
  </PageContainer>
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

# Tests (si existen)
npm run test
```
