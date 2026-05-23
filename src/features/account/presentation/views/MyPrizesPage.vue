<script setup lang="ts">
import { Trophy } from 'lucide-vue-next';
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-text-primary mb-6">
      Mis Premios
    </h2>

    <div class="text-center py-12">
      <Trophy class="w-16 h-16 text-text-muted mx-auto mb-4" />
      <p class="text-text-secondary mb-4">
        ¡Aún no has ganado ningún premio!
      </p>
      <p class="text-text-muted text-sm">
        Sigue participando para ganar increíbles premios
      </p>
    </div>
  </div>
</template>
