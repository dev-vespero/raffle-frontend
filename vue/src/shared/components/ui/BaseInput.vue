<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  icon?: any;
  iconPosition?: 'left' | 'right';
  name?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  iconPosition: 'left',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const hasError = computed(() => !!props.error);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === 'number' ? Number(target.value) : target.value;
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-primary">*</span>
    </label>
    
    <!-- Input container -->
    <div class="relative">
      <!-- Icono izquierda -->
      <div v-if="icon && iconPosition === 'left'" class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        <component :is="icon" class="w-5 h-5" />
      </div>
      
      <input
        :type="type"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'w-full bg-dark-surface border rounded-lg px-4 py-3 text-text-primary placeholder-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          hasError ? 'border-red-500 focus:ring-red-500' : 'border-border',
          icon && iconPosition === 'left' ? 'pl-10' : '',
          icon && iconPosition === 'right' ? 'pr-10' : '',
        ]"
        @input="handleInput"
        @blur="emit('blur', $event as any)"
        @focus="emit('focus', $event as any)"
      />
      
      <!-- Icono derecha -->
      <div v-if="icon && iconPosition === 'right'" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="hasError" class="mt-1 text-sm text-red-500 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
    
    <!-- Hint message -->
    <p v-else-if="hint" class="mt-1 text-sm text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>
