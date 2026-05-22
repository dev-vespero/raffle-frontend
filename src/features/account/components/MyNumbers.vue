<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import BaseBadge from '@/shared/components/ui/BaseBadge.vue';
import { Ticket, Calendar, DollarSign } from 'lucide-vue-next';

const authStore = useAuthStore();

// Mock de compras - esto vendría de la API
const mockPurchases = computed(() => [
  {
    id: '1',
    date: '2025-01-15',
    tickets: ['123', '456', '789'],
    total: 4.5,
    status: 'verified',
  },
  {
    id: '2',
    date: '2025-01-10',
    tickets: ['321'],
    total: 1.5,
    status: 'pending',
  },
]);

const statusLabels = {
  pending: { label: 'Pendiente', variant: 'warning' as const },
  verified: { label: 'Verificado', variant: 'success' as const },
  cancelled: { label: 'Cancelado', variant: 'danger' as const },
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-text-primary mb-6">
      Mis Números
    </h2>
    
    <div class="space-y-4">
      <BaseCard v-for="purchase in mockPurchases" :key="purchase.id">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <Ticket class="w-6 h-6" />
            </div>
            <div>
              <p class="font-semibold text-text-primary">
                Compra #{{ purchase.id }}
              </p>
              <div class="flex items-center gap-2 text-sm text-text-muted">
                <Calendar class="w-4 h-4" />
                {{ purchase.date }}
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-2xl font-bold text-primary">
                ${{ purchase.total.toFixed(2) }}
              </p>
              <BaseBadge :variant="statusLabels[purchase.status].variant">
                {{ statusLabels[purchase.status].label }}
              </BaseBadge>
            </div>
          </div>
        </div>
        
        <!-- Tickets -->
        <div class="mt-4 pt-4 border-t border-border">
          <p class="text-sm text-text-secondary mb-2">Boletos:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ticket in purchase.tickets"
              :key="ticket"
              class="px-3 py-1 bg-dark-surface-elevated rounded-lg font-mono font-medium text-text-primary"
            >
              #{{ ticket }}
            </span>
          </div>
        </div>
      </BaseCard>
      
      <div v-if="mockPurchases.length === 0" class="text-center py-12">
        <Ticket class="w-16 h-16 text-text-muted mx-auto mb-4" />
        <p class="text-text-secondary">
          No tienes compras registradas
        </p>
      </div>
    </div>
  </div>
</template>
