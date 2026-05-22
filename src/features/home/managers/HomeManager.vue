<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { raffleConfig, calculateProgress } from '@/config/raffle.config';
import { winnersService } from '@/features/winners/services/winnersService';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { Calendar, Clock, Trophy, ArrowRight, Ticket } from 'lucide-vue-next';

// Calcular fecha del sorteo
const drawDate = new Date(raffleConfig.drawDate);
const daysUntilDraw = computed(() => {
  const diff = drawDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Progreso de venta
const progress = computed(() => calculateProgress(raffleConfig));

// Obtener ganadores del sorteo actual
const { data: winnersData } = useQuery({
  queryKey: ['winners', 'current'],
  queryFn: () => winnersService.getCurrent(),
  select: (data) => data.data,
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="gradient-hero py-12 md:py-20">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Image -->
          <div class="relative">
            <BaseCard class="overflow-hidden p-0">
              <img
                :src="raffleConfig.image"
                :alt="raffleConfig.name"
                class="w-full h-auto object-cover"
              />
            </BaseCard>
            <!-- Progress badge -->
            <div
              v-if="raffleConfig.showProgress"
              class="absolute top-4 right-4"
            >
              <BaseBadge variant="secondary" size="lg">
                <Trophy class="w-4 h-4" />
                {{ progress }}% Vendido
              </BaseBadge>
            </div>
          </div>
          
          <!-- Info -->
          <div class="space-y-6">
            <div>
              <h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                {{ raffleConfig.name }}
              </h1>
              <p class="text-text-secondary whitespace-pre-line">
                {{ raffleConfig.description }}
              </p>
            </div>
            
            <!-- Date and time -->
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 text-text-secondary">
                <Calendar class="w-5 h-5 text-primary" />
                <span>{{ raffleConfig.drawDateShort }}</span>
              </div>
              <div class="flex items-center gap-2 text-text-secondary">
                <Clock class="w-5 h-5 text-primary" />
                <span>{{ raffleConfig.drawHour }}</span>
              </div>
            </div>
            
            <!-- Countdown -->
            <BaseCard class="text-center">
              <p class="text-text-muted text-sm mb-2">Faltan</p>
              <p class="font-display text-4xl font-bold text-primary">
                {{ daysUntilDraw }} {{ daysUntilDraw === 1 ? 'día' : 'días' }}
              </p>
            </BaseCard>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <RouterLink to="/boletos" class="btn-primary text-center">
                <Ticket class="w-5 h-5" />
                Comprar Boletos
              </RouterLink>
              <RouterLink to="/verificar" class="btn-ghost text-center">
                Verificar Boletos
              </RouterLink>
            </div>
            
            <!-- Price info -->
            <div class="flex items-center gap-2 text-text-secondary">
              <span class="text-2xl font-bold text-primary">
                {{ raffleConfig.currency.symbol }}{{ raffleConfig.priceUnit }}
              </span>
              <span>por boleto</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Progress Section -->
    <section v-if="raffleConfig.showProgress" class="py-8 bg-dark-surface">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="flex justify-between mb-2">
            <span class="text-text-secondary font-medium">Progreso de venta</span>
            <span class="text-primary font-bold">{{ progress }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-bar-fill"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p class="text-center text-text-muted text-sm mt-2">
            {{ raffleConfig.tickets.available }} de {{ raffleConfig.tickets.total }} boletos disponibles
          </p>
        </div>
      </div>
    </section>
    
    <!-- Awards Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Premios
          </h2>
          <p class="text-text-secondary">
            Estos son los increíbles premios que puedes ganar
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <!-- 1er premio -->
          <BaseCard class="text-center border-primary/30" hoverable>
            <BaseBadge variant="secondary" size="lg" class="mb-4">
              🥇 1ER LUGAR
            </BaseBadge>
            <div class="text-6xl mb-4">🏍️</div>
            <h3 class="font-bold text-text-primary mb-2">
              SBR 6G 0KM 2025
            </h3>
            <p class="text-text-muted text-sm">
              Moto nueva 0km, lista para estrenar
            </p>
          </BaseCard>
          
          <!-- 2do premio -->
          <BaseCard class="text-center" hoverable>
            <BaseBadge variant="primary" size="lg" class="mb-4">
              🥈 2DO LUGAR
            </BaseBadge>
            <div class="text-6xl mb-4">💵</div>
            <h3 class="font-bold text-text-primary mb-2">
              $50 USD
            </h3>
            <p class="text-text-muted text-sm">
              Efectivo en dólares americanos
            </p>
          </BaseCard>
          
          <!-- 3er premio -->
          <BaseCard class="text-center" hoverable>
            <BaseBadge variant="success" size="lg" class="mb-4">
              🥉 3ER LUGAR
            </BaseBadge>
            <div class="text-6xl mb-4">🛢️</div>
            <h3 class="font-bold text-text-primary mb-2">
              2 Cambios de Aceite
            </h3>
            <p class="text-text-muted text-sm">
              Para moto 150 CC
            </p>
          </BaseCard>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-12 bg-gradient-to-r from-primary/20 to-secondary/10">
      <div class="container mx-auto px-4 text-center">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
          ¿Listo para participar?
        </h2>
        <p class="text-text-secondary mb-8 max-w-2xl mx-auto">
          No pierdas la oportunidad de ganar esta increíble moto. ¡Entre más boletos tengas, más posibilidades de ganar!
        </p>
        <RouterLink to="/boletos" class="btn-primary inline-flex items-center gap-2">
          Comprar Boletos Ahora
          <ArrowRight class="w-5 h-5" />
        </RouterLink>
      </div>
    </section>
    
    <!-- Winners Section (si hay ganadores) -->
    <section v-if="winnersData?.winners && winnersData.winners.length > 0" class="py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Ganadores del Sorteo
          </h2>
          <p class="text-text-secondary">
            Conoce a los afortunados ganadores
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <BaseCard
            v-for="winner in winnersData.winners"
            :key="winner.id"
            class="text-center"
          >
            <div class="text-4xl mb-3">🏆</div>
            <h3 class="font-bold text-text-primary mb-1">
              {{ winner.name }}
            </h3>
            <p class="text-primary font-mono mb-2">
              #{{ winner.ticket }}
            </p>
            <BaseBadge variant="success">
              {{ winner.prize }}
            </BaseBadge>
          </BaseCard>
        </div>
        
        <div class="text-center mt-8">
          <RouterLink to="/ganadores" class="btn-ghost inline-flex items-center gap-2">
            Ver todos los ganadores
            <ArrowRight class="w-5 h-5" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
