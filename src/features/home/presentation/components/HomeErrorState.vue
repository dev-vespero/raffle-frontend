<script setup lang="ts">
import { BaseCard, BaseButton } from '@/shared/components/ui';
import { AlertCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="text-center py-20">
    <BaseCard class="max-w-md mx-auto p-8">
      <AlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
      <h3 class="font-bold text-text-primary text-lg mb-2">
        Error al cargar rifas
      </h3>
      <p class="text-text-secondary mb-4">
        Inténtalo de nuevo más tarde
      </p>
      <BaseButton variant="primary" @click="emit('retry')">
        Recargar
      </BaseButton>
    </BaseCard>
  </div>
</template>
