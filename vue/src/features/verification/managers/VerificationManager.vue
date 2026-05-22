<script setup lang="ts">
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { verificationService } from '@/features/verification/services/verificationService';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import BaseInput from '@/shared/components/ui/BaseInput.vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { Search, Ticket, Phone, User } from 'lucide-vue-next';

const searchType = ref<'phone' | 'ticket'>('phone');
const searchValue = ref('');
const hasSearched = ref(false);

// Buscar
const { data: searchData, isLoading, refetch } = useQuery({
  queryKey: ['verification', searchType.value, searchValue.value],
  queryFn: () => {
    hasSearched.value = true;
    
    if (searchType.value === 'phone') {
      return verificationService.searchByPhone(searchValue.value);
    } else {
      return verificationService.searchByTicket(searchValue.value);
    }
  },
  enabled: false,
  select: (data) => data.data,
});

const handleSearch = () => {
  if (!searchValue.value) return;
  refetch();
};

const resetSearch = () => {
  searchValue.value = '';
  hasSearched.value = false;
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="font-display text-3xl font-bold text-text-primary mb-2">
        Verificar Boletos
      </h1>
      <p class="text-text-secondary">
        Busca tus boletos por número de teléfono o número de ticket
      </p>
    </div>
    
    <!-- Search form -->
    <BaseCard class="max-w-2xl mx-auto mb-8">
      <!-- Toggle search type -->
      <div class="flex gap-2 mb-6">
        <button
          @click="searchType = 'phone'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
            searchType === 'phone'
              ? 'bg-primary text-white'
              : 'bg-dark-surface-elevated text-text-secondary hover:text-text-primary',
          ]"
        >
          <Phone class="w-5 h-5" />
          Por Teléfono
        </button>
        <button
          @click="searchType = 'ticket'"
          :class="[
            'flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
            searchType === 'ticket'
              ? 'bg-primary text-white'
              : 'bg-dark-surface-elevated text-text-secondary hover:text-text-primary',
          ]"
        >
          <Ticket class="w-5 h-5" />
          Por Ticket
        </button>
      </div>
      
      <!-- Input -->
      <div class="flex gap-2">
        <BaseInput
          v-model="searchValue"
          :placeholder="searchType === 'phone' ? 'Número de teléfono' : 'Número de ticket'"
          :icon="searchType === 'phone' ? Phone : Ticket"
          @keyup.enter="handleSearch"
        />
        <BaseButton
          variant="primary"
          :icon="Search"
          :disabled="!searchValue.value"
          @click="handleSearch"
        >
          Buscar
        </BaseButton>
      </div>
    </BaseCard>
    
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-12">
      <p class="text-text-muted">Buscando...</p>
    </div>
    
    <!-- Results -->
    <div v-else-if="searchData" class="max-w-4xl mx-auto">
      <!-- Buyer info -->
      <BaseCard class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <User class="w-6 h-6" />
          </div>
          <div>
            <h3 class="font-bold text-text-primary text-lg">
              {{ searchData.buyer.name }}
            </h3>
            <p class="text-text-secondary">
              {{ searchData.buyer.phone }}
            </p>
          </div>
        </div>
        
        <div class="flex gap-4">
          <BaseBadge variant="primary">
            <Ticket class="w-4 h-4" />
            {{ searchData.purchases.reduce((sum, p) => sum + p.tickets.length, 0) }} boletos
          </BaseBadge>
          <BaseBadge variant="success">
            {{ searchData.purchases.length }} compras
          </BaseBadge>
        </div>
      </BaseCard>
      
      <!-- Purchases list -->
      <div class="space-y-4">
        <h3 class="font-semibold text-text-primary mb-4">
          Boletos Registrados
        </h3>
        
        <BaseCard
          v-for="(purchase, index) in searchData.purchases"
          :key="purchase.id"
        >
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p class="font-semibold text-text-primary">
                Compra #{{ index + 1 }}
              </p>
              <p class="text-sm text-text-muted">
                {{ new Date(purchase.createdAt).toLocaleDateString('es-VE') }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-primary">
                ${{ purchase.total.toFixed(2) }}
              </p>
              <BaseBadge
                :variant="purchase.status === 'verified' ? 'success' : purchase.status === 'unverified' ? 'warning' : 'danger'"
              >
                {{ purchase.status === 'verified' ? 'Verificado' : purchase.status === 'unverified' ? 'En verificación' : 'Pendiente' }}
              </BaseBadge>
            </div>
          </div>
          
          <!-- Tickets -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ticket in purchase.tickets"
              :key="ticket"
              class="px-3 py-1 bg-dark-surface-elevated rounded-lg font-mono font-medium text-text-primary"
            >
              #{{ ticket }}
            </span>
          </div>
        </BaseCard>
      </div>
    </div>
    
    <!-- No results -->
    <div v-else-if="hasSearched" class="text-center py-12">
      <Search class="w-16 h-16 text-text-muted mx-auto mb-4" />
      <p class="text-text-secondary">
        No se encontraron boletos con {{ searchType === 'phone' ? 'este teléfono' : 'este número' }}
      </p>
    </div>
    
    <!-- Initial state -->
    <div v-else class="text-center py-12">
      <Search class="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
      <p class="text-text-muted">
        Ingresa {{ searchType === 'phone' ? 'un número de teléfono' : 'un número de ticket' }} para buscar
      </p>
    </div>
  </div>
</template>
