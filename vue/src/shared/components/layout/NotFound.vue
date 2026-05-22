<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Home, ArrowLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- 404 Number -->
      <h1 class="text-9xl font-display font-bold text-primary mb-4">
        404
      </h1>
      
      <!-- Icon -->
      <div class="flex justify-center gap-4 mb-8">
        <Home class="w-12 h-12 text-text-muted" />
        <ArrowLeft class="w-12 h-12 text-text-muted" />
      </div>
      
      <!-- Message -->
      <h2 class="text-2xl font-bold text-text-primary mb-4">
        Página no encontrada
      </h2>
      <p class="text-text-secondary mb-8">
        La página que buscas no existe o ha sido movida.
      </p>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/" class="btn-primary">
          <Home class="w-5 h-5" />
          Ir al Inicio
        </RouterLink>
        <button
          @click="$router.back()"
          class="btn-ghost"
        >
          <ArrowLeft class="w-5 h-5" />
          Volver Atrás
        </button>
      </div>
    </div>
  </div>
</template>
