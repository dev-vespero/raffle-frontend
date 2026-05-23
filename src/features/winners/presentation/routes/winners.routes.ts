import type { RouteRecordRaw } from 'vue-router';
import { WINNERS_ROUTES } from '../../domain/constants/route.constant';
import PublicLayout from '@/shared/components/layout/public-layout.vue';

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: 'ganadores',
        name: WINNERS_ROUTES.INDEX,
        component: () => import('../views/WinnersPage.vue'),
        meta: {
          title: 'Ganadores',
        },
      },
    ],
  },
] as RouteRecordRaw[];
