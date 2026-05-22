import axiosInstance from '@/core/api/axiosInstance';
import type { ApiResponse, LoginRequest, RegisterRequest, User } from '@/core/types/api.types';

// Flag para usar mocks en desarrollo
const USE_MOCKS = import.meta.env.DEV;

// Importar mocks si es necesario
let authMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    authMock = module.authMock;
  });
}

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    if (USE_MOCKS) {
      return authMock.login(data);
    }
    
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      data
    );
    
    return response.data;
  },
  
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    if (USE_MOCKS) {
      return authMock.register(data);
    }
    
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      data
    );
    
    return response.data;
  },
  
  /**
   * Verificar email
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    if (USE_MOCKS) {
      return authMock.verifyEmail(token);
    }
    
    const response = await axiosInstance.post<ApiResponse<void>>(
      '/auth/verify-email',
      { token }
    );
    
    return response.data;
  },
  
  /**
   * Actualizar perfil
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (USE_MOCKS) {
      return authMock.updateProfile('current', data);
    }
    
    const response = await axiosInstance.patch<ApiResponse<User>>(
      '/auth/profile',
      data
    );
    
    return response.data;
  },
  
  /**
   * Actualizar contraseña
   */
  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: undefined };
    }
    
    const response = await axiosInstance.post<ApiResponse<void>>(
      '/auth/change-password',
      data
    );
    
    return response.data;
  },
  
  /**
   * Actualizar preferencias de notificación
   */
  async updateNotifications(notifications: User['notifications']): Promise<ApiResponse<User>> {
    if (USE_MOCKS) {
      return authMock.updateNotifications('current', notifications);
    }
    
    const response = await axiosInstance.patch<ApiResponse<User>>(
      '/auth/notifications',
      { notifications }
    );
    
    return response.data;
  },
  
  /**
   * Cerrar sesión
   */
  async logout(): Promise<ApiResponse<void>> {
    if (USE_MOCKS) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, data: undefined };
    }
    
    const response = await axiosInstance.post<ApiResponse<void>>('/auth/logout');
    
    return response.data;
  },
};
