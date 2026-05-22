import axiosInstance from '@/core/api/axiosInstance';
import type { ApiResponse, BuyerTickets } from '@/core/types/api.types';
import { raffleConfig } from '@/config/raffle.config';

const USE_MOCKS = import.meta.env.DEV;

let verificationMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    verificationMock = module.verificationMock;
  });
}

export const verificationService = {
  /**
   * Buscar comprador por teléfono
   */
  async searchByPhone(phone: string): Promise<ApiResponse<BuyerTickets>> {
    if (USE_MOCKS) {
      return verificationMock.searchByPhone(phone);
    }
    
    const response = await axiosInstance.get<ApiResponse<BuyerTickets>>(
      `/raffles/${raffleConfig.token}/buyers/${phone}`
    );
    
    return response.data;
  },
  
  /**
   * Buscar por número de ticket
   */
  async searchByTicket(ticketNumber: string): Promise<ApiResponse<BuyerTickets>> {
    if (USE_MOCKS) {
      return verificationMock.searchByTicket(ticketNumber);
    }
    
    const response = await axiosInstance.get<ApiResponse<BuyerTickets>>(
      `/raffles/${raffleConfig.token}/tickets/${ticketNumber}/buyer`
    );
    
    return response.data;
  },
};
