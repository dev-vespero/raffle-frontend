// Tipos genéricos para respuestas de API

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  identification: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  identification: string;
  emailVerified: boolean;
  notifications: {
    email: boolean;
    whatsapp: boolean;
  };
  createdAt: string;
  password?: string;
}

// Tipos para tickets
export interface Ticket {
  number: string;
  status: 'available' | 'selected' | 'sold';
}

export interface SelectedTicket {
  number: string;
  price: number;
  discount: number;
}

// Tipos para compra
export interface PurchaseRequest {
  tickets: string[];
  paymentMethodId: string;
  voucher?: {
    file: Blob;
    reference: string;
    date: string;
    bank: string;
  };
}

export interface Purchase {
  id: string;
  token: string;
  tickets: string[];
  total: number;
  status: 'pending' | 'verified' | 'cancelled' | 'unverified';
  paymentMethod: PaymentMethod;
  createdAt: string;
}

// Tipos para métodos de pago
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'movil' | 'transferencia' | 'zelle' | 'paypal';
  bank?: string;
  account?: string;
  interbank?: string;
  owner: string;
  logo?: string;
  notes?: string;
}

// Tipos para verificación
export interface BuyerTickets {
  buyer: {
    name: string;
    phone: string;
    email?: string;
  };
  purchases: Purchase[];
}

// Tipos para ganadores
export interface Winner {
  id: string;
  name: string;
  ticket: string;
  prize: string;
  prizeValue?: number;
  photo?: string;
  verified: boolean;
  createdAt: string;
}

export interface RaffleWinners {
  raffleName: string;
  raffleDate: string;
  winners: Winner[];
  isCurrent: boolean;
}
