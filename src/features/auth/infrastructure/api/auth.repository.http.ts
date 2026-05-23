import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import { User } from '../../domain/entities/user.entity';
import type {
  AuthRepository,
  AuthResult,
  LoginCredentials,
  RegistrationData,
} from '../../domain/ports/auth-repository.port';
import { AUTH_CONFIG } from '../config/auth.config';

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await axiosInstance.post<
      ApiResponse<{ user: Record<string, unknown>; token: string }>
    >(AUTH_CONFIG.ENDPOINTS.LOGIN, credentials);

    return {
      user: User.fromApi(response.data.data.user),
      token: response.data.data.token,
    };
  }

  async register(data: RegistrationData): Promise<AuthResult> {
    const response = await axiosInstance.post<
      ApiResponse<{ user: Record<string, unknown>; token: string }>
    >(AUTH_CONFIG.ENDPOINTS.REGISTER, data);

    return {
      user: User.fromApi(response.data.data.user),
      token: response.data.data.token,
    };
  }

  async logout(): Promise<void> {
    await axiosInstance.post<ApiResponse<void>>(AUTH_CONFIG.ENDPOINTS.LOGOUT);
  }
}
