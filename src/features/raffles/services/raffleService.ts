import { axiosInstance } from '@/core/api/axiosInstance';
import type { ApiResponse, Raffle, RaffleDetail } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

export const raffleService = {
  async getAll(): Promise<ApiResponse<Raffle[]>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getAll();
    }
    return axiosInstance.get<ApiResponse<Raffle[]>>('/raffles');
  },

  async getById(id: string): Promise<ApiResponse<RaffleDetail>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getById(id);
    }
    return axiosInstance.get<ApiResponse<RaffleDetail>>(`/raffles/${id}`);
  },

  async getActive(): Promise<ApiResponse<Raffle[]>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getActive();
    }
    return axiosInstance.get<ApiResponse<Raffle[]>>('/raffles/active');
  },
};
