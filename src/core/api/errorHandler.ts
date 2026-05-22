import type { AxiosError } from 'axios';
import type { ApiError } from '@/core/types/api.types';

/**
 * Manejador centralizado de errores de API
 * Extrae mensajes de error legibles para el usuario
 */

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Extrae el mensaje de error de una respuesta de API
 */
export const extractErrorMessage = (error: unknown): ErrorResponse => {
  // Error de axios
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      
      return {
        message: data?.message || getErrorMessageByStatus(status),
        errors: data?.errors,
        status,
      };
    }
    
    if (axiosError.request) {
      return {
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        status: 0,
      };
    }
    
    return {
      message: axiosError.message || 'Ocurrió un error inesperado.',
    };
  }
  
  // Error genérico
  if (error instanceof Error) {
    return {
      message: error.message || 'Ocurrió un error inesperado.',
    };
  }
  
  // Error desconocido
  return {
    message: 'Ocurrió un error inesperado.',
  };
};

/**
 * Obtiene mensaje de error por código de status HTTP
 */
const getErrorMessageByStatus = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Datos inválidos. Por favor verifica la información.',
    401: 'No tienes permiso para realizar esta acción.',
    403: 'Acceso denegado.',
    404: 'El recurso solicitado no existe.',
    409: 'Conflicto. El recurso ya existe.',
    422: 'Datos inválidos. Verifica el formulario.',
    429: 'Demasiadas solicitudes. Por favor espera un momento.',
    500: 'Error del servidor. Intenta más tarde.',
    502: 'Servicio no disponible temporalmente.',
    503: 'Servicio en mantenimiento. Intenta más tarde.',
  };
  
  return messages[status] || 'Ocurrió un error inesperado.';
};

/**
 * Verifica si un error es de axios
 */
const isAxiosError = (error: unknown): boolean => {
  return (error as AxiosError)?.isAxiosError === true;
};

/**
 * Formatea errores de validación para mostrar en formulario
 */
export const formatValidationErrors = (
  errors?: Record<string, string[]>
): Record<string, string> => {
  if (!errors) return {};
  
  const formatted: Record<string, string> = {};
  
  Object.entries(errors).forEach(([field, messages]) => {
    // Tomar el primer mensaje de error de cada campo
    formatted[field] = messages[0] || 'Campo inválido';
  });
  
  return formatted;
};

/**
 * Clase de error personalizada para la app
 */
export class AppError extends Error {
  public readonly status?: number;
  public readonly errors?: Record<string, string[]>;
  
  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.errors = errors;
  }
}
