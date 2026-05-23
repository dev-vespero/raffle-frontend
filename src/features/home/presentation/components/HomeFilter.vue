<script setup lang="ts">
import type { GetActiveRafflesDto } from '../../application/dto/get-active-raffles.dto';
import { Clock } from 'lucide-vue-next';

const filter = defineModel<GetActiveRafflesDto['filter']>({ required: true });

defineProps<{
  totalRaffles: number;
}>();

const filters: { value: GetActiveRafflesDto['filter']; label: string }[] = [
  { value: 'all', label: 'Todas las Rifas' },
  { value: 'ending-soon', label: 'Finalizan Pronto' },
];
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div class="flex items-center gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="filter = f.value"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="filter === f.value
          ? 'bg-primary text-white'
          : 'bg-dark-surface-elevated text-text-secondary hover:text-text-primary'"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="flex items-center gap-2 text-text-secondary text-sm">
      <Clock class="w-4 h-4" />
      <span>{{ totalRaffles }} {{ totalRaffles === 1 ? 'rifa' : 'rifas' }} encontradas</span>
    </div>
  </div>
</template>
