import type { RaffleRepository } from '../../domain/ports/raffle-repository.port';
import { HttpRaffleRepository } from '../api/raffle.repository.http';
import { MockRaffleRepository } from '../mocks/raffle.repository.mock';
import { HOME_CONFIG } from '../config/home.config';

export function createRaffleRepository(): RaffleRepository {
  return HOME_CONFIG.USE_MOCKS
    ? new MockRaffleRepository()
    : new HttpRaffleRepository();
}
