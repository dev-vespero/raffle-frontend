import { Raffle } from '../../domain/entities/raffle.entity';
import type { RaffleRepository } from '../../domain/ports/raffle-repository.port';
import { RaffleStatus } from '../../domain/constants/raffle-status.enum';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const nextMonth = new Date();
nextMonth.setDate(nextMonth.getMonth() + 1);

const mockRaffles: Record<string, unknown>[] = [
  {
    id: 'raffle-001',
    name: 'iPhone 15 Pro Max',
    description: 'Participa y gana un iPhone 15 Pro Max de 256GB. ¡Sorteo diario!',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    drawDate: tomorrow.toISOString().split('T')[0],
    drawHour: '20:00',
    status: RaffleStatus.ACTIVE,
    tickets: { total: 100, available: 45, sold: 55 },
    price: 5.0,
    currency: { symbol: '$', code: 'USD' },
    prizes: [
      { position: 1, name: 'iPhone 15 Pro Max', description: '256GB', icon: 'smartphone', value: 1200 },
    ],
    showProgress: true,
  },
  {
    id: 'raffle-002',
    name: 'PlayStation 5',
    description: 'Gana una PlayStation 5 Digital Edition. ¡No te quedes sin la tuya!',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    drawDate: nextWeek.toISOString().split('T')[0],
    drawHour: '18:00',
    status: RaffleStatus.ACTIVE,
    tickets: { total: 200, available: 120, sold: 80 },
    price: 3.0,
    currency: { symbol: '$', code: 'USD' },
    prizes: [
      { position: 1, name: 'PlayStation 5', description: 'Digital Edition', icon: 'gamepad-2', value: 450 },
    ],
    showProgress: true,
  },
  {
    id: 'raffle-003',
    name: 'AirPods Pro',
    description: 'Sorteo express de AirPods Pro 2da generación. ¡Finaliza pronto!',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
    drawDate: tomorrow.toISOString().split('T')[0],
    drawHour: '14:00',
    status: RaffleStatus.ACTIVE,
    tickets: { total: 50, available: 10, sold: 40 },
    price: 2.0,
    currency: { symbol: '$', code: 'USD' },
    prizes: [
      { position: 1, name: 'AirPods Pro', description: '2da Generación', icon: 'headphones', value: 250 },
    ],
    showProgress: true,
  },
  {
    id: 'raffle-004',
    name: 'Smart TV 55"',
    description: 'Gana un Smart TV Samsung de 55 pulgadas 4K UHD.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    drawDate: nextMonth.toISOString().split('T')[0],
    drawHour: '21:00',
    status: RaffleStatus.ACTIVE,
    tickets: { total: 300, available: 200, sold: 100 },
    price: 2.5,
    currency: { symbol: '$', code: 'USD' },
    prizes: [
      { position: 1, name: 'Smart TV 55"', description: 'Samsung 4K UHD', icon: 'tv', value: 600 },
    ],
    showProgress: true,
  },
];

export class MockRaffleRepository implements RaffleRepository {
  async getActive(): Promise<Raffle[]> {
    return mockRaffles.map((item) => Raffle.fromApi(item));
  }
}
