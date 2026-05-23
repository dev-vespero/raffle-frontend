<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { homeService } from '../services/homeService';
import { RaffleCard, BaseLoader, BaseCard } from '@/shared/components/ui';
import { Ticket, Trophy, Clock, AlertCircle } from 'lucide-vue-next';

// Estado local para filtros
const selectedFilter = ref<'all' | 'ending-soon'>('all');

// Obtener rifas activas
const { data: raffles, isLoading, error } = useQuery({
  queryKey: ['raffles', 'active'],
  queryFn: () => homeService.getActiveRaffles(),
  select: (data) => data.data,
});

// Filtrar rifas
const filteredRaffles = computed(() => {
  const list = raffles.value || [];

  if (selectedFilter.value === 'ending-soon') {
    const now = new Date();
    return list.filter(raffle => {
      const drawDate = new Date(raffle.drawDate);
      const diffHours = (drawDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours <= 48;
    });
  }

  return list;
});

// Ordenar: las que finalizan pronto primero
const sortedRaffles = computed(() => {
  return [...filteredRaffles.value].sort((a, b) => 
    new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime()
  );
});

const totalAvailable = computed(() => {
  return (raffles.value || []).reduce((sum, r) => sum + r.tickets.available, 0);
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="gradient-hero py-12 md:py-16">
      <div class="container mx-auto px-4">
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
          
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <BaseCard class="text-center p-4">
              <p class="text-2xl font-bold text-primary">{{ raffles?.length || 0 }}</p>
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
      </div>
    </section>
    
    <!-- Filters Section -->
    <section class="py-6 bg-dark-surface">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <button
              v-for="filter in ['all', 'ending-soon']"
              :key="filter"
              @click="selectedFilter = filter as 'all' | 'ending-soon'"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedFilter === filter 
                ? 'bg-primary text-white' 
                : 'bg-dark-surface-elevated text-text-secondary hover:text-text-primary'"
            >
              {{ filter === 'all' ? 'Todas las Rifas' : 'Finalizan Pronto' }}
            </button>
          </div>
          
          <div class="flex items-center gap-2 text-text-secondary text-sm">
            <Clock class="w-4 h-4" />
            <span>{{ sortedRaffles.length }} {{ sortedRaffles.length === 1 ? 'rifa' : 'rifas' }} encontradas</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Raffles Catalog -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <BaseLoader size="lg" />
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="text-center py-20">
          <BaseCard class="max-w-md mx-auto p-8">
            <AlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
            <h3 class="font-bold text-text-primary text-lg mb-2">
              Error al cargar rifas
            </h3>
            <p class="text-text-secondary mb-4">
              Inténtalo de nuevo más tarde
            </p>
            <button
              @click="() => window.location.reload()"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Recargar
            </button>
          </BaseCard>
        </div>
        
        <!-- Empty state -->
        <div v-else-if="sortedRaffles.length === 0" class="text-center py-20">
          <BaseCard class="max-w-md mx-auto p-8">
            <Ticket class="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 class="font-bold text-text-primary text-lg mb-2">
              No hay rifas disponibles
            </h3>
            <p class="text-text-secondary">
              {{ selectedFilter === 'ending-soon' 
                ? 'No hay rifas que finalicen pronto' 
                : 'Próximamente tendremos nuevas rifas' }}
            </p>
          </BaseCard>
        </div>
        
        <!-- Raffles grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RaffleCard
            v-for="raffle in sortedRaffles"
            :key="raffle.id"
            :raffle="raffle"
          />
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-12 bg-gradient-to-r from-primary/20 to-secondary/10">
      <div class="container mx-auto px-4 text-center">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
          ¿Cómo Participar?
        </h2>
        <p class="text-text-secondary mb-8 max-w-2xl mx-auto">
          Es muy fácil seguir estos pasos para participar en nuestras rifas
        </p>
        
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <BaseCard class="text-center p-6">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 class="font-bold text-text-primary mb-2">Elige tu Rifa</h3>
            <p class="text-text-secondary text-sm">
              Selecciona la rifa que más te guste de nuestro catálogo
            </p>
          </BaseCard>
          
          <BaseCard class="text-center p-6">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 class="font-bold text-text-primary mb-2">Compra Boletos</h3>
            <p class="text-text-secondary text-sm">
              Elige tus números de la suerte y realiza tu pago
            </p>
          </BaseCard>
          
          <BaseCard class="text-center p-6">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 class="font-bold text-text-primary mb-2">¡Espera el Sorteo!</h3>
            <p class="text-text-secondary text-sm">
              Participa en el sorteo y podrías ser el gran ganador
            </p>
          </BaseCard>
        </div>
      </div>
    </section>
  </div>
</template>
