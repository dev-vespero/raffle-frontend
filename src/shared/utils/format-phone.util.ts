/**
 * Validar teléfono (formato Venezuela)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^04[12346789]\d{7}$/;
  return phoneRegex.test(phone);
};
