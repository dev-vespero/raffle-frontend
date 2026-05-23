import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginSchema, type LoginDto } from '../../application/dto/login.dto';
import { createAuthRepository } from '../../infrastructure/auth-repository.factory';

export function useLogin() {
  const loading = ref(false);
  const errors = ref<Record<string, string>>({});

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  const loginUseCase = new LoginUseCase(createAuthRepository());

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

    loading.value = true;

    try {
      const result = await loginUseCase.execute(parsed.data);
      authStore.persistAuth(result.user, result.token);

      uiStore.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');

      const redirect = route.query.redirect as string;
      router.push(redirect || '/cuenta');

      return true;
    } catch {
      uiStore.showError('Error de login', 'Email o contraseña incorrectos');
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { loading, errors, submit };
}
