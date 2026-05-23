import axiosInstance from '@/core/api/client';
import type { ApiResponse } from '@/core/types/api.types';
import { raffleConfig } from '@/config/raffle.config';

const USE_MOCKS = import.meta.env.DEV;

let ticketMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    ticketMock = module.ticketMock;
  });
}

export const ticketService = {
  /**
   * Obtener todos los tickets disponibles
   */
  async getAll(): Promise<ApiResponse<string[]>> {
    if (USE_MOCKS) {
      return ticketMock.getAll();
    }
    
    const response = await axiosInstance.get<ApiResponse<string[]>>(
      `/raffles/${raffleConfig.token}/tickets`
    );
    
    return response.data;
  },
  
  /**
   * Obtener tickets disponibles (sin los vendidos)
   */
  async getAvailable(): Promise<ApiResponse<string[]>> {
    if (USE_MOCKS) {
      return ticketMock.getAvailable();
    }
    
    const response = await axiosInstance.get<ApiResponse<string[]>>(
      `/raffles/${raffleConfig.token}/tickets/available`
    );
    
    return response.data;
  },
  
  /**
   * Buscar un ticket específico
   */
  async search(number: string): Promise<ApiResponse<{ number: string; status: string }>> {
    if (USE_MOCKS) {
      return ticketMock.search(number);
    }
    
    const response = await axiosInstance.get<ApiResponse<{ number: string; status: string }>>(
      `/raffles/${raffleConfig.token}/tickets/${number}`
    );
    
    return response.data;
  },
};
