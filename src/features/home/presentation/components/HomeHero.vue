<script setup lang="ts">
import type { Raffle } from '../../domain/entities/raffle.entity';
import { BaseCard } from '@/shared/components/ui';
import { Ticket, Trophy } from 'lucide-vue-next';

defineProps<{
  raffles: Raffle[];
  totalAvailable: number;
}>();
</script>

<template>
  <section class="gradient-hero py-12 md:py-16">
    <div class="text-center max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
        <Ticket class="w-5 h-5 text-primary" />
        <span class="text-text-primary font-medium">Rifas Diarias por Hora</span>
      </div>

      <h1 class="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
        Participa y Gana Premios Increíbles
      </h1>

      <p class="text-text-secondary text-lg mb-6">
        Múltiples sorteos al día. Elige tu rifa favorita y compra tus boletos.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <BaseCard class="text-center p-4">
          <p class="text-2xl font-bold text-primary">{{ raffles.length }}</p>
          <p class="text-text-muted text-sm">Rifas Activas</p>
        </BaseCard>
        <BaseCard class="text-center p-4">
          <p class="text-2xl font-bold text-primary">{{ totalAvailable }}</p>
          <p class="text-text-muted text-sm">Boletos Disponibles</p>
        </BaseCard>
        <BaseCard class="text-center p-4">
          <p class="text-2xl font-bold text-primary">24/7</p>
          <p class="text-text-muted text-sm">Sorteos</p>
        </BaseCard>
        <BaseCard class="text-center p-4">
          <div class="flex items-center justify-center gap-1">
            <Trophy class="w-5 h-5 text-secondary" />
            <p class="text-2xl font-bold text-primary">100%</p>
          </div>
          <p class="text-text-muted text-sm">Seguros</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>
