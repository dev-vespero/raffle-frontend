<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: any;
  iconPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconPosition: 'left',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Clases dinámicas según variant
const variantClasses = computed(() => {
  const base = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 focus:ring-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-text-primary hover:bg-dark-surface-elevated focus:ring-primary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus:ring-primary',
  };
  
  return `${base} ${variants[props.variant]}`;
});

// Clases dinámicas según size
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
  };
  
  return sizes[props.size];
});

// Manejar click
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit('click', event);
};
</script>

<template>
  <button
    :type="type"
    :class="[
      variantClasses,
      sizeClasses,
      fullWidth ? 'w-full' : '',
      loading ? 'opacity-70 cursor-wait' : '',
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span class="flex items-center justify-center gap-2">
      <!-- Icono izquierda -->
      <span v-if="icon && iconPosition === 'left' && !loading">
        <component :is="icon" class="w-5 h-5" />
      </span>
      
      <!-- Loading spinner -->
      <span v-if="loading" class="animate-spin">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </span>
      
      <!-- Slot de contenido -->
      <slot />
      
      <!-- Icono derecha -->
      <span v-if="icon && iconPosition === 'right' && !loading">
        <component :is="icon" class="w-5 h-5" />
      </span>
    </span>
  </button>
</template>
