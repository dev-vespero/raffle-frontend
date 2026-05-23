import type { User } from '../entities/user.entity';

export interface AuthResult {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  phone: string;
  identification: string;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegistrationData): Promise<AuthResult>;
  logout(): Promise<void>;
}
