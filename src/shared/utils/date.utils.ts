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
