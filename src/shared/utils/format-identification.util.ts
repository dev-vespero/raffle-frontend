/**
 * Validar cédula (formato Venezuela)
 */
export const isValidIdentification = (id: string): boolean => {
  const idRegex = /^V-\d{8}$/i;
  return idRegex.test(id);
};
