/**
 * Formatear número con ceros a la izquierda
 */
export const padNumber = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
};
