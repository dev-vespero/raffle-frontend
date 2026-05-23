import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { GetUserPurchasesUseCase } from '../application/use-cases/get-user-purchases.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { UpdateNotificationPreferencesUseCase } from '../application/use-cases/update-notification-preferences.use-case';
import { createPurchaseRepository } from '../infrastructure/purchase-repository.factory';
import { createProfileRepository } from '../infrastructure/profile-repository.factory';
import { createNotificationRepository } from '../infrastructure/notification-repository.factory';
import type { UpdateProfileDto } from '../application/dto/update-profile.dto';
import type { UpdateNotificationsDto } from '../application/dto/update-notifications.dto';

const purchaseRepo = createPurchaseRepository();
const profileRepo = createProfileRepository();
const notificationRepo = createNotificationRepository();

const getUserPurchasesUseCase = new GetUserPurchasesUseCase(purchaseRepo);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepo);
const updateNotificationPreferencesUseCase = new UpdateNotificationPreferencesUseCase(notificationRepo);

export function useUserPurchasesQuery(userId: string) {
  return useQuery({
    queryKey: ['account', 'purchases', userId],
    queryFn: () => getUserPurchasesUseCase.execute(userId),
  });
}

export function useUpdateProfileMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfileUseCase.execute(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}

export function useUpdateNotificationsMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateNotificationsDto) => updateNotificationPreferencesUseCase.execute(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}
