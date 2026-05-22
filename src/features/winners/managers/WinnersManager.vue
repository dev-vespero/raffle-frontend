<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { winnersService } from '@/features/winners/services/winnersService';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { Trophy, Search, Calendar } from 'lucide-vue-next';

const currentPage = ref(1);
const searchQuery = ref('');
const itemsPerPage = 6;

// Obtener ganadores actuales
const { data: currentWinners } = useQuery({
  queryKey: ['winners', 'current'],
  queryFn: () => winnersService.getCurrent(),
  select: (data) => data.data,
});

// Obtener histórico
const { data: historicalData, isLoading } = useQuery({
  queryKey: ['winners', 'historical', currentPage.value, searchQuery.value],
  queryFn: () =>
    winnersService.getHistorical(
      currentPage.value,
      itemsPerPage,
      searchQuery.value || undefined
    ),
  select: (data) => data.data,
});

const hasMorePages = computed(() => {
  if (!historicalData.value) return false;
  return currentPage.value < historicalData.value.meta.totalPages;
});

const goToPage = (page: number) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (hasMorePages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold text-text-primary mb-2">
        Ganadores
      </h1>
      <p class="text-text-secondary">
        Conoce a los afortunados ganadores de nuestros sorteos
      </p>
    </div>
    
    <!-- Current winners banner -->
    <BaseCard v-if="currentWinners" class="mb-12 bg-gradient-to-r from-primary/20 to-secondary/10 border-primary/30">
      <div class="text-center mb-6">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold mb-4">
          <Trophy class="w-5 h-5" />
          Sorteo Actual
        </div>
        <h2 class="font-display text-2xl font-bold text-text-primary mb-2">
          {{ currentWinners.raffleName }}
        </h2>
        <div class="flex items-center justify-center gap-2 text-text-secondary">
          <Calendar class="w-4 h-4" />
          {{ new Date(currentWinners.raffleDate).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </div>
      </div>
      
      <div v-if="currentWinners.winners.length > 0" class="grid md:grid-cols-3 gap-4">
        <BaseCard
          v-for="winner in currentWinners.winners"
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
      
      <div v-else class="text-center py-8">
        <p class="text-text-secondary">
          Sorteo en curso. ¡Pronto conoceremos a los ganadores!
        </p>
      </div>
    </BaseCard>
    
    <!-- Historical winners -->
    <div>
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 class="text-2xl font-bold text-text-primary">
          Histórico de Ganadores
        </h2>
        
        <!-- Search -->
        <div class="w-full md:w-auto">
          <BaseInput
            v-model="searchQuery"
            placeholder="Buscar por nombre del sorteo..."
            :icon="Search"
          />
        </div>
      </div>
      
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-text-muted">Cargando ganadores...</p>
      </div>
      
      <!-- Results -->
      <div v-else-if="historicalData && historicalData.data.length > 0" class="space-y-6">
        <div
          v-for="raffle in historicalData.data"
          :key="raffle.raffleDate"
        >
          <h3 class="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-primary" />
            {{ raffle.raffleName }}
            <span class="text-text-muted text-sm font-normal">
              ({{ new Date(raffle.raffleDate).toLocaleDateString('es-VE') }})
            </span>
          </h3>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BaseCard
              v-for="winner in raffle.winners"
              :key="winner.id"
              class="text-center"
            >
              <div class="text-3xl mb-2">🏆</div>
              <h4 class="font-bold text-text-primary mb-1">
                {{ winner.name }}
              </h4>
              <p class="text-primary font-mono text-sm mb-2">
                #{{ winner.ticket }}
              </p>
              <BaseBadge variant="secondary">
                {{ winner.prize }}
              </BaseBadge>
            </BaseCard>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-center items-center gap-2 mt-8">
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            ← Anterior
          </BaseButton>
          
          <div class="flex gap-1">
            <BaseButton
              v-for="page in historicalData.meta.totalPages"
              :key="page"
              variant="ghost"
              size="sm"
              :class="currentPage === page ? 'bg-primary text-white' : ''"
              @click="goToPage(page)"
            >
              {{ page }}
            </BaseButton>
          </div>
          
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="!hasMorePages"
            @click="nextPage"
          >
            Siguiente →
          </BaseButton>
        </div>
      </div>
      
      <!-- No results -->
      <div v-else class="text-center py-12">
        <Trophy class="w-16 h-16 text-text-muted mx-auto mb-4" />
        <p class="text-text-secondary">
          No hay ganadores registrados aún
        </p>
      </div>
    </div>
  </div>
</template>
