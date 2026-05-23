<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: boolean;
    as?: string;
  }>(),
  {
    maxWidth: 'xl',
    padding: true,
    as: 'div',
  }
);

const maxWidthClass = computed(() => {
  const classes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };
  return classes[props.maxWidth];
});
</script>

<template>
  <component
    :is="as"
    class="mx-auto w-full"
    :class="[maxWidthClass, { 'px-4 py-6': padding }]"
  >
    <slot />
  </component>
</template>
