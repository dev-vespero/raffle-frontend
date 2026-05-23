import type { Purchase } from '../entities/purchase.entity';

export interface PurchaseRepository {
  findByUserId(userId: string): Promise<Purchase[]>;
}
