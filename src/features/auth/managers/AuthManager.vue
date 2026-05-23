<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { useThemeStore } from '@/app/stores/themeStore';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseAlert from '@/shared/components/ui/BaseAlert.vue';
import PageContainer from '@/shared/components/ui/page-container.vue';
import { Mail, Lock, User, Phone, IdCard, Eye, EyeOff } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const themeStore = useThemeStore();

const props = defineProps<{
  mode?: 'login' | 'register';
}>();

const isRegister = computed(() => props.mode === 'register' || route.name === 'Register');

// Form data
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phone = ref('');
const identification = ref('');
const showPassword = ref(false);

// Errors
const errors = ref<Record<string, string>>({});

// Validar formulario
const validateForm = (): boolean => {
  errors.value = {};
  
  // Email
  if (!email.value) {
    errors.value.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email inválido';
  }
  
  // Password
  if (!password.value) {
    errors.value.password = 'La contraseña es requerida';
  } else if (password.value.length < 6) {
    errors.value.password = 'Mínimo 6 caracteres';
  }
  
  if (isRegister.value) {
    // Confirm password
    if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Name
    if (!name.value) {
      errors.value.name = 'El nombre es requerido';
    }
    
    // Phone
    if (!phone.value) {
      errors.value.phone = 'El teléfono es requerido';
    } else if (!/^04[12346789]\d{7}$/.test(phone.value)) {
      errors.value.phone = 'Teléfono inválido (ej: 04121234567)';
    }
    
    // Identification
    if (!identification.value) {
      errors.value.identification = 'La cédula es requerida';
    } else if (!/^V-\d{8}$/i.test(identification.value)) {
      errors.value.identification = 'Cédula inválida (ej: V-12345678)';
    }
  }
  
  return Object.keys(errors.value).length === 0;
};

// Submit
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  if (isRegister.value) {
    const result = await authStore.register({
      email: email.value,
      password: password.value,
      name: name.value,
      phone: phone.value,
      identification: identification.value,
    });
    
    if (result.success) {
      uiStore.showSuccess(
        '¡Registro exitoso!',
        'Se han enviado los correos de bienvenida y tu ticket.'
      );
      
      // Redirigir
      const redirect = route.query.redirect as string;
      router.push(redirect || '/cuenta');
    } else {
      uiStore.showError('Error de registro', 'El email ya está registrado');
    }
  } else {
    const result = await authStore.login(email.value, password.value);
    
    if (result.success) {
      uiStore.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
      
      // Redirigir
      const redirect = route.query.redirect as string;
      router.push(redirect || '/cuenta');
    } else {
      uiStore.showError('Error de login', 'Email o contraseña incorrectos');
    }
  }
};

// Formatear cédula
const formatIdentification = (value: string) => {
  const clean = value.replace(/[^Vv0-9]/g, '');
  const formatted = clean.replace(/^V/i, 'V-');
  identification.value = formatted.substring(0, 10);
};

// Formatear teléfono
const formatPhone = (value: string) => {
  const clean = value.replace(/\D/g, '');
  phone.value = clean.substring(0, 11);
};
</script>

<template>
  <PageContainer maxWidth="md" class="py-12">
    <div class="flex items-center justify-center">
      <BaseCard class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="font-display text-2xl font-bold text-text-primary mb-2">
          {{ isRegister ? 'Crear Cuenta' : 'Iniciar Sesión' }}
        </h1>
        <p class="text-text-secondary">
          {{ isRegister ? 'Regístrate para participar' : 'Ingresa tus credenciales' }}
        </p>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Register fields -->
        <template v-if="isRegister">
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
        </template>
        
        <!-- Email -->
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
        
        <!-- Password -->
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
        
        <!-- Confirm Password (register only) -->
        <BaseInput
          v-if="isRegister"
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          :icon="Lock"
          :error="errors.confirmPassword"
          autocomplete="new-password"
          required
        />
        
        <!-- Submit button -->
        <BaseButton
          type="submit"
          variant="primary"
          full-width
          :loading="authStore.isLoading"
        >
          {{ isRegister ? 'Registrarse' : 'Iniciar Sesión' }}
        </BaseButton>
      </form>
      
      <!-- Toggle login/register -->
      <div class="mt-6 text-center">
        <p class="text-text-secondary">
          {{ isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
          <RouterLink
            :to="isRegister ? '/login' : '/registro'"
            class="text-primary hover:underline font-medium"
          >
            {{ isRegister ? 'Inicia sesión' : 'Regístrate' }}
          </RouterLink>
        </p>
      </div>
      
      <!-- Info alert -->
      <BaseAlert
        v-if="isRegister"
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
      </BaseCard>
    </div>
  </PageContainer>
</template>
