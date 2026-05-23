<script setup lang="ts">
import { BaseCard } from '@/shared/components/ui';
</script>

<template>
  <section class="py-12 bg-gradient-to-r from-primary/20 to-secondary/10">
    <div class="text-center">
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
</template>
