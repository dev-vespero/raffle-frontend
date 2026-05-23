import type { RouteRecordRaw, Router } from 'vue-router';

export function registerFeatureRoutes(router: Router) {
  const routeModules = import.meta.glob<RouteRecordRaw[]>(
    '@/features/*/presentation/routes/*.routes.ts',
    { eager: true, import: 'default' },
  );

  Object.values(routeModules).forEach((routes) => {
    routes.forEach((route) => router.addRoute(route));
  });
}
