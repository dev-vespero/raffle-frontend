import type { AuthRepository } from '../domain/ports/auth-repository.port';
import { HttpAuthRepository } from './api/auth.repository.http';
import { MockAuthRepository } from './mocks/auth.repository.mock';
import { AUTH_CONFIG } from './config/auth.config';

export function createAuthRepository(): AuthRepository {
  return AUTH_CONFIG.USE_MOCKS
    ? new MockAuthRepository()
    : new HttpAuthRepository();
}
