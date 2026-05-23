import { ref } from 'vue';
import { useUiStore } from '@/app/stores/uiStore';
import { useUpdateProfileMutation } from '../queries/account.queries';
import { UpdateProfileSchema, type UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { useAuthStore } from '@/app/stores/authStore';

export function useUpdateProfile() {
  const errors = ref<Record<string, string>>({});
  const uiStore = useUiStore();
  const authStore = useAuthStore();
  const userId = authStore.user?.id ?? '';

  const { mutateAsync, isPending } = useUpdateProfileMutation(userId);

  const submit = async (dto: UpdateProfileDto) => {
    errors.value = {};

    const parsed = UpdateProfileSchema.safeParse(dto);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        errors.value[field] = issue.message;
      }
      return false;
    }

    try {
      await mutateAsync(parsed.data);
      uiStore.showSuccess('Perfil actualizado', 'Tus datos han sido actualizados correctamente');
      return true;
    } catch {
      uiStore.showError('Error', 'No se pudo actualizar el perfil');
      return false;
    }
  };

  return { loading: isPending, errors, submit };
}
