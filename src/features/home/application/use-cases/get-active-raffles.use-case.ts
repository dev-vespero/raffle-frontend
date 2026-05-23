import type { Raffle } from '../../domain/entities/raffle.entity';
import type { RaffleRepository } from '../../domain/ports/raffle-repository.port';
import type { GetActiveRafflesDto } from '../dto/get-active-raffles.dto';

export class GetActiveRafflesUseCase {
  constructor(private readonly repo: RaffleRepository) {}

  async execute(dto: GetActiveRafflesDto): Promise<Raffle[]> {
    const raffles = await this.repo.getActive();

    const sorted = [...raffles].sort(
      (a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime(),
    );

    if (dto.filter === 'ending-soon') {
      return sorted.filter((raffle) => raffle.isEndingSoon(48));
    }

    return sorted;
  }
}
