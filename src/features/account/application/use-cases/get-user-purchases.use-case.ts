import type { PurchaseRepository } from '../../domain/ports/purchase-repository.port';
import type { Purchase } from '../../domain/entities/purchase.entity';

export class GetUserPurchasesUseCase {
  constructor(private readonly repo: PurchaseRepository) {}

  async execute(userId: string): Promise<Purchase[]> {
    return this.repo.findByUserId(userId);
  }
}
