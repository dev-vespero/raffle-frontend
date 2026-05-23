import { ref, computed } from 'vue';
import { useActiveRafflesQuery } from '../queries/raffle.queries';
import type { GetActiveRafflesDto } from '../../application/dto/get-active-raffles.dto';

export function useFetchActiveRaffles() {
  const filter = ref<GetActiveRafflesDto['filter']>('all');

  const { data, isLoading, error } = useActiveRafflesQuery(filter);

  const totalAvailable = computed(() => {
    return (data.value || []).reduce(
      (sum, raffle) => sum + raffle.tickets.available,
      0,
    );
  });

  return {
    raffles: data,
    isLoading,
    error,
    filter,
    totalAvailable,
  };
}
