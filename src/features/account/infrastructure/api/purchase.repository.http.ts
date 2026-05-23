import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import { Purchase } from '../../domain/entities/purchase.entity';
import type { PurchaseRepository } from '../../domain/ports/purchase-repository.port';
import { ACCOUNT_CONFIG } from '../config/account.config';

export class HttpPurchaseRepository implements PurchaseRepository {
  async findByUserId(userId: string): Promise<Purchase[]> {
    const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
      `${ACCOUNT_CONFIG.ENDPOINTS.PURCHASES}/user/${userId}`,
    );

    return response.data.data.map((item) => Purchase.fromApi(item));
  }
}
