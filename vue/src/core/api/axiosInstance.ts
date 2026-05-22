import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { envConfig } from '@/config/env.config';
import type { ApiResponse, ApiError } from '@/core/types/api.types';

// Crear instancia de axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: envConfig.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - añadir token y headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage si existe
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Añadir timestamp para evitar cache en GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response - manejar éxitos y errores
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Response exitoso (2xx)
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    // Manejo centralizado de errores
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Error de validación
          console.error('❌ Error de validación:', data?.errors);
          break;
          
        case 401:
          // No autorizado - limpiar token y redirigir a login
          console.error('❌ No autorizado:', data?.message);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          
          // Disparar evento para que la app redirija al login
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          break;
          
        case 403:
          // Prohibido
          console.error('❌ Prohibido:', data?.message);
          break;
          
        case 404:
          // No encontrado
          console.error('❌ No encontrado:', data?.message);
          break;
          
        case 500:
          // Error del servidor
          console.error('❌ Error del servidor:', data?.message);
          break;
          
        default:
          console.error('❌ Error HTTP:', status, data?.message);
      }
    } else if (error.request) {
      // Request enviado pero no hubo response (network error)
      console.error('❌ Error de red:', error.message);
    } else {
      // Error antes de enviar el request
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Exportar tipos útiles
export type { AxiosInstance, AxiosError, AxiosResponse };
