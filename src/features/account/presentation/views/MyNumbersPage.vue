<script setup lang="ts">
import { useFetchPurchases } from '../composables/use-fetch-purchases';
import { BaseCard, BaseLoader } from '@/shared/components/ui';
import PurchaseCard from '../components/PurchaseCard.vue';
import { Ticket } from 'lucide-vue-next';

const { purchases, isLoading, error } = useFetchPurchases();
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-text-primary mb-6">
      Mis Números
    </h2>

    <div v-if="isLoading" class="flex justify-center py-12">
      <BaseLoader size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <BaseCard class="max-w-md mx-auto p-8">
        <p class="text-text-secondary">
          No se pudieron cargar tus compras. Inténtalo de nuevo más tarde.
        </p>
      </BaseCard>
    </div>

    <div v-else-if="purchases && purchases.length > 0" class="space-y-4">
      <PurchaseCard
        v-for="purchase in purchases"
        :key="purchase.id"
        :purchase="purchase"
      />
    </div>

    <div v-else class="text-center py-12">
      <Ticket class="w-16 h-16 text-text-muted mx-auto mb-4" />
      <p class="text-text-secondary">
        No tienes compras registradas
      </p>
    </div>
  </div>
</template>
