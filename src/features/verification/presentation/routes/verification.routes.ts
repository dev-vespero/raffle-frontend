import type { RouteRecordRaw } from 'vue-router';
import { VERIFICATION_ROUTES } from '../../domain/constants/route.constant';
import PublicLayout from '@/shared/components/layout/public-layout.vue';

export default [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: 'verificar',
        name: VERIFICATION_ROUTES.INDEX,
        component: () => import('../views/VerificationPage.vue'),
        meta: {
          title: 'Verificar Boletos',
        },
      },
    ],
  },
] as RouteRecordRaw[];
