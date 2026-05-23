// Configuración del tema - Mock de lo que vendría del backend
// Esto permite cambiar colores de marca dinámicamente

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  logo: string;
  brandName: string;
  fonts: {
    sans: string;
    display: string;
  };
}

// Mock de configuración - esto vendría del backend
export const themeConfig: ThemeConfig = {
  colors: {
    primary: '#DC2626',        // Rojo intenso - urgencia, emoción
    primaryForeground: '#FFFFFF',
    secondary: '#FBBF24',      // Ámbar/dorado - premio, lujo
    secondaryForeground: '#0F172A',
    accent: '#16A34A',         // Verde - éxito, ganar
    accentForeground: '#FFFFFF',
  },
  logo: 'https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png',
  brandName: 'Moto Moto Rifas',
  fonts: {
    sans: 'Poppins',
    display: 'Jaro',
  },
};

// Función para actualizar colores dinámicamente
export const applyThemeColors = (colors: ThemeColors) => {
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-foreground', colors.primaryForeground);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-foreground', colors.secondaryForeground);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-accent-foreground', colors.accentForeground);
};
