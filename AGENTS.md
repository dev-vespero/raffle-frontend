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
├── style.css                        # Global styles + Tailwind + CSS variables
│
├── config/                          # Configuración validada
│   ├── env.config.ts                # Variables de entorno con Zod
│   ├── theme.config.ts              # Colores del tema dinámico
│   └── raffle.config.ts             # Reglas de negocio (precios, descuentos)
│
├── core/                            # Infraestructura compartida
│   ├── api/
│   │   ├── axiosInstance.ts         # Instancia Axios configurada
│   │   └── errorHandler.ts          # Normalización de errores
│   └── types/
│       └── api.types.ts             # TODAS las interfaces TypeScript
│
├── features/                        # Vertical Slices (CARPETA PRINCIPAL)
│   ├── account/
│   │   ├── components/              # Subcomponentes específicos
│   │   │   ├── MyNumbers.vue
│   │   │   ├── MyPrizes.vue
│   │   │   ├── ProfileForm.vue
│   │   │   └── NotificationSettings.vue
│   │   └── managers/
│   │       └── AccountManager.vue   # Componente de ruta
│   │
│   ├── auth/
│   │   ├── managers/
│   │   │   └── AuthManager.vue
│   │   └── services/
│   │       └── authService.ts
│   │
│   ├── home/
│   │   └── managers/
│   │       └── HomeManager.vue      # Catálogo de rifas activas
│   │
│   ├── purchase/
│   │   └── services/
│   │       ├── purchaseService.ts
│   │       └── paymentMethodsService.ts
│   │
│   ├── raffles/                     # Feature de rifas (múltiples sorteos)
│   │   ├── managers/
│   │   │   └── RaffleDetailManager.vue  # Detalle de rifa + selección
│   │   └── services/
│   │       └── raffleService.ts
│   │
│   ├── tickets/
│   │   ├── managers/
│   │   │   └── TicketManager.vue    # (DEPRECATED - redirige a /)
│   │   └── services/
│   │       └── ticketService.ts
│   │
│   ├── verification/
│   │   ├── managers/
│   │   │   └── VerificationManager.vue
│   │   └── services/
│   │       └── verificationService.ts
│   │
│   └── winners/
│       ├── managers/
│       │   └── WinnersManager.vue
│       └── services/
│           └── winnersService.ts
│
├── shared/                          # Código reusable cross-feature
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.vue
│   │   │   ├── Footer.vue
│   │   │   └── NotFound.vue
│   │   └── ui/
│   │       ├── index.ts             # Barrel export
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       ├── BaseSelect.vue
│   │       ├── BaseCard.vue
│   │       ├── BaseModal.vue
│   │       ├── BaseAlert.vue
│   │       ├── BaseBadge.vue
│   │       └── BaseLoader.vue
│   └── utils/
│       └── helpers.ts
│
├── stores/                          # Pinia stores (estado global)
│   ├── authStore.ts
│   ├── ticketStore.ts
│   ├── purchaseStore.ts
│   ├── uiStore.ts
│   └── themeStore.ts
│
├── mocks/
│   └── api.ts                       # Mock completo del backend (DEV only)
│
└── router/
    └── index.ts                     # Configuración de rutas
```

---

## 📝 Convenciones de Nomenclatura

| Elemento | Convención | Ejemplos |
|----------|------------|----------|
| **Carpetas** | `camelCase` | `features/tickets/`, `shared/components/` |
| **Componentes Vue** | `PascalCase` | `TicketManager.vue`, `BaseButton.vue` |
| **Managers** | `*Manager.vue` | `AuthManager.vue`, `HomeManager.vue` |
| **Servicios** | `*Service.ts` (objeto exportado) | `ticketService`, `authService` |
| **Stores** | `use*Store.ts` | `useAuthStore`, `useTicketStore` |
| **Composables** | `use*.ts` | `useTickets` (aún no implementados) |
| **Tipos/Interfaces** | `PascalCase` | `User`, `Ticket`, `ApiResponse<T>` |
| **Configuraciones** | `*.config.ts` | `env.config.ts`, `theme.config.ts` |
| **Variables/Funciones** | `camelCase` | `selectedTickets`, `handleLogin` |
| **Constantes** | `UPPER_SNAKE_CASE` | `USE_MOCKS`, `MAX_TICKETS` |

---

## 🎯 Patrones Arquitectónicos

### 1. Vertical Slice Architecture

Cada feature es **autocontenida** y **vertical**:
- Tiene su propio Manager (página/ruta)
- Tiene sus propios servicios (llamadas API)
- Puede tener componentes específicos
- **NO** importa de otros features
- **SÍ** importa de `shared/`, `core/`, `stores/`

```
✅ CORRECTO: features/tickets/imports de shared/components/ui
❌ INCORRECTO: features/tickets/imports de features/auth/
```

### 2. Manager Pattern

Los **Managers** son componentes de nivel de ruta:
- Ubicados en `features/<feature>/managers/<Feature>Manager.vue`
- Orquestan subcomponentes y estado
- Contienen la lógica de la vista completa
- Son el `component` en la definición de la ruta

```typescript
// router/index.ts
{
  path: '/boletos',
  name: 'Tickets',
  component: () => import('@/features/tickets/managers/TicketManager.vue'),
}
```

### 3. Service Pattern

Los servicios son **objetos** con métodos asíncronos:

```typescript
// features/tickets/services/ticketService.ts
import { axiosInstance } from '@/core/api/axiosInstance';
import type { ApiResponse } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

export const ticketService = {
  async getAll(): Promise<ApiResponse<string[]>> {
    if (USE_MOCKS) {
      const { mockGetAllTickets } = await import('@/mocks/api');
      return mockGetAllTickets();
    }
    return axiosInstance.get<ApiResponse<string[]>>('/tickets');
  },

  async getAvailable(): Promise<ApiResponse<string[]>> {
    // ...
  },
};
```

### 4. Mock-First Development

- **DESARROLLO**: Usa mocks de `src/mocks/api.ts`
- **PRODUCCIÓN**: Usa Axios hacia API real
- El switch es automático vía `import.meta.env.DEV`

**Regla**: Antes de crear un service, define los mocks en `mocks/api.ts`.

### 5. Tipos Centralizados

**TODAS** las interfaces TypeScript van en `src/core/types/api.types.ts`:

```typescript
// ❌ INCORRECTO: Crear features/tickets/types/ticket.types.ts
// ✅ CORRECTO: Agregar a core/types/api.types.ts

export interface Ticket {
  id: string;
  number: string;
  status: 'available' | 'reserved' | 'sold';
}
```

---

## 🧠 Gestión de Estado

### Cuándo Usar Cada Uno

| Tipo | Cuándo Usar | Ejemplo |
|------|-------------|---------|
| **Pinia Store** | Estado compartido entre features o persistente | `authStore.user`, `ticketStore.selectedTickets` |
| **TanStack Query** | Datos del servidor con cacheo | Lista de boletos, ganadores |
| **`ref`/`computed` local** | Estado de UI puro del componente | `searchQuery`, `isModalOpen`, `currentPage` |
| **`reactive`** | Evitar (usar `ref` para consistencia) | — |

### Stores Existentes

```typescript
// stores/authStore.ts
useAuthStore()
  - user: User | null
  - isAuthenticated: boolean
  - login(), register(), logout(), initAuth()

// stores/ticketStore.ts
useTicketStore()
  - selectedTickets: SelectedTicket[]
  - totalPrice, totalTickets, discount
  - addTicket(), removeTicket(), clearTickets()

// stores/purchaseStore.ts
usePurchaseStore()
  - currentStep, buyerData, paymentMethod
  - updateStep(), setBuyerData(), clearPurchase()

// stores/uiStore.ts
useUiStore()
  - isLoading, activeModal, notifications[]
  - showLoading(), hideLoading(), showError(), showSuccess()

// stores/themeStore.ts
useThemeStore()
  - mode, colors
  - setMode(), updateColors(), initTheme()
```

### Ejemplo: TanStack Query en un Manager

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { ticketService } from '../services/ticketService';

const { data, isLoading, error } = useQuery({
  queryKey: ['tickets'],
  queryFn: () => ticketService.getAll(),
});
</script>
```

---

## 🌐 Rutas y Router

### Configuración en `router/index.ts`

```typescript
{
  path: '/rifas/:id',
  name: 'RaffleDetail',
  component: () => import('@/features/raffles/managers/RaffleDetailManager.vue'),
  meta: {
    title: 'Detalle de Rifa',
    public: true,
  },
}
```

### Meta Fields Disponibles

| Field | Tipo | Descripción |
|-------|------|-------------|
| `title` | `string` | Título para `document.title` |
| `public` | `boolean` | Accesible sin autenticación |
| `auth` | `boolean` | Solo visible si autenticado (redirige si no) |
| `requiresAuth` | `boolean` | Igual que `auth` |

### Guards Automáticos

- Rutas con `requiresAuth: true` → redirect a `/login?redirect=<path>`
- `/login` y `/registro` → redirect a `/` si ya autenticado
- 401 en Axios → dispatch de evento `auth:unauthorized` + clear localStorage

---

## 🎨 UI y Estilos

### Reglas de Estilizado

1. **SOLO Tailwind utility classes** en templates
2. **NO** usar `<style scoped>` ni `<style>` en componentes
3. **NO** crear archivos CSS nuevos
4. Variables CSS para tema dinámico están en `style.css`

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
import { BaseButton, BaseInput, BaseCard, BaseModal, BaseAlert, BaseBadge, BaseLoader, BaseSelect, RaffleCard } from '@/shared/components/ui';
```

| Componente | Props Principales | Events |
|------------|-------------------|--------|
| `BaseButton` | `variant`, `size`, `disabled`, `loading` | `click` |
| `BaseInput` | `label`, `error`, `hint`, `type`, `icon` | `update:modelValue`, `blur`, `focus` |
| `BaseSelect` | `label`, `options`, `error` | `update:modelValue` |
| `BaseCard` | `variant` | — |
| `BaseModal` | `modelValue`, `title` | `update:modelValue`, `close` |
| `BaseAlert` | `variant`, `title`, `message` | `close` |
| `BaseBadge` | `variant` | — |
| `BaseLoader` | `size` | — |
| `RaffleCard` | `raffle` | — |

### Iconos

Usar `lucide-vue-next`:

```typescript
import { Check, X, Loader2, AlertCircle, Ticket, User } from 'lucide-vue-next';
```

---

## 🔌 API y Servicios

### Axios Instance (`core/api/axiosInstance.ts`)

- `baseURL` desde `envConfig.apiUrl`
- Request interceptor: agrega `Bearer <token>` y `_t` timestamp a GETs
- Response interceptor: maneja 400, 401, 403, 404, 500
- 401 → clear localStorage + dispatch `auth:unauthorized`

### Error Handler (`core/api/errorHandler.ts`)

```typescript
import { extractErrorMessage, formatValidationErrors } from '@/core/api/errorHandler';

// En un store o componente:
const { error } = await authService.login(data);
if (error) {
  const formatted = formatValidationErrors(error.errors);
  // formatted = { email: 'El email ya está registrado', ... }
}
```

### Respuesta API Estándar

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
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
- [ ] Tipos definidos en `core/types/api.types.ts`
- [ ] Servicio sigue patrón con `USE_MOCKS`
- [ ] Manager es el componente de ruta
- [ ] Rutas configuradas con meta fields correctos

---

## 🚫 Anti-Patrones (NO HACER)

```typescript
// ❌ NO crear tipos por feature
features/tickets/types/ticket.types.ts  // INCORRECTO

// ❌ NO usar estilos scoped
<style scoped>
.my-class { color: red; }
</style>

// ❌ NO importar entre features
import { authStore } from '@/features/auth/managers/AuthManager.vue';  // INCORRECTO

// ❌ NO crear stores para estado local de componente
const useLocalState = defineStore('local', { ... });  // INCORRECTO

// ❌ NO usar provide/inject (no está en el stack)
provide('key', value);  // INCORRECTO

// ❌ NO crear composables sin necesidad (reservado para lógica realmente reusable)
features/tickets/composables/useTicketLogic.ts  // Solo si es MUY reusable
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
import { axiosInstance } from '@/core/api/axiosInstance';
import type { ApiResponse } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

export const <feature>Service = {
  async getAll(): Promise<ApiResponse<unknown[]>> {
    if (USE_MOCKS) {
      const { mockGetAll } = await import('@/mocks/api');
      return mockGetAll();
    }
    return axiosInstance.get<ApiResponse<unknown[]>>('/endpoint');
  },

  async getById(id: string): Promise<ApiResponse<unknown>> {
    // ...
  },

  async create(data: unknown): Promise<ApiResponse<unknown>> {
    // ...
  },
};
```

### Snippet de Manager Template

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUiStore } from '@/stores/uiStore';
import { <feature>Service } from '../services/<feature>Service';
import { BaseButton, BaseCard, BaseLoader } from '@/shared/components/ui';

const uiStore = useUiStore();

const { data, isLoading, error } = useQuery({
  queryKey: ['<feature>'],
  queryFn: () => <feature>Service.getAll(),
});

const handleAction = async () => {
  uiStore.showLoading();
  try {
    // lógica
    uiStore.showSuccess('Éxito', 'Operación completada');
  } catch (err) {
    uiStore.showError('Error', 'Algo salió mal');
  } finally {
    uiStore.hideLoading();
  }
};
</script>

<template>
  <div class="container mx-auto p-6">
    <BaseCard v-if="isLoading">
      <BaseLoader />
    </BaseCard>
    <BaseButton @click="handleAction">Acción</BaseButton>
  </div>
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
