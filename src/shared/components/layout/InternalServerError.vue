<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Home, AlertTriangle, RefreshCw } from 'lucide-vue-next';

const handleReload = () => {
  window.location.reload();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 bg-dark-bg">
    <div class="text-center max-w-md">
      <!-- Error Icon -->
      <div class="flex justify-center mb-8">
        <div class="w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertTriangle class="w-12 h-12 text-danger" />
        </div>
      </div>

      <!-- Error Code -->
      <h1 class="text-6xl font-display font-bold text-danger mb-4">
        500
      </h1>

      <!-- Message -->
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        Error Interno del Servidor
      </h2>
      <p class="text-text-secondary mb-8">
        Algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/" class="btn-primary">
          <Home class="w-5 h-5" />
          Ir al Inicio
        </RouterLink>
        <button
          @click="handleReload"
          class="btn-ghost"
        >
          <RefreshCw class="w-5 h-5" />
          Reintentar
        </button>
      </div>
    </div>
  </div>
</template>
