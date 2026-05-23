<script setup lang="ts">
import { ref } from 'vue';
import { BaseCard, PageContainer } from '@/shared/components/ui';
import AuthLoginForm from '../components/AuthLoginForm.vue';
import AuthRegisterForm from '../components/AuthRegisterForm.vue';

const isRegister = ref(false);
</script>

<template>
  <PageContainer maxWidth="md" class="py-12">
    <div class="flex items-center justify-center">
      <BaseCard class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="font-display text-2xl font-bold text-text-primary mb-2">
            {{ isRegister ? 'Crear Cuenta' : 'Iniciar Sesión' }}
          </h1>
          <p class="text-text-secondary">
            {{ isRegister ? 'Regístrate para participar' : 'Ingresa tus credenciales' }}
          </p>
        </div>

        <AuthLoginForm v-if="!isRegister" @toggle-mode="isRegister = true" />
        <AuthRegisterForm v-else @toggle-mode="isRegister = false" />
      </BaseCard>
    </div>
  </PageContainer>
</template>
