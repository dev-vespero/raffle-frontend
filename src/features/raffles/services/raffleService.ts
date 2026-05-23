import axiosInstance from '@/core/api/client';
import type { ApiResponse, Raffle, RaffleDetail } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

export const raffleService = {
  async getAll(): Promise<ApiResponse<Raffle[]>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getAll();
    }
    const response = await axiosInstance.get<ApiResponse<Raffle[]>>('/raffles');
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<RaffleDetail>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getById(id);
    }
    const response = await axiosInstance.get<ApiResponse<RaffleDetail>>(`/raffles/${id}`);
    return response.data;
  },

  async getActive(): Promise<ApiResponse<Raffle[]>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getActive();
    }
    const response = await axiosInstance.get<ApiResponse<Raffle[]>>('/raffles/active');
    return response.data;
  },
};
