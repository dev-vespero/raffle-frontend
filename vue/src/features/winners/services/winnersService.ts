import axiosInstance from '@/core/api/axiosInstance';
import type { ApiResponse, PaginatedResponse, RaffleWinners } from '@/core/types/api.types';
import { raffleConfig } from '@/config/raffle.config';

const USE_MOCKS = import.meta.env.DEV;

let winnersMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    winnersMock = module.winnersMock;
  });
}

export const winnersService = {
  /**
   * Obtener ganadores del sorteo actual
   */
  async getCurrent(): Promise<ApiResponse<RaffleWinners>> {
    if (USE_MOCKS) {
      return winnersMock.getCurrent();
    }
    
    const response = await axiosInstance.get<ApiResponse<RaffleWinners>>(
      `/raffles/${raffleConfig.token}/winners/current`
    );
    
    return response.data;
  },
  
  /**
   * Obtener histórico de ganadores (paginado)
   */
  async getHistorical(
    page: number = 1,
    limit: number = 6,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<RaffleWinners>>> {
    if (USE_MOCKS) {
      return winnersMock.getHistorical(page, limit, search);
    }
    
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<RaffleWinners>>>(
      '/raffles/winners/historical',
      {
        params: { page, limit, search },
      }
    );
    
    return response.data;
  },
  
  /**
   * Obtener ganadores de un sorteo específico
   */
  async getByRaffle(raffleId: string): Promise<ApiResponse<RaffleWinners>> {
    if (USE_MOCKS) {
      return winnersMock.getByRaffle(raffleId);
    }
    
    const response = await axiosInstance.get<ApiResponse<RaffleWinners>>(
      `/raffles/${raffleId}/winners`
    );
    
    return response.data;
  },
};
