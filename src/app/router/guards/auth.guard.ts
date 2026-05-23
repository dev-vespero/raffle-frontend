import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();

  const baseTitle = import.meta.env.VITE_APP_NAME || 'Moto Moto Rifas';
  document.title = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'auth-login', query: { redirect: to.fullPath } });
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'home-index' });
  }

  next();
}
