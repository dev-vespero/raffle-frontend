<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
});
</script>

<template>
  <div
    :class="[
      'bg-dark-surface border border-border rounded-xl transition-all duration-200',
      variant === 'elevated' ? 'shadow-lg' : '',
      variant === 'outlined' ? 'border-2' : '',
      hoverable ? 'hover:shadow-xl hover:border-primary' : '',
      padding === 'none' ? '' : '',
      padding === 'sm' ? 'p-4' : '',
      padding === 'md' ? 'p-6' : '',
      padding === 'lg' ? 'p-8' : '',
    ]"
  >
    <slot />
  </div>
</template>
