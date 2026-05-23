// Mock de API completa para desarrollo
// Simula todas las respuestas del backend

import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Purchase,
  PaymentMethod,
  BuyerTickets,
  RaffleWinners,
  Winner,
  Raffle,
  RaffleDetail,
  RafflePrize,
} from '@/core/types/api.types';

// Utilidad para simular delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Utilidad para crear error
const createError = (message: string, status: number, errors?: Record<string, string[]>) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data: { message, errors },
  };
  error.isAxiosError = true;
  throw error;
};

// Mock de usuarios (para autenticación)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@motomotorifas.com',
    password: 'demo123',
    name: 'Demo User',
    phone: '04121234567',
    identification: 'V-12345678',
    emailVerified: true,
    notifications: {
      email: true,
      whatsapp: true,
    },
    createdAt: new Date().toISOString(),
  },
];

// Mock de métodos de pago
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Pago Móvil BDV',
    type: 'movil',
    bank: 'Banco de Venezuela',
    account: '0102-0412-9753098',
    interbank: '14755978',
    owner: 'KATIUSKA MIRELES',
    logo: 'https://rifarito.s3.amazonaws.com/uploads/bank/logo/54/vepagomovilc2c.png',
    notes: 'Indicar cédula en el concepto',
  },
  {
    id: '2',
    name: 'Transferencia Banesco',
    type: 'transferencia',
    bank: 'Banesco',
    account: '0134-0000-00-0000000000',
    owner: 'MOTO MOTO RIFAS C.A.',
    logo: 'https://rifarito.s3.amazonaws.com/uploads/bank/logo/5/banesco.png',
  },
  {
    id: '3',
    name: 'Zelle',
    type: 'zelle',
    account: 'motomotorifas@zelle.com',
    owner: 'MOTO MOTO RIFAS C.A.',
  },
];

// Mock de compras
const mockPurchases: Purchase[] = [];

// Mock de ganadores
const mockWinners: RaffleWinners[] = [
  {
    raffleName: 'GANATE UNA SBR 6G 2025 0KM',
    raffleDate: '2025-02-24',
    isCurrent: true,
    winners: [],
  },
  {
    raffleName: 'RIFA ANTERIOR 1',
    raffleDate: '2024-12-15',
    isCurrent: false,
    winners: [
      {
        id: '1',
        name: 'Juan Pérez',
        ticket: '123',
        prize: 'MOTO 150CC',
        prizeValue: 1200,
        verified: true,
        createdAt: '2024-12-15T20:00:00.000Z',
      },
      {
        id: '2',
        name: 'María González',
        ticket: '456',
        prize: '$50 USD',
        prizeValue: 50,
        verified: true,
        createdAt: '2024-12-15T20:00:00.000Z',
      },
    ],
  },
];

// Mock de rifas
const mockRaffles: Raffle[] = [
  {
    id: '1',
    name: 'GANATE UNA SBR 6G 2025 0KM',
    description: 'Participa y gana esta increíble moto 0km. ¡Entre más boletos tengas, más posibilidades de ganar!',
    image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/54/moto-sbr-6g.jpg',
    drawDate: '2025-02-24',
    drawHour: '8:00 PM',
    status: 'active',
    tickets: {
      total: 700,
      available: 612,
      sold: 88,
    },
    price: 1.5,
    currency: {
      symbol: '$',
      code: 'USD',
    },
    prizes: [
      {
        position: 1,
        name: 'SBR 6G 0KM 2025',
        description: 'Moto nueva 0km, lista para estrenar',
        icon: '🏍️',
        value: 1200,
      },
      {
        position: 2,
        name: '$50 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 50,
      },
      {
        position: 3,
        name: '2 Cambios de Aceite',
        description: 'Para moto 150 CC',
        icon: '🛢️',
      },
    ],
    showProgress: true,
  },
  {
    id: '2',
    name: 'RIFA DIARIA - PREMIO EN EFECTIVO',
    description: 'Participa en nuestra rifa diaria y gana $100 USD en efectivo. ¡Sorteo todos los días a las 8:00 PM!',
    image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/55/premio-efectivo.jpg',
    drawDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    drawHour: '8:00 PM',
    status: 'active',
    tickets: {
      total: 500,
      available: 320,
      sold: 180,
    },
    price: 2,
    currency: {
      symbol: '$',
      code: 'USD',
    },
    prizes: [
      {
        position: 1,
        name: '$100 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 100,
      },
      {
        position: 2,
        name: '$30 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 30,
      },
    ],
    showProgress: true,
  },
  {
    id: '3',
    name: 'RIFA VESPERTINA - IPHONE 15 PRO',
    description: 'Gana un iPhone 15 Pro nuevo. Sorteo especial de la tarde.',
    image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/56/iphone-15-pro.jpg',
    drawDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    drawHour: '4:00 PM',
    status: 'active',
    tickets: {
      total: 1000,
      available: 850,
      sold: 150,
    },
    price: 3,
    currency: {
      symbol: '$',
      code: 'USD',
    },
    prizes: [
      {
        position: 1,
        name: 'iPhone 15 Pro',
        description: 'Nuevo, sellado, 256GB',
        icon: '📱',
        value: 999,
      },
      {
        position: 2,
        name: '$200 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 200,
      },
    ],
    showProgress: true,
  },
  {
    id: '4',
    name: 'RIFA DE LA NOCHE - PS5',
    description: 'Participa y gana una PlayStation 5. Sorteo nocturno especial.',
    image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/57/ps5.jpg',
    drawDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    drawHour: '10:00 PM',
    status: 'active',
    tickets: {
      total: 800,
      available: 720,
      sold: 80,
    },
    price: 2.5,
    currency: {
      symbol: '$',
      code: 'USD',
    },
    prizes: [
      {
        position: 1,
        name: 'PlayStation 5',
        description: 'Consola nueva sellada',
        icon: '🎮',
        value: 499,
      },
      {
        position: 2,
        name: '$100 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 100,
      },
    ],
    showProgress: true,
  },
  {
    id: '5',
    name: 'RIFA MATUTINA - SMART TV',
    description: 'Gana un Smart TV 55" 4K. Sorteo de la mañana.',
    image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/58/smart-tv.jpg',
    drawDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    drawHour: '11:00 AM',
    status: 'active',
    tickets: {
      total: 600,
      available: 480,
      sold: 120,
    },
    price: 2,
    currency: {
      symbol: '$',
      code: 'USD',
    },
    prizes: [
      {
        position: 1,
        name: 'Smart TV 55" 4K',
        description: 'Ultra HD, Smart TV',
        icon: '📺',
        value: 450,
      },
      {
        position: 2,
        name: '$50 USD',
        description: 'Efectivo en dólares americanos',
        icon: '💵',
        value: 50,
      },
    ],
    showProgress: true,
  },
];

// ==================== AUTH SERVICE MOCK ====================

export const authMock = {
  login: async (data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);
    
    const user = mockUsers.find(
      u => u.email === data.email && u.password === data.password
    );
    
    if (!user) {
      createError('Email o contraseña incorrectos', 401);
    }
    
    const { password, ...userWithoutPassword } = user;
    const token = `mock_jwt_${Date.now()}`;
    
    return {
      success: true,
      data: {
        user: userWithoutPassword as User,
        token,
      },
    };
  },
  
  register: async (data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);
    
    // Verificar si el email ya existe
    const existingUser = mockUsers.find(u => u.email === data.email);
    
    if (existingUser) {
      createError('El email ya está registrado', 409, {
        email: ['El email ya está registrado'],
      });
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name || data.email.split('@')[0],
      phone: data.phone,
      identification: data.identification,
      emailVerified: false,
      notifications: {
        email: true,
        whatsapp: true,
      },
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push({ ...newUser, password: data.password });
    
    const token = `mock_jwt_${Date.now()}`;
    
    // TODO: Aquí se enviarían los emails de bienvenida y ticket
    
    return {
      success: true,
      message: 'Registro exitoso. Se han enviado los correos de bienvenida y ticket.',
      data: {
        user: newUser,
        token,
      },
    };
  },
  
  updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (!userIndex) {
      createError('Usuario no encontrado', 404);
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    
    return {
      success: true,
      data: mockUsers[userIndex],
    };
  },
  
  updateNotifications: async (
    userId: string,
    notifications: User['notifications']
  ): Promise<ApiResponse<User>> => {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (!userIndex) {
      createError('Usuario no encontrado', 404);
    }
    
    mockUsers[userIndex].notifications = notifications;
    
    return {
      success: true,
      data: mockUsers[userIndex],
    };
  },
  
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    await delay(500);
    
    // Mock de verificación de email
    return {
      success: true,
      message: 'Email verificado exitosamente',
      data: undefined,
    };
  },
};

// ==================== TICKET SERVICE MOCK ====================

export const ticketMock = {
  getAll: async (): Promise<ApiResponse<string[]>> => {
    await delay(800);
    
    // Importar tickets disponibles del database.json
    const availableTickets = [
      "141", "143", "151", "154", "159", "161", "162", "166", "167", "168",
      "174", "175", "176", "178", "183", "184", "186", "190", "192", "195",
      "207", "210", "215", "216", "223", "224", "226", "232", "236", "243",
      // ... más tickets
    ];
    
    return {
      success: true,
      data: availableTickets,
    };
  },
  
  getAvailable: async (): Promise<ApiResponse<string[]>> => {
    await delay(500);
    
    // Simular tickets disponibles
    const available = Array.from({ length: 612 }, (_, i) => 
      String(i).padStart(3, '0')
    ).filter(n => !['000', '001', '002'].includes(n));
    
    return {
      success: true,
      data: available,
    };
  },
  
  search: async (number: string): Promise<ApiResponse<{ number: string; status: string }>> => {
    await delay(300);
    
    const status = Math.random() > 0.3 ? 'sold' : 'available';
    
    return {
      success: true,
      data: { number, status },
    };
  },
};

// ==================== PURCHASE SERVICE MOCK ====================

export const purchaseMock = {
  create: async (data: {
    tickets: string[];
    buyerEmail: string;
    paymentMethodId: string;
    voucher?: any;
  }): Promise<ApiResponse<Purchase>> => {
    await delay(2000);
    
    const paymentMethod = mockPaymentMethods.find(m => m.id === data.paymentMethodId);
    
    if (!paymentMethod) {
      createError('Método de pago inválido', 400);
    }
    
    const newPurchase: Purchase = {
      id: String(mockPurchases.length + 1),
      token: `purchase_${Date.now()}`,
      tickets: data.tickets,
      total: data.tickets.length * 1.5,
      status: data.voucher ? 'unverified' : 'pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    
    mockPurchases.push(newPurchase);
    
    return {
      success: true,
      message: 'Compra registrada exitosamente. Se ha enviado el ticket a tu email.',
      data: newPurchase,
    };
  },
  
  getByBuyer: async (email: string): Promise<ApiResponse<Purchase[]>> => {
    await delay(800);
    
    // Mock: devolver todas las compras
    return {
      success: true,
      data: mockPurchases,
    };
  },
  
  uploadVoucher: async (
    purchaseToken: string,
    voucher: { file: File; reference: string; date: string; bank: string }
  ): Promise<ApiResponse<Purchase>> => {
    await delay(1500);
    
    const purchase = mockPurchases.find(p => p.token === purchaseToken);
    
    if (!purchase) {
      createError('Compra no encontrada', 404);
    }
    
    purchase.status = 'unverified';
    
    return {
      success: true,
      message: 'Comprobante subido exitosamente. Tu compra está en verificación.',
      data: purchase,
    };
  },
};

// ==================== VERIFICATION SERVICE MOCK ====================

export const verificationMock = {
  searchByPhone: async (phone: string): Promise<ApiResponse<BuyerTickets>> => {
    await delay(800);
    
    // Mock: buscar comprador por teléfono
    const mockBuyer: BuyerTickets = {
      buyer: {
        name: 'Demo User',
        phone,
        email: 'demo@example.com',
      },
      purchases: mockPurchases.filter(p => p.tickets.length > 0),
    };
    
    if (phone === '04121234567') {
      return {
        success: true,
        data: mockBuyer,
      };
    }
    
    createError('No se encontraron boletos con este número', 404);
  },
  
  searchByTicket: async (ticketNumber: string): Promise<ApiResponse<BuyerTickets>> => {
    await delay(800);
    
    const purchase = mockPurchases.find(p => p.tickets.includes(ticketNumber));
    
    if (!purchase) {
      createError('Número de ticket no encontrado', 404);
    }
    
    const mockBuyer: BuyerTickets = {
      buyer: {
        name: 'Demo User',
        phone: '04121234567',
        email: 'demo@example.com',
      },
      purchases: [purchase],
    };
    
    return {
      success: true,
      data: mockBuyer,
    };
  },
};

// ==================== WINNERS SERVICE MOCK ====================

export const winnersMock = {
  getCurrent: async (): Promise<ApiResponse<RaffleWinners>> => {
    await delay(500);
    
    const current = mockWinners.find(w => w.isCurrent);
    
    return {
      success: true,
      data: current || { raffleName: 'Sin sorteo activo', raffleDate: '', isCurrent: true, winners: [] },
    };
  },
  
  getHistorical: async (
    page: number = 1,
    limit: number = 6,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<RaffleWinners>>> => {
    await delay(600);
    
    let historical = mockWinners.filter(w => !w.isCurrent);
    
    // Filtrar por búsqueda
    if (search) {
      historical = historical.filter(w =>
        w.raffleName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const totalItems = historical.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = historical.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: {
        data: paginatedItems,
        meta: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      },
    };
  },
  
  getByRaffle: async (raffleId: string): Promise<ApiResponse<RaffleWinners>> => {
    await delay(500);
    
    const raffle = mockWinners[parseInt(raffleId)];
    
    if (!raffle) {
      createError('Sorteo no encontrado', 404);
    }
    
    return {
      success: true,
      data: raffle,
    };
  },
};

// ==================== PAYMENT METHODS SERVICE MOCK ====================

export const paymentMethodsMock = {
  getAll: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    await delay(400);
    
    return {
      success: true,
      data: mockPaymentMethods,
    };
  },
  
  getById: async (id: string): Promise<ApiResponse<PaymentMethod>> => {
    await delay(300);
    
    const method = mockPaymentMethods.find(m => m.id === id);
    
    if (!method) {
      createError('Método de pago no encontrado', 404);
    }
    
    return {
      success: true,
      data: method,
    };
  },
};

// ==================== RAFFLE SERVICE MOCK ====================

export const raffleMock = {
  getAll: async (): Promise<ApiResponse<Raffle[]>> => {
    await delay(600);
    
    return {
      success: true,
      data: mockRaffles,
    };
  },
  
  getActive: async (): Promise<ApiResponse<Raffle[]>> => {
    await delay(500);
    
    const active = mockRaffles.filter(r => r.status === 'active');
    
    // Ordenar por fecha de sorteo (más próximas primero)
    active.sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime());
    
    return {
      success: true,
      data: active,
    };
  },
  
  getById: async (id: string): Promise<ApiResponse<RaffleDetail>> => {
    await delay(500);
    
    const raffle = mockRaffles.find(r => r.id === id);
    
    if (!raffle) {
      createError('Rifa no encontrada', 404);
    }
    
    // Generar tickets disponibles
    const availableTickets = Array.from({ length: raffle.tickets.available }, (_, i) => 
      String(i).padStart(3, '0')
    );
    
    const raffleDetail: RaffleDetail = {
      ...raffle,
      availableTickets,
    };
    
    return {
      success: true,
      data: raffleDetail,
    };
  },
};
