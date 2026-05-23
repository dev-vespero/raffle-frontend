import axiosInstance from '@/core/api/axiosInstance';
import type { ApiResponse, Raffle } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

export const homeService = {
  async getActiveRaffles(): Promise<ApiResponse<Raffle[]>> {
    if (USE_MOCKS) {
      const { raffleMock } = await import('@/mocks/api');
      return raffleMock.getActive();
    }
    const response = await axiosInstance.get<ApiResponse<Raffle[]>>('/raffles/active');
    return response.data;
  },
};
