// Mock de configuración de la rifa - esto vendría del backend
// Incluye datos del sorteo, premios, configuración de venta, etc.

export interface RaffleConfig {
  token: string;
  name: string;
  description: string;
  image: string;
  drawDate: string;
  drawDateShort: string;
  drawHour: string;
  priceUnit: number;
  currency: {
    name: string;
    code: string;
    decimals: number;
    symbol: string;
  };
  tickets: {
    total: number;
    available: number;
    digits: number;
    minBuy: number;
    maxBuy: number;
    startNumber: number;
    endNumber: number;
  };
  discounts: {
    enabled: boolean;
    rate: number;           // % descuento por ticket adicional
    rateIncrease: number;   // % incremento progresivo
    maxTickets: number;     // Máximo tickets para descuento
  };
  promotions: {
    freeTicketPromo: number;  // X tickets = 1 gratis (ej: 6 = compra 5, lleva 6)
  };
  colors: {
    dark: string;
    primary: string;
    bgHeader: string;
    secondary: string;
    textHover: string;
    textHeader: string;
    textNormal: string;
  };
  status: 'active' | 'paused' | 'finished';
  showProgress: boolean;
  showUsedTickets: boolean;
}

export const raffleConfig: RaffleConfig = {
  token: 'vyUrgVCW',
  name: 'GANATE UNA SBR 6G 2025 0KM',
  description: `PARTICIPA Y GANATE UNA SBR 6G 2025 0KM POR TAN SOLO $1.50 CADA TICKET Y LO MEJOR DE TODO A TASA BCV.

PREMIOS:
🥇 1ER LUGAR: SBR 6G 0KM 2025 🏍️
🥈 2DO LUGAR: $50 💵
🥉 3ER LUGAR: 2 CAMBIOS DE ACEITE PARA MOTO 150 CC

** CON COMPRAS MAYOR A $60 EN NUESTRAS TIENDAS YA ESTAS PARTICIPANDO.
** LA RIFA SERA REALIZADA AL TOTALIZAR LA VENTA DE LOS TICKETS`,
  image: 'https://rifarito.s3.amazonaws.com/uploads/raffle/image/3046/bnrrpost-ig.jpg',
  drawDate: '2025-02-24T20:00:00.000-05:00',
  drawDateShort: '24 FEB 2025',
  drawHour: '08:00 PM',
  priceUnit: 1.5,
  currency: {
    name: 'Dólares Americanos',
    code: 'USD',
    decimals: 2,
    symbol: '$',
  },
  tickets: {
    total: 1000,
    available: 612,  // 1000 - 388 (los del database.json)
    digits: 3,
    minBuy: 1,
    maxBuy: 50,
    startNumber: 0,
    endNumber: 999,
  },
  discounts: {
    enabled: true,
    rate: 0.5,        // 0.5% de descuento por ticket adicional
    rateIncrease: 0.2, // 0.2% incremento progresivo
    maxTickets: 20,
  },
  promotions: {
    freeTicketPromo: 0,  // Desactivado por ahora
  },
  colors: {
    dark: '#73141C',
    primary: '#C5010E',
    bgHeader: '#610B10',
    secondary: '#F8CC13',
    textHover: '#FFFFFF',
    textHeader: '#FAF6F6',
    textNormal: '#FFFFFF',
  },
  status: 'active',
  showProgress: true,
  showUsedTickets: true,
};

// Función para calcular porcentaje de progreso
export const calculateProgress = (config: RaffleConfig | { tickets: { total: number; available: number } }): number => {
  const sold = config.tickets.total - config.tickets.available;
  return Math.round((sold / config.tickets.total) * 100);
};

// Función para verificar si la rifa está activa
export const isRaffleActive = (config: RaffleConfig): boolean => {
  return config.status === 'active' && config.tickets.available > 0;
};
