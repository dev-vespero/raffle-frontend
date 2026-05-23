import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { useLoginMutation } from '../queries/auth.queries';
import { LoginSchema, type LoginDto } from '../../application/dto/login.dto';

export function useLogin() {
  const errors = ref<Record<string, string>>({});

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  const { mutateAsync, isPending } = useLoginMutation();

  const submit = async (dto: LoginDto) => {
    errors.value = {};

    const parsed = LoginSchema.safeParse(dto);
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

      uiStore.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');

      const redirect = route.query.redirect as string;
      router.push(redirect || '/cuenta');

      return true;
    } catch {
      uiStore.showError('Error de login', 'Email o contraseña incorrectos');
      return false;
    }
  };

  return { loading: isPending, errors, submit };
}
