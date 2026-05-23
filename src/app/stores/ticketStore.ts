import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SelectedTicket } from '@/core/types/api.types';
import { raffleConfig } from '@/config/raffle.config';

export const useTicketStore = defineStore('ticket', () => {
  // Estado
  const selectedTickets = ref<SelectedTicket[]>([]);
  const quantity = ref(1);
  const isSelecting = ref(false);
  
  // Computed
  const totalTickets = computed(() => selectedTickets.value.length);
  
  const subtotal = computed(() => {
    return selectedTickets.value.reduce((sum, ticket) => sum + ticket.price, 0);
  });
  
  const totalDiscount = computed(() => {
    return selectedTickets.value.reduce((sum, ticket) => sum + ticket.discount, 0);
  });
  
  const total = computed(() => {
    return subtotal.value - totalDiscount.value;
  });
  
  const hasSelectedTickets = computed(() => totalTickets.value > 0);
  
  const canContinue = computed(() => {
    return totalTickets.value > 0 && 
           totalTickets.value >= raffleConfig.tickets.minBuy &&
           totalTickets.value <= raffleConfig.tickets.maxBuy;
  });
  
  // Actions
  const addTicket = (ticketNumber: string | { number: string; price?: number; discount?: number }) => {
    const ticketData = typeof ticketNumber === 'string' 
      ? { number: ticketNumber, price: raffleConfig.priceUnit, discount: 0 }
      : ticketNumber;
    
    // Verificar si ya está seleccionado
    if (selectedTickets.value.some(t => t.number === ticketData.number)) {
      return false;
    }
    
    // Calcular precio con descuento si no se proporcionó
    const priceData = ticketData.price !== undefined
      ? { basePrice: ticketData.price, discount: ticketData.discount || 0 }
      : calculateTicketPrice(selectedTickets.value.length + 1);
    
    selectedTickets.value.push({
      number: ticketData.number,
      price: priceData.basePrice,
      discount: priceData.discount,
    });
    
    return true;
  };
  
  const removeTicket = (ticketNumber: string) => {
    const index = selectedTickets.value.findIndex(t => t.number === ticketNumber);
    
    if (index !== -1) {
      selectedTickets.value.splice(index, 1);
      
      // Recalcular precios después de remover
      recalculatePrices();
      
      return true;
    }
    
    return false;
  };
  
  const clearSelection = () => {
    selectedTickets.value = [];
    quantity.value = 1;
  };
  
  const setQuantity = (newQuantity: number) => {
    const min = raffleConfig.tickets.minBuy;
    const max = Math.min(raffleConfig.tickets.maxBuy, raffleConfig.tickets.available);
    
    quantity.value = Math.max(min, Math.min(newQuantity, max));
  };
  
  // Calcular precio de un ticket con descuento
  const calculateTicketPrice = (position: number): { basePrice: number; discount: number } => {
    const basePrice = raffleConfig.priceUnit;
    let discount = 0;
    
    if (raffleConfig.discounts.enabled && position > 1) {
      const ticketsForDiscount = position - 1;
      
      if (ticketsForDiscount <= raffleConfig.discounts.maxTickets) {
        const discountRate = raffleConfig.discounts.rate * ticketsForDiscount;
        const discountIncrease = raffleConfig.discounts.rateIncrease * ticketsForDiscount;
        
        discount = basePrice * (discountRate + discountIncrease) / 100;
      }
    }
    
    return {
      basePrice,
      discount,
    };
  };
  
  // Recalcular precios de todos los tickets
  const recalculatePrices = () => {
    selectedTickets.value = selectedTickets.value.map((ticket, index) => {
      const priceData = calculateTicketPrice(index + 1);
      
      return {
        number: ticket.number,
        price: priceData.basePrice,
        discount: priceData.discount,
      };
    });
  };
  
  // Verificar si un ticket está seleccionado
  const isTicketSelected = (ticketNumber: string) => {
    return selectedTickets.value.some(t => t.number === ticketNumber);
  };
  
  // Obtener números seleccionados
  const getSelectedNumbers = () => {
    return selectedTickets.value.map(t => t.number);
  };
  
  return {
    // Estado
    selectedTickets,
    quantity,
    isSelecting,
    
    // Computed
    totalTickets,
    subtotal,
    totalDiscount,
    total,
    hasSelectedTickets,
    canContinue,
    
    // Actions
    addTicket,
    removeTicket,
    clearSelection,
    setQuantity,
    recalculatePrices,
    isTicketSelected,
    getSelectedNumbers,
  };
});
