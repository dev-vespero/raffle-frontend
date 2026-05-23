import { RaffleStatus } from '../constants/raffle-status.enum';

export interface RafflePrize {
  position: number;
  name: string;
  description: string;
  icon: string;
  value?: number;
}

export interface RaffleTickets {
  total: number;
  available: number;
  sold: number;
}

export interface RaffleCurrency {
  symbol: string;
  code: string;
}

export class Raffle {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly image: string,
    public readonly drawDate: string,
    public readonly drawHour: string,
    public readonly status: RaffleStatus,
    public readonly tickets: RaffleTickets,
    public readonly price: number,
    public readonly currency: RaffleCurrency,
    public readonly prizes: RafflePrize[],
    public readonly showProgress: boolean,
  ) {}

  isEndingSoon(hours: number = 48): boolean {
    const now = new Date();
    const draw = new Date(this.drawDate);
    const diffHours = (draw.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= hours;
  }

  getDaysUntilDraw(): number {
    const now = new Date();
    const draw = new Date(this.drawDate);
    const diff = draw.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getProgress(): number {
    const sold = this.tickets.total - this.tickets.available;
    return Math.round((sold / this.tickets.total) * 100);
  }

  static fromApi(data: Record<string, unknown>): Raffle {
    return new Raffle(
      data.id as string,
      data.name as string,
      data.description as string,
      data.image as string,
      data.drawDate as string,
      data.drawHour as string,
      data.status as RaffleStatus,
      data.tickets as RaffleTickets,
      data.price as number,
      data.currency as RaffleCurrency,
      data.prizes as RafflePrize[],
      data.showProgress as boolean,
    );
  }
}
