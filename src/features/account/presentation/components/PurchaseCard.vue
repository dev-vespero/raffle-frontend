<script setup lang="ts">
import type { Purchase } from '../../domain/entities/purchase.entity';
import { BaseCard, BaseBadge } from '@/shared/components/ui';
import { Ticket, Calendar } from 'lucide-vue-next';

defineProps<{
  purchase: Purchase;
}>();
</script>

<template>
  <BaseCard>
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
          <BaseBadge :variant="purchase.getStatusVariant()">
            {{ purchase.getStatusLabel() }}
          </BaseBadge>
        </div>
      </div>
    </div>

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
</template>
