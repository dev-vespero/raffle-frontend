import { ref, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { GetActiveRafflesUseCase } from '../../application/use-cases/get-active-raffles.use-case';
import { createRaffleRepository } from '../../infrastructure/raffle-repository.factory';
import type { GetActiveRafflesDto } from '../../application/dto/get-active-raffles.dto';

const repository = createRaffleRepository();
const useCase = new GetActiveRafflesUseCase(repository);

export function useActiveRafflesQuery(filter: Ref<GetActiveRafflesDto['filter']> = ref('all')) {
  return useQuery({
    queryKey: ['raffles', 'active', filter],
    queryFn: () => useCase.execute({ filter: filter.value }),
  });
}
