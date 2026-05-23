import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import { Raffle } from '../../domain/entities/raffle.entity';
import type { RaffleRepository } from '../../domain/ports/raffle-repository.port';
import { HOME_CONFIG } from '../config/home.config';

export class HttpRaffleRepository implements RaffleRepository {
  async getActive(): Promise<Raffle[]> {
    const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
      HOME_CONFIG.ENDPOINTS.ACTIVE_RAFFLES,
    );

    return response.data.data.map((item) => Raffle.fromApi(item));
  }
}
