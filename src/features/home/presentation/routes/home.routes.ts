import type { RouteRecordRaw } from 'vue-router';
import { HOME_ROUTES } from '../../domain/constants/route.constant';

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: HOME_ROUTES.INDEX,
    name: 'Home',
    component: () => import('../views/HomeIndexPage.vue'),
    meta: {
      title: 'Inicio',
    },
  },
];
