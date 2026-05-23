import axiosInstance from '@/core/api/client';
import type { ApiResponse, Purchase } from '@/core/types/api.types';
import { raffleConfig } from '@/config/raffle.config';

const USE_MOCKS = import.meta.env.DEV;

let purchaseMock: any;
if (USE_MOCKS) {
  import('@/mocks/api').then(module => {
    purchaseMock = module.purchaseMock;
  });
}

export const purchaseService = {
  /**
   * Crear nueva compra
   */
  async create(data: {
    tickets: string[];
    paymentMethodId: string;
    voucher?: {
      file: Blob;
      reference: string;
      date: string;
      bank: string;
    };
  }): Promise<ApiResponse<Purchase>> {
    if (USE_MOCKS) {
      return purchaseMock.create(data);
    }
    
    const formData = new FormData();
    formData.append('tickets', JSON.stringify(data.tickets));
    formData.append('payment_method_id', data.paymentMethodId);
    
    if (data.voucher) {
      formData.append('voucher', data.voucher.file);
      formData.append('reference', data.voucher.reference);
      formData.append('date', data.voucher.date);
      formData.append('bank', data.voucher.bank);
    }
    
    const response = await axiosInstance.post<ApiResponse<Purchase>>(
      `/raffles/${raffleConfig.token}/purchases`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Subir comprobante de pago
   */
  async uploadVoucher(
    purchaseToken: string,
    voucher: {
      file: Blob;
      reference: string;
      date: string;
      bank: string;
    }
  ): Promise<ApiResponse<Purchase>> {
    if (USE_MOCKS) {
      return purchaseMock.uploadVoucher(purchaseToken, voucher);
    }
    
    const formData = new FormData();
    formData.append('voucher', voucher.file);
    formData.append('reference', voucher.reference);
    formData.append('date', voucher.date);
    formData.append('bank', voucher.bank);
    
    const response = await axiosInstance.post<ApiResponse<Purchase>>(
      `/raffles/${raffleConfig.token}/purchases/${purchaseToken}/voucher`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },
  
  /**
   * Obtener compras por comprador
   */
  async getByBuyer(email: string): Promise<ApiResponse<Purchase[]>> {
    if (USE_MOCKS) {
      return purchaseMock.getByBuyer(email);
    }
    
    const response = await axiosInstance.get<ApiResponse<Purchase[]>>(
      `/raffles/${raffleConfig.token}/purchases`,
      {
        params: { buyer_email: email },
      }
    );
    
    return response.data;
  },
};
