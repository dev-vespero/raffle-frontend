import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/core/types/api.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  
  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userName = computed(() => user.value?.name || 'Usuario');
  const userEmail = computed(() => user.value?.email || '');
  
  // Inicializar desde localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  };
  
  // Guardar auth en localStorage
  const persistAuth = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;
    
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };
  
  // Limpiar auth
  const clearAuth = () => {
    token.value = null;
    user.value = null;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };
  
  // Login
  const login = async (email: string, password: string) => {
    isLoading.value = true;
    
    try {
      // TODO: Llamar a authService.login
      // Por ahora mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        phone: '04121234567',
        identification: 'V-12345678',
        emailVerified: true,
        notifications: {
          email: true,
          whatsapp: true,
        },
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      persistAuth(mockToken, mockUser);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };
  
  // Registro
  const register = async (data: {
    email: string;
    password: string;
    phone: string;
    identification: string;
    name?: string;
  }) => {
    isLoading.value = true;
    
    try {
      // TODO: Llamar a authService.register
      // Por ahora mock
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email: data.email,
        name: data.name || data.email.split('@')[0],
        phone: data.phone,
        identification: data.identification,
        emailVerified: false,
        notifications: {
          email: true,
          whatsapp: true,
        },
        createdAt: new Date().toISOString(),
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      persistAuth(mockToken, mockUser);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };
  
  // Logout
  const logout = () => {
    clearAuth();
    // Redirigir a home o login
    window.location.href = '/';
  };
  
  // Actualizar perfil
  const updateProfile = async (data: Partial<User>) => {
    if (!user.value) return { success: false, error: new Error('No hay usuario') };
    
    isLoading.value = true;
    
    try {
      // TODO: Llamar a authService.updateProfile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      user.value = { ...user.value, ...data };
      localStorage.setItem('auth_user', JSON.stringify(user.value));
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };
  
  // Actualizar notificaciones
  const updateNotifications = async (notifications: User['notifications']) => {
    if (!user.value) return { success: false, error: new Error('No hay usuario') };
    
    isLoading.value = true;
    
    try {
      // TODO: Llamar a authService.updateNotifications
      await new Promise(resolve => setTimeout(resolve, 500));
      
      user.value.notifications = notifications;
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
    // Estado
    user,
    token,
    isLoading,
    
    // Computed
    isAuthenticated,
    userName,
    userEmail,
    
    // Actions
    initAuth,
    login,
    register,
    logout,
    updateProfile,
    updateNotifications,
  };
});
