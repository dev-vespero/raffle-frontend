import { useUserPurchasesQuery } from '../queries/account.queries';
import { useAuthStore } from '@/app/stores/authStore';

export function useFetchPurchases() {
  const authStore = useAuthStore();
  const userId = authStore.user?.id ?? '';

  const { data, isLoading, error } = useUserPurchasesQuery(userId);

  return { purchases: data, isLoading, error };
}
