import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/features/home/managers/HomeManager.vue'),
    meta: {
      title: 'Inicio',
      public: true,
    },
  },
  {
    path: '/boletos',
    name: 'Tickets',
    component: () => import('@/features/tickets/managers/TicketManager.vue'),
    meta: {
      title: 'Seleccionar Boletos',
      public: false,
    },
  },
  {
    path: '/verificar',
    name: 'Verification',
    component: () => import('@/features/verification/managers/VerificationManager.vue'),
    meta: {
      title: 'Verificar Boletos',
      public: true,
    },
  },
  {
    path: '/ganadores',
    name: 'Winners',
    component: () => import('@/features/winners/managers/WinnersManager.vue'),
    meta: {
      title: 'Ganadores',
      public: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/managers/AuthManager.vue'),
    meta: {
      title: 'Iniciar Sesión',
      public: true,
      auth: true, // Ruta de autenticación (no redirigir si está logueado)
    },
  },
  {
    path: '/registro',
    name: 'Register',
    component: () => import('@/features/auth/managers/AuthManager.vue'),
    props: { mode: 'register' },
    meta: {
      title: 'Registrarse',
      public: true,
      auth: true,
    },
  },
  {
    path: '/cuenta',
    name: 'Account',
    component: () => import('@/features/account/managers/AccountManager.vue'),
    meta: {
      title: 'Mi Cuenta',
      public: false,
      requiresAuth: true,
    },
    children: [
      {
        path: 'numeros',
        name: 'MyNumbers',
        component: () => import('@/features/account/components/MyNumbers.vue'),
        meta: {
          title: 'Mis Números',
        },
      },
      {
        path: 'premios',
        name: 'MyPrizes',
        component: () => import('@/features/account/components/MyPrizes.vue'),
        meta: {
          title: 'Mis Premios',
        },
      },
      {
        path: 'perfil',
        name: 'Profile',
        component: () => import('@/features/account/components/ProfileForm.vue'),
        meta: {
          title: 'Mi Perfil',
        },
      },
      {
        path: 'notificaciones',
        name: 'Notifications',
        component: () => import('@/features/account/components/NotificationSettings.vue'),
        meta: {
          title: 'Notificaciones',
        },
      },
      {
        path: '',
        redirect: '/cuenta/numeros',
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/shared/components/layout/NotFound.vue'),
    meta: {
      title: 'Página no encontrada',
      public: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guard para autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Actualizar título de la página
  const baseTitle = import.meta.env.VITE_APP_NAME || 'Moto Moto Rifas';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
  
  // Verificar autenticación
  const requiresAuth = to.meta.requiresAuth || (!to.meta.public && !to.meta.auth);
  const isAuthRoute = to.meta.auth === true;
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirigir a login si requiere auth y no está autenticado
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (isAuthRoute && authStore.isAuthenticated) {
    // Redirigir a home si es ruta de auth y ya está logueado
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
