import type { Raffle } from '../entities/raffle.entity';

export interface RaffleRepository {
  getActive(): Promise<Raffle[]>;
}
