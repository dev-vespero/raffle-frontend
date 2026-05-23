import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { RegisterSchema, type RegisterDto } from '../../application/dto/register.dto';
import { createAuthRepository } from '../../infrastructure/auth-repository.factory';

export function useRegister() {
  const loading = ref(false);
  const errors = ref<Record<string, string>>({});

  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const uiStore = useUiStore();

  const registerUseCase = new RegisterUseCase(createAuthRepository());

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

    loading.value = true;

    try {
      const result = await registerUseCase.execute(parsed.data);
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
    } finally {
      loading.value = false;
    }
  };

  return { loading, errors, submit };
}
