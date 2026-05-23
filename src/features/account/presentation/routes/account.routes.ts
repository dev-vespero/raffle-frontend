import type { RouteRecordRaw } from 'vue-router';
import { ACCOUNT_ROUTES } from '../../domain/constants/route.constant';
import PrivateLayout from '@/shared/components/layout/PrivateLayout.vue';

export default [
  {
    path: '/',
    component: PrivateLayout,
    children: [
      {
        path: 'cuenta',
        component: () => import('../views/AccountLayout.vue'),
        meta: {
          requiresAuth: true,
          title: 'Mi Cuenta',
        },
        children: [
          {
            path: '',
            redirect: { name: ACCOUNT_ROUTES.NUMBERS },
          },
          {
            path: 'numeros',
            name: ACCOUNT_ROUTES.NUMBERS,
            component: () => import('../views/MyNumbersPage.vue'),
            meta: {
              title: 'Mis Números',
            },
          },
          {
            path: 'premios',
            name: ACCOUNT_ROUTES.PRIZES,
            component: () => import('../views/MyPrizesPage.vue'),
            meta: {
              title: 'Mis Premios',
            },
          },
          {
            path: 'perfil',
            name: ACCOUNT_ROUTES.PROFILE,
            component: () => import('../views/ProfilePage.vue'),
            meta: {
              title: 'Mi Perfil',
            },
          },
          {
            path: 'notificaciones',
            name: ACCOUNT_ROUTES.NOTIFICATIONS,
            component: () => import('../views/NotificationPreferencesPage.vue'),
            meta: {
              title: 'Notificaciones',
            },
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[];
