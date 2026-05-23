import type { ProfileRepository } from '../domain/ports/profile-repository.port';
import { HttpProfileRepository } from './api/profile.repository.http';
import { MockProfileRepository } from './mocks/profile.repository.mock';
import { ACCOUNT_CONFIG } from './config/account.config';

export function createProfileRepository(): ProfileRepository {
  return ACCOUNT_CONFIG.USE_MOCKS
    ? new MockProfileRepository()
    : new HttpProfileRepository();
}
