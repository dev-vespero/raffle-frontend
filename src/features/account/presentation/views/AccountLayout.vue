<script setup lang="ts">
import { RouterView } from 'vue-router';
import { PageContainer } from '@/shared/components/ui';
import AccountSidebar from '../components/AccountSidebar.vue';
</script>

<template>
  <PageContainer>
    <div class="mb-8">
      <h1 class="font-display text-3xl font-bold text-text-primary mb-2">
        Mi Cuenta
      </h1>
      <p class="text-text-secondary">
        Gestiona tu perfil, compras y preferencias
      </p>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">
      <div class="lg:col-span-1">
        <AccountSidebar />
      </div>

      <div class="lg:col-span-3">
        <RouterView />
      </div>
    </div>
  </PageContainer>
</template>
