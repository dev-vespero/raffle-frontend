<script setup lang="ts">
import type { Raffle } from '@/core/types/api.types';
import BaseCard from './BaseCard.vue';
import BaseBadge from './BaseBadge.vue';
import { Calendar, Clock, Ticket, ArrowRight } from 'lucide-vue-next';

defineProps<{
  raffle: Raffle;
}>();

const calculateProgress = (raffle: Raffle): number => {
  const sold = raffle.tickets.total - raffle.tickets.available;
  return Math.round((sold / raffle.tickets.total) * 100);
};

const isEndingSoon = (drawDate: string): boolean => {
  const now = new Date();
  const draw = new Date(drawDate);
  const diffHours = (draw.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours <= 48; // Menos de 48 horas
};

const getDaysUntilDraw = (drawDate: string): number => {
  const now = new Date();
  const draw = new Date(drawDate);
  const diff = draw.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
</script>

<template>
  <BaseCard class="h-full flex flex-col" hoverable>
    <!-- Image -->
    <div class="relative mb-4">
      <img
        :src="raffle.image"
        :alt="raffle.name"
        class="w-full h-48 object-cover rounded-lg"
      />
      
      <!-- Ending soon badge -->
      <div
        v-if="isEndingSoon(raffle.drawDate)"
        class="absolute top-2 right-2"
      >
        <BaseBadge variant="danger" size="sm">
          <Clock class="w-3 h-3 mr-1" />
          ¡Pronto!
        </BaseBadge>
      </div>
      
      <!-- Progress badge -->
      <div
        v-if="raffle.showProgress"
        class="absolute bottom-2 right-2"
      >
        <BaseBadge variant="secondary" size="sm">
          {{ calculateProgress(raffle) }}% Vendido
        </BaseBadge>
      </div>
    </div>
    
    <!-- Content -->
    <div class="flex-1 space-y-3">
      <!-- Title -->
      <h3 class="font-display text-lg font-bold text-text-primary line-clamp-2">
        {{ raffle.name }}
      </h3>
      
      <!-- Description -->
      <p class="text-text-secondary text-sm line-clamp-2">
        {{ raffle.description }}
      </p>
      
      <!-- Draw date and time -->
      <div class="flex flex-wrap gap-3 text-sm">
        <div class="flex items-center gap-1.5 text-text-secondary">
          <Calendar class="w-4 h-4 text-primary" />
          <span>{{ new Date(raffle.drawDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) }}</span>
        </div>
        <div class="flex items-center gap-1.5 text-text-secondary">
          <Clock class="w-4 h-4 text-primary" />
          <span>{{ raffle.drawHour }}</span>
        </div>
      </div>
      
      <!-- Days until draw -->
      <BaseCard variant="secondary" class="text-center py-2">
        <p class="text-text-muted text-xs mb-0.5">Faltan</p>
        <p class="font-display text-xl font-bold text-primary">
          {{ getDaysUntilDraw(raffle.drawDate) }} {{ getDaysUntilDraw(raffle.drawDate) === 1 ? 'día' : 'días' }}
        </p>
      </BaseCard>
      
      <!-- Price -->
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-primary">
            {{ raffle.currency.symbol }}{{ raffle.price }}
          </span>
          <span class="text-text-muted text-sm">por boleto</span>
        </div>
        <div class="flex items-center gap-1 text-text-secondary text-sm">
          <Ticket class="w-4 h-4" />
          <span>{{ raffle.tickets.available }} disponibles</span>
        </div>
      </div>
    </div>
    
    <!-- Footer / CTA -->
    <RouterLink
      :to="`/rifas/${raffle.id}`"
      class="btn-primary mt-4 inline-flex items-center justify-center gap-2"
    >
      Ver Detalles
      <ArrowRight class="w-4 h-4" />
    </RouterLink>
  </BaseCard>
</template>
