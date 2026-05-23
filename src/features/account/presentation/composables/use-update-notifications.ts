import { ref } from 'vue';
import { useUiStore } from '@/app/stores/uiStore';
import { useUpdateNotificationsMutation } from '../queries/account.queries';
import { UpdateNotificationsSchema, type UpdateNotificationsDto } from '../../application/dto/update-notifications.dto';
import { useAuthStore } from '@/app/stores/authStore';

export function useUpdateNotifications() {
  const errors = ref<Record<string, string>>({});
  const uiStore = useUiStore();
  const authStore = useAuthStore();
  const userId = authStore.user?.id ?? '';

  const { mutateAsync, isPending } = useUpdateNotificationsMutation(userId);

  const submit = async (dto: UpdateNotificationsDto) => {
    errors.value = {};

    const parsed = UpdateNotificationsSchema.safeParse(dto);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        errors.value[field] = issue.message;
      }
      return false;
    }

    try {
      await mutateAsync(parsed.data);
      uiStore.showSuccess('Configuración guardada', 'Tus preferencias han sido actualizadas');
      return true;
    } catch {
      uiStore.showError('Error', 'No se pudo guardar la configuración');
      return false;
    }
  };

  return { loading: isPending, errors, submit };
}
