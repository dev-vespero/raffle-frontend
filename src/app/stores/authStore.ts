import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User } from '@/features/auth/domain/entities/user.entity';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value?.name || 'Usuario');
  const userEmail = computed(() => user.value?.email || '');

  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = new User(
          (JSON.parse(storedUser) as Record<string, unknown>).id as string,
          (JSON.parse(storedUser) as Record<string, unknown>).email as string,
          (JSON.parse(storedUser) as Record<string, unknown>).name as string,
          (JSON.parse(storedUser) as Record<string, unknown>).phone as string,
          (JSON.parse(storedUser) as Record<string, unknown>).identification as string,
          (JSON.parse(storedUser) as Record<string, unknown>).emailVerified as boolean,
          (JSON.parse(storedUser) as Record<string, unknown>).notifications as { email: boolean; whatsapp: boolean },
          (JSON.parse(storedUser) as Record<string, unknown>).createdAt as string,
        );
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  };

  const persistAuth = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;

    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  // TODO: Mover a use-cases cuando se refactorice features/account
  // Estos métodos se usan en ProfileForm.vue y NotificationSettings.vue
  const updateProfile = async (data: Partial<User>) => {
    if (!user.value) return { success: false, error: new Error('No hay usuario') };

    isLoading.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      user.value = new User(
        user.value.id,
        data.email ?? user.value.email,
        data.name ?? user.value.name,
        data.phone ?? user.value.phone,
        data.identification ?? user.value.identification,
        data.emailVerified ?? user.value.emailVerified,
        data.notifications ?? user.value.notifications,
        user.value.createdAt,
      );
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const updateNotifications = async (notifications: { email: boolean; whatsapp: boolean }) => {
    if (!user.value) return { success: false, error: new Error('No hay usuario') };

    isLoading.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      user.value = new User(
        user.value.id,
        user.value.email,
        user.value.name,
        user.value.phone,
        user.value.identification,
        user.value.emailVerified,
        notifications,
        user.value.createdAt,
      );
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      return { success: true };
    } catch (error) {
      console.error('Update notifications error:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    userName,
    userEmail,
    initAuth,
    persistAuth,
    clearAuth,
    updateProfile,
    updateNotifications,
  };
});
