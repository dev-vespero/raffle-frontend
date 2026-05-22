<script setup lang="ts">
interface Option {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccionar...',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
      <span v-if="required" class="text-primary">*</span>
    </label>
    
    <!-- Select container -->
    <div class="relative">
      <select
        :name="name"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full bg-dark-surface border border-border rounded-lg px-4 py-3 text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'appearance-none transition-all duration-200',
          error ? 'border-red-500 focus:ring-red-500' : '',
        ]"
        @change="handleChange"
      >
        <option value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Arrow icon -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-500 flex items-center gap-1">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
