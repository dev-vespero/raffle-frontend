import type { RouteRecordRaw } from 'vue-router';
import { AUTH_ROUTES } from '../../domain/constants/route.constant';
import PublicLayout from '@/shared/components/layout/PublicLayout.vue';

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: 'login',
        name: AUTH_ROUTES.LOGIN,
        component: () => import('../views/AuthLoginPage.vue'),
        meta: {
          title: 'Iniciar Sesión',
          guest: true,
        },
      },
      {
        path: 'registro',
        name: AUTH_ROUTES.REGISTER,
        component: () => import('../views/AuthRegisterPage.vue'),
        meta: {
          title: 'Registrarse',
          guest: true,
        },
      },
    ],
  },
] as RouteRecordRaw[];
