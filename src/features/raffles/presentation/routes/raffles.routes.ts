import type { RouteRecordRaw } from 'vue-router';
import { RAFFLE_ROUTES } from '../../domain/constants/route.constant';
import PublicLayout from '@/shared/components/layout/public-layout.vue';

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: 'rifas/:id',
        name: RAFFLE_ROUTES.DETAIL,
        component: () => import('../views/RaffleDetailPage.vue'),
        meta: {
          title: 'Detalle de Rifa',
        },
      },
    ],
  },
] as RouteRecordRaw[];
