<script setup lang="ts">
import { ref } from 'vue';
import { BaseButton, BaseInput, BaseAlert } from '@/shared/components/ui';
import { useRegister } from '../composables/use-register';
import { Mail, Lock, User, Phone, IdCard, Eye, EyeOff } from 'lucide-vue-next';

const emit = defineEmits<{
  toggleMode: [];
}>();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phone = ref('');
const identification = ref('');
const showPassword = ref(false);

const { loading, errors, submit } = useRegister();

const formatIdentification = (value: string) => {
  const clean = value.replace(/[^Vv0-9]/g, '');
  const formatted = clean.replace(/^V/i, 'V-');
  identification.value = formatted.substring(0, 10);
};

const formatPhone = (value: string) => {
  const clean = value.replace(/\D/g, '');
  phone.value = clean.substring(0, 11);
};

const handleSubmit = () => {
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden';
    return;
  }

  submit({
    email: email.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    identification: identification.value,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="name"
      label="Nombre completo"
      placeholder="Tu nombre"
      :icon="User"
      :error="errors.name"
      required
    />

    <BaseInput
      v-model="identification"
      label="Cédula"
      placeholder="V-12345678"
      :icon="IdCard"
      :error="errors.identification"
      hint="Formato: V-12345678"
      required
      @input="formatIdentification"
    />

    <BaseInput
      v-model="phone"
      label="Teléfono"
      placeholder="04121234567"
      :icon="Phone"
      type="tel"
      :error="errors.phone"
      hint="Formato: 04121234567"
      required
      @input="formatPhone"
    />

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
      autocomplete="new-password"
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

    <BaseInput
      v-model="confirmPassword"
      label="Confirmar contraseña"
      type="password"
      placeholder="••••••••"
      :icon="Lock"
      :error="errors.confirmPassword"
      autocomplete="new-password"
      required
    />

    <BaseButton
      type="submit"
      variant="primary"
      full-width
      :loading="loading"
    >
      Registrarse
    </BaseButton>
  </form>

  <div class="mt-6 text-center">
    <p class="text-text-secondary">
      ¿Ya tienes cuenta?
      <button
        type="button"
        class="text-primary hover:underline font-medium"
        @click="emit('toggleMode')"
      >
        Inicia sesión
      </button>
    </p>
  </div>

  <BaseAlert
    variant="info"
    class="mt-6"
    :dismissible="false"
  >
    Al registrarte aceptas nuestros
    <RouterLink to="/legal/terms" class="underline hover:text-primary">
      Términos y Condiciones
    </RouterLink>
    y
    <RouterLink to="/legal/privacy" class="underline hover:text-primary">
      Política de Privacidad
    </RouterLink>
    .
  </BaseAlert>
</template>
