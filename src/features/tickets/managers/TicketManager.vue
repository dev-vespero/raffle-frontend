<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTicketStore } from '@/app/stores/ticketStore';
import { useAuthStore } from '@/app/stores/authStore';
import { useUiStore } from '@/app/stores/uiStore';
import { ticketService } from '@/features/tickets/services/ticketService';
import { useQuery } from '@tanstack/vue-query';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import PageContainer from '@/shared/components/ui/page-container.vue';
import { Ticket, Search, Shuffle, X, Check } from 'lucide-vue-next';

const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const uiStore = useUiStore();

// Estado local
const searchMode = ref(false);
const searchQuery = ref('');
const currentPage = ref(0);
const ticketsPerPage = 60;

// Obtener tickets disponibles
const { data: ticketsData, isLoading } = useQuery({
  queryKey: ['tickets', 'available'],
  queryFn: () => ticketService.getAvailable(),
  select: (data) => data.data,
});

// Tickets paginados
const paginatedTickets = computed(() => {
  if (!ticketsData.value) return [];
  
  const start = currentPage.value * ticketsPerPage;
  const end = start + ticketsPerPage;
  return ticketsData.value.slice(start, end);
});

const totalPages = computed(() => {
  if (!ticketsData.value) return 0;
  return Math.ceil(ticketsData.value.length / ticketsPerPage);
});

// Búsqueda
const filteredTickets = computed(() => {
  if (!searchQuery.value || !searchMode.value) return paginatedTickets.value;
  
  return paginatedTickets.value.filter(ticket =>
    ticket.includes(searchQuery.value)
  );
});

// Navegación de páginas
const goToPage = (page: number) => {
  currentPage.value = Math.max(0, Math.min(page, totalPages.value - 1));
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

// Seleccionar ticket
const selectTicket = (ticketNumber: string) => {
  if (ticketStore.isTicketSelected(ticketNumber)) {
    ticketStore.removeTicket(ticketNumber);
  } else {
    const added = ticketStore.addTicket(ticketNumber);
    
    if (!added) {
      uiStore.showError('Error', 'Ya tienes este boleto seleccionado');
    }
  }
};

// Toggle búsqueda
const toggleSearch = () => {
  searchMode.value = !searchMode.value;
  searchQuery.value = '';
};

// Selección aleatoria
const selectRandom = () => {
  if (!ticketsData.value) return;
  
  const availableCount = ticketStore.quantity;
  const availableTickets = ticketsData.value.filter(
    t => !ticketStore.isTicketSelected(t)
  );
  
  if (availableTickets.length < availableCount) {
    uiStore.showError(
      'No hay suficientes boletos',
      `Solo quedan ${availableTickets.length} boletos disponibles`
    );
    return;
  }
  
  // Seleccionar aleatoriamente
  for (let i = 0; i < availableCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableTickets.length);
    const ticket = availableTickets[randomIndex];
    ticketStore.addTicket(ticket);
    availableTickets.splice(randomIndex, 1);
  }
  
  uiStore.showSuccess('Boletos seleccionados', `Se seleccionaron ${availableCount} boletos aleatorios`);
};

// Continuar a compra
const continueToPurchase = () => {
  if (!authStore.isAuthenticated) {
    // Redirigir a login con redirect
    router.push({
      name: 'Login',
      query: { redirect: '/boletos' },
    });
    return;
  }
  
  if (ticketStore.canContinue) {
    router.push('/comprar');
  }
};

// Resetear búsqueda
const resetSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <PageContainer>
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold text-text-primary mb-2">
        Selecciona tus Boletos
      </h1>
      <p class="text-text-secondary">
        Elige tus números de la suerte o deja que el azar lo haga por ti
      </p>
    </div>
    
    <!-- Controls -->
    <BaseCard class="mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Search -->
        <div class="flex items-center gap-2">
          <BaseButton
            variant="ghost"
            size="sm"
            :icon="searchMode ? X : Search"
            @click="toggleSearch"
          >
            {{ searchMode ? 'Cancelar' : 'Buscar' }}
          </BaseButton>
          
          <div v-if="searchMode" class="flex items-center gap-2">
            <BaseInput
              v-model="searchQuery"
              type="text"
              placeholder="Número de boleto..."
              class="w-48"
              @keyup.enter="goToPage(0)"
            />
            <BaseButton
              v-if="searchQuery"
              variant="ghost"
              size="sm"
              :icon="X"
              @click="resetSearch"
            />
          </div>
        </div>
        
        <!-- Random select -->
        <BaseButton
          variant="secondary"
          size="sm"
          :icon="Shuffle"
          @click="selectRandom"
        >
          Selección Aleatoria
        </BaseButton>
      </div>
    </BaseCard>
    
    <!-- Info bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <BaseBadge variant="primary">
          <Ticket class="w-4 h-4" />
          {{ ticketsData?.length || 0 }} disponibles
        </BaseBadge>
        <BaseBadge variant="success">
          <Check class="w-4 h-4" />
          {{ ticketStore.totalTickets }} seleccionados
        </BaseBadge>
      </div>
      
      <!-- Pagination info -->
      <div class="text-text-secondary text-sm">
        Página {{ currentPage + 1 }} de {{ totalPages }}
      </div>
    </div>
    
    <!-- Tickets Grid -->
    <BaseCard v-if="!isLoading" class="p-6">
      <div v-if="filteredTickets.length > 0" class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        <button
          v-for="ticket in filteredTickets"
          :key="ticket"
          :class="[
            'ticket-chip',
            ticketStore.isTicketSelected(ticket) ? 'selected' : '',
          ]"
          @click="selectTicket(ticket)"
        >
          {{ ticket }}
        </button>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-text-muted">
          {{ searchMode ? 'No se encontraron boletos con ese número' : 'No hay boletos disponibles' }}
        </p>
      </div>
    </BaseCard>
    
    <!-- Loading -->
    <div v-else class="text-center py-12">
      <p class="text-text-muted">Cargando boletos...</p>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="currentPage === 0"
        @click="prevPage"
      >
        ← Anterior
      </BaseButton>
      
      <div class="flex gap-1">
        <BaseButton
          v-for="page in Math.min(5, totalPages)"
          :key="page"
          variant="ghost"
          size="sm"
          :class="currentPage === page - 1 ? 'bg-primary text-white' : ''"
          @click="goToPage(page - 1)"
        >
          {{ page }}
        </BaseButton>
      </div>
      
      <BaseButton
        variant="ghost"
        size="sm"
        :disabled="currentPage === totalPages - 1"
        @click="nextPage"
      >
        Siguiente →
      </BaseButton>
    </div>
    
    <!-- Selected tickets bar -->
    <div
      v-if="ticketStore.hasSelectedTickets"
      class="fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-border p-4 shadow-lg z-30"
    >
      <div class="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-text-secondary text-sm">
              {{ ticketStore.totalTickets }} boletos seleccionados
            </p>
            <p class="text-primary font-bold text-lg">
              Total: ${{ ticketStore.total.toFixed(2) }}
            </p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <BaseButton
            variant="ghost"
            @click="ticketStore.clearSelection"
          >
            Limpiar
          </BaseButton>
          <BaseButton
            variant="primary"
            :disabled="!ticketStore.canContinue"
            @click="continueToPurchase"
          >
            Continuar
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- Spacer for fixed bar -->
    <div v-if="ticketStore.hasSelectedTickets" class="h-24" />
  </PageContainer>
</template>
