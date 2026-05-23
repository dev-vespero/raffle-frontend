import type { PurchaseRepository } from '../domain/ports/purchase-repository.port';
import { HttpPurchaseRepository } from './api/purchase.repository.http';
import { MockPurchaseRepository } from './mocks/purchase.repository.mock';
import { ACCOUNT_CONFIG } from './config/account.config';

export function createPurchaseRepository(): PurchaseRepository {
  return ACCOUNT_CONFIG.USE_MOCKS
    ? new MockPurchaseRepository()
    : new HttpPurchaseRepository();
}
