import { User } from '../../domain/entities/user.entity';
import type {
  AuthRepository,
  AuthResult,
  LoginCredentials,
  RegistrationData,
} from '../../domain/ports/auth-repository.port';

const mockUser: Record<string, unknown> = {
  id: 'user-001',
  email: 'demo@motomotorifas.com',
  name: 'Usuario Demo',
  phone: '04121234567',
  identification: 'V-12345678',
  emailVerified: true,
  notifications: { email: true, whatsapp: false },
  createdAt: '2026-01-01T00:00:00.000Z',
};

export class MockAuthRepository implements AuthRepository {
  async login(_credentials: LoginCredentials): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      user: User.fromApi(mockUser),
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async register(data: RegistrationData): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      user: User.fromApi({ ...mockUser, name: data.name, email: data.email }),
      token: 'mock-jwt-token-' + Date.now(),
    };
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
