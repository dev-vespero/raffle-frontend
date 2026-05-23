<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useUiStore } from '@/stores/uiStore';
import { useTicketStore } from '@/stores/ticketStore';
import { raffleService } from '@/features/raffles/services/raffleService';
import { BaseButton, BaseCard, BaseBadge, BaseLoader, BaseAlert } from '@/shared/components/ui';
import { Calendar, Clock, Ticket, ArrowLeft, Search, Sparkles, AlertCircle } from 'lucide-vue-next';
import { raffleConfig, calculateProgress } from '@/config/raffle.config';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const ticketStore = useTicketStore();

const searchQuery = ref('');
const currentPage = ref(1);
const ticketsPerPage = 50;

// Obtener ID de rifa de la ruta
const raffleId = computed(() => route.params.id as string);

// Obtener detalle de rifa
const { data: raffleData, isLoading, error } = useQuery({
  queryKey: ['raffle', raffleId],
  queryFn: () => raffleService.getById(raffleId.value),
  select: (data) => data.data,
  enabled: () => !!raffleId.value,
});

// Calcular fecha del sorteo
const drawDate = computed(() => {
  if (!raffleData) return new Date();
  return new Date(`${raffleData.drawDate}T${raffleData.drawHour}`);
});

const daysUntilDraw = computed(() => {
  const diff = drawDate.value.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Progreso de venta
const progress = computed(() => {
  if (!raffleData) return 0;
  return calculateProgress({
    ...raffleData,
    showProgress: true,
  });
});

// Filtrar tickets por búsqueda
const filteredTickets = computed(() => {
  if (!raffleData?.availableTickets) return [];
  
  if (!searchQuery.value) {
    return raffleData.availableTickets;
  }
  
  return raffleData.availableTickets.filter(ticket =>
    ticket.includes(searchQuery.value)
  );
});

// Paginación
const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * ticketsPerPage;
  const end = start + ticketsPerPage;
  return filteredTickets.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTickets.value.length / ticketsPerPage);
});

// Verificar si un ticket está seleccionado
const isTicketSelected = (number: string) => {
  return ticketStore.selectedTickets.some(t => t.number === number);
};

// Seleccionar/deseleccionar ticket
const toggleTicket = (number: string) => {
  if (isTicketSelected(number)) {
    ticketStore.removeTicket(number);
  } else {
    ticketStore.addTicket(number);
  }
};

// Selección aleatoria
const selectRandom = () => {
  if (!raffleData?.availableTickets) return;
  
  const available = raffleData.availableTickets.filter(
    n => !isTicketSelected(n)
  );
  
  if (available.length === 0) {
    uiStore.showError('Sin boletos', 'No hay boletos disponibles para seleccionar');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * available.length);
  toggleTicket(available[randomIndex]);
};

// Continuar a compra
const goToPurchase = () => {
  if (ticketStore.selectedTickets.length === 0) {
    uiStore.showError('Selecciona boletos', 'Debes seleccionar al menos un boleto');
    return;
  }
  router.push('/comprar');
};

// Volver al catálogo
const goBack = () => {
  router.push('/');
};

// Limpiar selección al cambiar de rifa
watch(() => route.params.id, () => {
  ticketStore.clearSelection();
  currentPage.value = 1;
  searchQuery.value = '';
});
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <BaseLoader size="lg" />
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="container mx-auto px-4 py-20">
      <BaseCard class="max-w-md mx-auto p-8 text-center">
        <AlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
        <h3 class="font-bold text-text-primary text-lg mb-2">
          Error al cargar la rifa
        </h3>
        <p class="text-text-secondary mb-4">
          La rifa que buscas no existe o fue eliminada
        </p>
        <BaseButton @click="goBack" variant="primary">
          <ArrowLeft class="w-4 h-4 mr-2" />
          Volver al Inicio
        </BaseButton>
      </BaseCard>
    </div>
    
    <!-- Raffle detail -->
    <div v-else-if="raffleData" class="pb-32">
      <!-- Header with image -->
      <section class="relative h-64 md:h-80 lg:h-96">
        <img
          :src="raffleData.image"
          :alt="raffleData.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent" />
        
        <!-- Back button -->
        <button
          @click="goBack"
          class="absolute top-4 left-4 btn-ghost"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          Volver
        </button>
        
        <!-- Title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="container mx-auto">
            <BaseBadge v-if="daysUntilDraw <= 2" variant="danger" class="mb-2">
              <Clock class="w-3 h-3 mr-1" />
              ¡Finaliza pronto!
            </BaseBadge>
            <h1 class="font-display text-2xl md:text-4xl font-bold text-text-primary mb-2">
              {{ raffleData.name }}
            </h1>
            <div class="flex flex-wrap gap-4 text-text-secondary">
              <div class="flex items-center gap-2">
                <Calendar class="w-5 h-5 text-primary" />
                <span>{{ new Date(raffleData.drawDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-primary" />
                <span>{{ raffleData.drawHour }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Info and tickets -->
      <section class="container mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left column - Info -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Progress card -->
            <BaseCard v-if="raffleData.showProgress" class="p-6">
              <div class="flex justify-between mb-2">
                <span class="text-text-secondary font-medium">Progreso de venta</span>
                <span class="text-primary font-bold">{{ progress }}%</span>
              </div>
              <div class="progress-bar mb-2">
                <div
                  class="progress-bar-fill"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <p class="text-text-muted text-sm">
                {{ raffleData.tickets.available }} de {{ raffleData.tickets.total }} boletos disponibles
              </p>
            </BaseCard>
            
            <!-- Countdown card -->
            <BaseCard class="p-6 text-center">
              <p class="text-text-muted text-sm mb-2">Faltan para el sorteo</p>
              <p class="font-display text-4xl font-bold text-primary mb-4">
                {{ daysUntilDraw }} {{ daysUntilDraw === 1 ? 'día' : 'días' }}
              </p>
              <div class="flex items-center justify-center gap-2 text-text-secondary">
                <Calendar class="w-4 h-4" />
                <span class="text-sm">{{ new Date(raffleData.drawDate).toLocaleDateString('es-ES') }}</span>
              </div>
            </BaseCard>
            
            <!-- Prizes -->
            <BaseCard class="p-6">
              <h3 class="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <Trophy class="w-5 h-5 text-secondary" />
                Premios
              </h3>
              <div class="space-y-4">
                <div
                  v-for="prize in raffleData.prizes"
                  :key="prize.position"
                  class="flex items-start gap-3"
                >
                  <BaseBadge
                    :variant="prize.position === 1 ? 'secondary' : prize.position === 2 ? 'primary' : 'success'"
                    class="flex-shrink-0"
                  >
                    {{ prize.position }}°
                  </BaseBadge>
                  <div>
                    <p class="font-bold text-text-primary">{{ prize.name }}</p>
                    <p class="text-text-secondary text-sm">{{ prize.description }}</p>
                  </div>
                </div>
              </div>
            </BaseCard>
            
            <!-- Price info -->
            <BaseCard class="p-6 text-center">
              <p class="text-text-muted text-sm mb-2">Precio por boleto</p>
              <p class="font-display text-3xl font-bold text-primary mb-1">
                {{ raffleData.currency.symbol }}{{ raffleData.price }}
              </p>
              <p class="text-text-secondary text-sm">
                {{ raffleData.currency.code }}
              </p>
            </BaseCard>
          </div>
          
          <!-- Right column - Ticket selection -->
          <div class="lg:col-span-2">
            <BaseCard class="p-6">
              <!-- Search and random -->
              <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <div class="relative flex-1">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar número..."
                    class="w-full pl-10 pr-4 py-2.5 bg-dark-surface-elevated border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <BaseButton @click="selectRandom" variant="secondary">
                  <Sparkles class="w-4 h-4 mr-2" />
                  Aleatorio
                </BaseButton>
              </div>
              
              <!-- Tickets grid -->
              <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
                <button
                  v-for="ticket in paginatedTickets"
                  :key="ticket"
                  @click="toggleTicket(ticket)"
                  class="aspect-square flex items-center justify-center rounded-lg font-mono text-sm font-medium transition-all"
                  :class="isTicketSelected(ticket)
                    ? 'bg-primary text-white'
                    : 'bg-dark-surface-elevated text-text-primary hover:bg-primary/20'"
                >
                  {{ ticket }}
                </button>
              </div>
              
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mb-6">
                <BaseButton
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  variant="ghost"
                  size="sm"
                >
                  Anterior
                </BaseButton>
                <span class="text-text-secondary text-sm">
                  Página {{ currentPage }} de {{ totalPages }}
                </span>
                <BaseButton
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  variant="ghost"
                  size="sm"
                >
                  Siguiente
                </BaseButton>
              </div>
              
              <!-- Info -->
              <BaseAlert
                v-if="!searchQuery"
                variant="info"
                class="mb-6"
                title="Selecciona tus boletos"
                message="Haz click en los números para seleccionarlos. Puedes elegir múltiples boletos."
              />
            </BaseCard>
          </div>
        </div>
      </section>
      
      <!-- Fixed bottom bar -->
      <div class="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-border p-4 shadow-lg">
        <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p class="text-text-secondary text-sm mb-1">
              {{ ticketStore.totalTickets }} {{ ticketStore.totalTickets === 1 ? 'boleto' : 'boletos' }} seleccionados
            </p>
            <p class="text-2xl font-bold text-primary">
              {{ raffleData.currency.symbol }}{{ ticketStore.totalPrice.toFixed(2) }}
            </p>
          </div>
          <BaseButton
            @click="goToPurchase"
            variant="primary"
            size="lg"
            :disabled="ticketStore.totalTickets === 0"
            class="w-full sm:w-auto"
          >
            <Ticket class="w-5 h-5 mr-2" />
            Continuar a Comprar
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
