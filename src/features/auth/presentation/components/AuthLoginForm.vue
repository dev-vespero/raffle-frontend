<script setup lang="ts">
import { ref } from 'vue';
import { BaseButton, BaseInput } from '@/shared/components/ui';
import { useLogin } from '../composables/use-login';
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next';

const emit = defineEmits<{
  toggleMode: [];
}>();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const { loading, errors, submit } = useLogin();

const handleSubmit = () => {
  submit({ email: email.value, password: password.value });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="email"
      label="Email"
      type="email"
      placeholder="tu@email.com"
      :icon="Mail"
      :error="errors.email"
      autocomplete="email"
      required
    />

    <BaseInput
      v-model="password"
      label="Contraseña"
      :type="showPassword ? 'text' : 'password'"
      placeholder="••••••••"
      :icon="Lock"
      :error="errors.password"
      autocomplete="current-password"
      required
    >
      <template #icon>
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="text-text-muted hover:text-text-primary"
        >
          <Eye v-if="!showPassword" class="w-5 h-5" />
          <EyeOff v-else class="w-5 h-5" />
        </button>
      </template>
    </BaseInput>

    <BaseButton
      type="submit"
      variant="primary"
      full-width
      :loading="loading"
    >
      Iniciar Sesión
    </BaseButton>
  </form>

  <div class="mt-6 text-center">
    <p class="text-text-secondary">
      ¿No tienes cuenta?
      <button
        type="button"
        class="text-primary hover:underline font-medium"
        @click="emit('toggleMode')"
      >
        Regístrate
      </button>
    </p>
  </div>
</template>
