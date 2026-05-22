/**
 * Formatear número con ceros a la izquierda
 */
export const padNumber = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
};

/**
 * Formatear moneda
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'es-VE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Formatear fecha
 */
export const formatDate = (
  date: string | Date,
  locale: string = 'es-VE',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(dateObj);
};

/**
 * Formatear fecha corta (ej: 24 FEB 2025)
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'es-VE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
};

/**
 * Formatear hora
 */
export const formatTime = (date: string | Date, locale: string = 'es-VE'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Calcular tiempo restante (countdown)
 */
export const calculateCountdown = (targetDate: string | Date) => {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  };
};

/**
 * Generar ID único
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar teléfono (formato Venezuela)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^04[12346789]\d{7}$/;
  return phoneRegex.test(phone);
};

/**
 * Validar cédula (formato Venezuela)
 */
export const isValidIdentification = (id: string): boolean => {
  const idRegex = /^V-\d{8}$/i;
  return idRegex.test(id);
};

/**
 * Debounce
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Shuffle array (Fisher-Yates)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Descargar archivo desde Blob
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convertir File a Blob
 */
export const fileToBlob = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Blob([reader.result as ArrayBuffer]));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Redimensionar imagen
 */
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.8);
    };
    
    img.src = url;
  });
};
