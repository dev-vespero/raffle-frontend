<script setup lang="ts">
import { computed } from 'vue';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface Props {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  icon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: true,
  icon: true,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const variantClasses = {
  success: 'bg-accent/10 border-accent/20 text-accent',
  error: 'bg-red-500/10 border-red-500/20 text-red-500',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
};

const icons = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};
</script>

<template>
  <div
    :class="[
      'border rounded-lg p-4 transition-all duration-200',
      variantClasses[variant],
    ]"
    role="alert"
  >
    <div class="flex gap-3">
      <!-- Icon -->
      <svg
        v-if="icon"
        class="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[variant]" />
      </svg>
      
      <!-- Content -->
      <div class="flex-1">
        <h4 v-if="title" class="font-semibold mb-1">
          {{ title }}
        </h4>
        <div class="text-sm opacity-90">
          <slot />
        </div>
      </div>
      
      <!-- Dismiss button -->
      <button
        v-if="dismissible"
        @click="emit('dismiss')"
        class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Cerrar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
