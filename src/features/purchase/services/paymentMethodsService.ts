import axiosInstance from '@/core/api/client';
import type { ApiResponse, PaymentMethod } from '@/core/types/api.types';

const USE_MOCKS = import.meta.env.DEV;

let paymentMethodsMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    paymentMethodsMock = module.paymentMethodsMock;
  });
}

export const paymentMethodsService = {
  /**
   * Obtener todos los métodos de pago
   */
  async getAll(): Promise<ApiResponse<PaymentMethod[]>> {
    if (USE_MOCKS) {
      return paymentMethodsMock.getAll();
    }
    
    const response = await axiosInstance.get<ApiResponse<PaymentMethod[]>>(
      '/payment-methods'
    );
    
    return response.data;
  },
  
  /**
   * Obtener método de pago por ID
   */
  async getById(id: string): Promise<ApiResponse<PaymentMethod>> {
    if (USE_MOCKS) {
      return paymentMethodsMock.getById(id);
    }
    
    const response = await axiosInstance.get<ApiResponse<PaymentMethod>>(
      `/payment-methods/${id}`
    );
    
    return response.data;
  },
};
