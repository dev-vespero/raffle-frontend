import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import PublicLayout from '@/shared/components/layout/public-layout.vue';
import PrivateLayout from '@/shared/components/layout/private-layout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/features/home/managers/HomeManager.vue'),
        meta: {
          title: 'Inicio',
        },
      },
      {
        path: 'rifas/:id',
        name: 'RaffleDetail',
        component: () => import('@/features/raffles/managers/RaffleDetailManager.vue'),
        meta: {
          title: 'Detalle de Rifa',
        },
      },
      {
        path: 'boletos',
        name: 'Tickets',
        redirect: '/',
        meta: {
          title: 'Seleccionar Boletos',
        },
      },
      {
        path: 'verificar',
        name: 'Verification',
        component: () => import('@/features/verification/managers/VerificationManager.vue'),
        meta: {
          title: 'Verificar Boletos',
        },
      },
      {
        path: 'ganadores',
        name: 'Winners',
        component: () => import('@/features/winners/managers/WinnersManager.vue'),
        meta: {
          title: 'Ganadores',
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/features/auth/managers/AuthManager.vue'),
        meta: {
          title: 'Iniciar Sesión',
          guest: true,
        },
      },
      {
        path: 'registro',
        name: 'Register',
        component: () => import('@/features/auth/managers/AuthManager.vue'),
        props: { mode: 'register' },
        meta: {
          title: 'Registrarse',
          guest: true,
        },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/shared/components/layout/NotFound.vue'),
        meta: {
          title: 'Página no encontrada',
        },
      },
    ],
  },
  {
    path: '/cuenta',
    component: PrivateLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Account',
        redirect: '/cuenta/numeros',
        component: () => import('@/features/account/managers/AccountManager.vue'),
        meta: {
          title: 'Mi Cuenta',
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
        ],
      },
    ],
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const baseTitle = import.meta.env.VITE_APP_NAME || 'Moto Moto Rifas';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
