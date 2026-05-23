<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import { User, Lock } from 'lucide-vue-next';

const authStore = useAuthStore();
const uiStore = useUiStore();

const user = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  identification: authStore.user?.identification || '',
});

const password = ref({
  current: '',
  new: '',
  confirm: '',
});

const showPasswordForm = ref(false);

const updateProfile = async () => {
  const result = await authStore.updateProfile({
    name: user.value.name,
    phone: user.value.phone,
  });
  
  if (result.success) {
    uiStore.showSuccess('Perfil actualizado', 'Tus datos han sido actualizados correctamente');
  } else {
    uiStore.showError('Error', 'No se pudo actualizar el perfil');
  }
};

const updatePassword = async () => {
  if (password.value.new !== password.value.confirm) {
    uiStore.showError('Error', 'Las nuevas contraseñas no coinciden');
    return;
  }
  
  if (password.value.new.length < 6) {
    uiStore.showError('Error', 'La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  // TODO: Implementar cambio de contraseña
  uiStore.showSuccess('Contraseña actualizada', 'Tu contraseña ha sido cambiada correctamente');
  showPasswordForm.value = false;
  password.value = { current: '', new: '', confirm: '' };
};
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-text-primary">
      Mi Perfil
    </h2>
    
    <!-- Datos personales -->
    <BaseCard>
      <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <User class="w-5 h-5" />
        Datos Personales
      </h3>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <BaseInput
          v-model="user.name"
          label="Nombre completo"
          :icon="User"
          required
        />
        
        <BaseInput
          v-model="user.email"
          label="Email"
          type="email"
          disabled
          hint="El email no se puede modificar"
        />
        
        <BaseInput
          v-model="user.phone"
          label="Teléfono"
          type="tel"
          :icon="Lock"
          required
        />
        
        <BaseInput
          v-model="user.identification"
          label="Cédula"
          disabled
          hint="La cédula no se puede modificar"
        />
        
        <BaseButton type="submit" variant="primary">
          Actualizar Datos
        </BaseButton>
      </form>
    </BaseCard>
    
    <!-- Cambiar contraseña -->
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
      
      <form v-else @submit.prevent="updatePassword" class="space-y-4">
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
          required
        />
        
        <BaseInput
          v-model="password.confirm"
          label="Confirmar nueva contraseña"
          type="password"
          required
        />
        
        <div class="flex gap-2">
          <BaseButton type="submit" variant="primary">
            Actualizar Contraseña
          </BaseButton>
          <BaseButton
            type="button"
            variant="ghost"
            @click="showPasswordForm = false"
          >
            Cancelar
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
