<script setup lang="ts">
import type { GetActiveRafflesDto } from '../../application/dto/get-active-raffles.dto';
import { BaseCard } from '@/shared/components/ui';
import { Ticket } from 'lucide-vue-next';

defineProps<{
  filter: GetActiveRafflesDto['filter'];
}>();
</script>

<template>
  <div class="text-center py-20">
    <BaseCard class="max-w-md mx-auto p-8">
      <Ticket class="w-12 h-12 text-text-muted mx-auto mb-4" />
      <h3 class="font-bold text-text-primary text-lg mb-2">
        No hay rifas disponibles
      </h3>
      <p class="text-text-secondary">
        {{ filter === 'ending-soon'
          ? 'No hay rifas que finalicen pronto'
          : 'Próximamente tendremos nuevas rifas' }}
      </p>
    </BaseCard>
  </div>
</template>
