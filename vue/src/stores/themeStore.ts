import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { applyThemeColors, type ThemeColors } from '@/config/theme.config';

type ThemeMode = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  // Estado
  const mode = ref<ThemeMode>('system');
  const isLight = ref(false);
  
  // Computed
  const currentMode = computed(() => {
    if (mode.value === 'system') {
      // Detectar preferencia del sistema
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return mode.value;
  });
  
  const isDarkMode = computed(() => currentMode.value === 'dark');
  
  // Inicializar tema
  const initTheme = () => {
    // Cargar preferencia guardada
    const savedMode = localStorage.getItem('theme_mode') as ThemeMode | null;
    
    if (savedMode) {
      mode.value = savedMode;
    } else {
      mode.value = 'system';
    }
    
    applyTheme();
    
    // Escuchar cambios del sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (mode.value === 'system') {
        applyTheme();
      }
    });
  };
  
  // Aplicar tema al DOM
  const applyTheme = () => {
    const html = document.documentElement;
    const newIsLight = currentMode.value === 'light';
    
    if (newIsLight) {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
    
    isLight.value = newIsLight;
    
    // Guardar preferencia
    localStorage.setItem('theme_mode', mode.value);
  };
  
  // Cambiar modo
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode;
    applyTheme();
  };
  
  // Toggle entre light y dark
  const toggle = () => {
    setMode(currentMode.value === 'light' ? 'dark' : 'light');
  };
  
  // Actualizar colores dinámicos (desde backend)
  const updateColors = (colors: ThemeColors) => {
    applyThemeColors(colors);
  };
  
  return {
    // Estado
    mode,
    isLight,
    
    // Computed
    currentMode,
    isDarkMode,
    
    // Actions
    initTheme,
    setMode,
    toggle,
    updateColors,
  };
});
