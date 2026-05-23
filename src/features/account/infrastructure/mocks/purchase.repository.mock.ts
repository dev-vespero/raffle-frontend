import { Purchase } from '../../domain/entities/purchase.entity';
import { PurchaseStatus } from '../../domain/constants/purchase-status.enum';
import type { PurchaseRepository } from '../../domain/ports/purchase-repository.port';

const mockPurchases: Record<string, unknown>[] = [
  {
    id: 'purchase-001',
    date: '2026-01-15',
    tickets: ['123', '456', '789'],
    total: 4.5,
    status: PurchaseStatus.VERIFIED,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'purchase-002',
    date: '2026-01-10',
    tickets: ['321'],
    total: 1.5,
    status: PurchaseStatus.PENDING,
    createdAt: '2026-01-10T14:00:00.000Z',
  },
];

export class MockPurchaseRepository implements PurchaseRepository {
  async findByUserId(_userId: string): Promise<Purchase[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPurchases.map((item) => Purchase.fromApi(item));
  }
}
