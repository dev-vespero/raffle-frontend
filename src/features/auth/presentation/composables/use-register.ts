import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { useRegisterMutation } from '../queries/auth.queries';
import { RegisterSchema, type RegisterDto } from '../../application/dto/register.dto';

export function useRegister() {
  const errors = ref<Record<string, string>>({});

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  const { mutateAsync, isPending } = useRegisterMutation();

  const submit = async (dto: RegisterDto) => {
    errors.value = {};

    const parsed = RegisterSchema.safeParse(dto);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        errors.value[field] = issue.message;
      }
      return false;
    }

    try {
      const result = await mutateAsync(parsed.data);
      authStore.persistAuth(result.user, result.token);

      uiStore.showSuccess(
        '¡Registro exitoso!',
        'Se han enviado los correos de bienvenida y tu ticket.',
      );

      const redirect = route.query.redirect as string;
      router.push(redirect || '/cuenta');

      return true;
    } catch {
      uiStore.showError('Error de registro', 'El email ya está registrado');
      return false;
    }
  };

  return { loading: isPending, errors, submit };
}
