import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PaymentMethod, Purchase } from '@/core/types/api.types';

interface PurchaseState {
  step: number;
  buyerData: {
    email: string;
    phone: string;
    identification: string;
    name?: string;
  };
  paymentMethod: PaymentMethod | null;
  voucher: {
    file: File | null;
    reference: string;
    date: string;
    bank: string;
  };
  isProcessing: boolean;
  purchase: Purchase | null;
}

export const usePurchaseStore = defineStore('purchase', () => {
  // Estado
  const step = ref(1);
  const buyerData = ref({
    email: '',
    phone: '',
    identification: '',
    name: '',
  });
  const paymentMethod = ref<PaymentMethod | null>(null);
  const voucher = ref({
    file: null as File | null,
    reference: '',
    date: '',
    bank: '',
  });
  const isProcessing = ref(false);
  const purchase = ref<Purchase | null>(null);
  
  // Actions
  const setStep = (newStep: number) => {
    step.value = Math.max(1, Math.min(4, newStep));
  };
  
  const nextStep = () => {
    step.value = Math.min(4, step.value + 1);
  };
  
  const prevStep = () => {
    step.value = Math.max(1, step.value - 1);
  };
  
  const reset = () => {
    step.value = 1;
    buyerData.value = {
      email: '',
      phone: '',
      identification: '',
      name: '',
    };
    paymentMethod.value = null;
    voucher.value = {
      file: null,
      reference: '',
      date: '',
      bank: '',
    };
    isProcessing.value = false;
    purchase.value = null;
  };
  
  const updateBuyerData = (data: Partial<typeof buyerData.value>) => {
    buyerData.value = { ...buyerData.value, ...data };
  };
  
  const setPaymentMethod = (method: PaymentMethod) => {
    paymentMethod.value = method;
  };
  
  const updateVoucher = (data: Partial<typeof voucher.value>) => {
    voucher.value = { ...voucher.value, ...data };
  };
  
  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing;
  };
  
  const setPurchase = (newPurchase: Purchase | null) => {
    purchase.value = newPurchase;
  };
  
  return {
    // Estado
    step,
    buyerData,
    paymentMethod,
    voucher,
    isProcessing,
    purchase,
    
    // Actions
    setStep,
    nextStep,
    prevStep,
    reset,
    updateBuyerData,
    setPaymentMethod,
    updateVoucher,
    setProcessing,
    setPurchase,
  };
});
