<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Props {
  isOpen: boolean;
  title?: string;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
  showCloseButton: true,
  size: 'md',
});

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  close: [];
}>();

// Cerrar con tecla ESC
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose();
  }
};

// Bloquear scroll cuando el modal está abierto
onMounted(() => {
  if (props.isOpen) {
    document.body.style.overflow = 'hidden';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

// Cerrar modal
const handleClose = () => {
  emit('update:isOpen', false);
  emit('close');
};

// Click en overlay
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    handleClose();
  }
};

// Tamaño del modal
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="handleOverlayClick"
      >
        <div
          role="dialog"
          aria-modal="true"
          :class="[
            'bg-dark-surface border border-border rounded-2xl shadow-xl',
            'max-h-[90vh] overflow-y-auto',
            sizeClasses[size],
            'w-full',
          ]"
        >
          <!-- Header -->
          <div v-if="title || showCloseButton" class="flex items-center justify-between p-6 border-b border-border">
            <h3 v-if="title" class="text-xl font-bold text-text-primary">
              {{ title }}
            </h3>
            <button
              v-if="showCloseButton"
              @click="handleClose"
              class="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Cerrar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div :class="title || showCloseButton ? 'p-6' : 'p-6'">
            <slot />
          </div>
          
          <!-- Footer (opcional) -->
          <div v-if="$slots.footer" class="p-6 border-t border-border bg-dark-surface-elevated rounded-b-2xl">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
