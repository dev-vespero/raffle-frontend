<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  overlay: false,
});

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};
</script>

<template>
  <div
    v-if="overlay"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        :class="[
          'animate-spin rounded-full border-4 border-dark-surface-elevated border-t-primary',
          sizeClasses[size],
        ]"
      />
      <p v-if="message" class="text-text-primary font-medium animate-pulse">
        {{ message }}
      </p>
    </div>
  </div>
  
  <div v-else class="flex flex-col items-center gap-4">
    <div
      :class="[
        'animate-spin rounded-full border-4 border-dark-surface-elevated border-t-primary',
        sizeClasses[size],
      ]"
    />
    <p v-if="message" class="text-text-primary font-medium animate-pulse">
      {{ message }}
    </p>
  </div>
</template>
