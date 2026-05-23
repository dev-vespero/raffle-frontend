import { createRouter, createWebHistory } from 'vue-router';
import { registerFeatureRoutes } from './router.factory';
import { authGuard } from './guards/auth.guard';
import NotFound from '@/shared/components/layout/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

router.beforeEach(authGuard);

registerFeatureRoutes(router);

router.addRoute({
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFound,
  meta: {
    title: 'Página no encontrada',
  },
});

export default router;
