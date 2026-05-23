<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/app/stores/authStore';
import { useUpdateProfile } from '../composables/use-update-profile';
import { BaseCard, BaseButton, BaseInput } from '@/shared/components/ui';
import { User, Lock } from 'lucide-vue-next';

const authStore = useAuthStore();
const { loading, errors, submit } = useUpdateProfile();

const name = ref(authStore.user?.name || '');
const phone = ref(authStore.user?.phone || '');

const showPasswordForm = ref(false);
const password = ref({ current: '', new: '', confirm: '' });

const handleUpdateProfile = async () => {
  await submit({ name: name.value, phone: phone.value });
};

const handleUpdatePassword = () => {
  if (password.value.new !== password.value.confirm) {
    errors.value.confirmPassword = 'Las nuevas contraseñas no coinciden';
    return;
  }
  if (password.value.new.length < 6) {
    errors.value.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }
  // TODO: Implementar cambio de contraseña con use-case
  showPasswordForm.value = false;
  password.value = { current: '', new: '', confirm: '' };
};
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-text-primary">
      Mi Perfil
    </h2>

    <BaseCard>
      <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <User class="w-5 h-5" />
        Datos Personales
      </h3>

      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <BaseInput
          v-model="name"
          label="Nombre completo"
          :icon="User"
          :error="errors.name"
          required
        />

        <BaseInput
          v-model="authStore.user?.email"
          label="Email"
          type="email"
          disabled
          hint="El email no se puede modificar"
        />

        <BaseInput
          v-model="phone"
          label="Teléfono"
          type="tel"
          :icon="Lock"
          :error="errors.phone"
          required
        />

        <BaseInput
          v-model="authStore.user?.identification"
          label="Cédula"
          disabled
          hint="La cédula no se puede modificar"
        />

        <BaseButton type="submit" variant="primary" :loading="loading">
          Actualizar Datos
        </BaseButton>
      </form>
    </BaseCard>

    <BaseCard>
      <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Lock class="w-5 h-5" />
        Seguridad
      </h3>

      <template v-if="!showPasswordForm">
        <p class="text-text-secondary mb-4">
          Cambia tu contraseña periódicamente para mantener tu cuenta segura
        </p>
        <BaseButton variant="outline" @click="showPasswordForm = true">
          Cambiar Contraseña
        </BaseButton>
      </template>

      <form v-else @submit.prevent="handleUpdatePassword" class="space-y-4">
        <BaseInput
          v-model="password.current"
          label="Contraseña actual"
          type="password"
          required
        />

        <BaseInput
          v-model="password.new"
          label="Nueva contraseña"
          type="password"
          :error="errors.newPassword"
          required
        />

        <BaseInput
          v-model="password.confirm"
          label="Confirmar nueva contraseña"
          type="password"
          :error="errors.confirmPassword"
          required
        />

        <div class="flex gap-2">
          <BaseButton type="submit" variant="primary">
            Actualizar Contraseña
          </BaseButton>
          <BaseButton type="button" variant="ghost" @click="showPasswordForm = false">
            Cancelar
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
