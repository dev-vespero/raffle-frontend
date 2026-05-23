# 🌐 Rutas y Router

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
        name: TICKET_MANAGEMENT_LIST,
        component: TicketListPage,
        meta: { breadcrumb: 'Lista de Tickets' }
      },
      {
        path: 'create',
        name: TICKET_MANAGEMENT_CREATE,
        component: TicketCreatePage,
        meta: { 
          breadcrumb: 'Nuevo Ticket',
          requiresPermission: 'ticket:create'
        }
      },
      {
        path: ':id',
        name: TICKET_MANAGEMENT_DETAIL,
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
  const routeModules = import.meta.glob<RouteRecordRaw[]>(
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
<template>
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
