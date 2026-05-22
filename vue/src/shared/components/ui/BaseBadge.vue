<script setup lang="ts">
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface Props {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
});

const variantClasses = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  success: 'bg-accent/20 text-accent',
  danger: 'bg-red-500/20 text-red-500',
  warning: 'bg-amber-500/20 text-amber-500',
  info: 'bg-blue-500/20 text-blue-500',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <span v-if="dot" class="w-2 h-2 rounded-full bg-current" />
    <slot />
  </span>
</template>
