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
