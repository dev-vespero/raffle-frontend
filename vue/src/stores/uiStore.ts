import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export const useUiStore = defineStore('ui', () => {
  // Estado
  const isLoading = ref(false);
  const loadingMessage = ref('Cargando...');
  const notifications = ref<Notification[]>([]);
  const activeModal = ref<string | null>(null);
  
  // Actions - Loading
  const showLoading = (message = 'Cargando...') => {
    loadingMessage.value = message;
    isLoading.value = true;
  };
  
  const hideLoading = () => {
    isLoading.value = false;
    loadingMessage.value = 'Cargando...';
  };
  
  // Actions - Notifications
  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notif_${Date.now()}_${Math.random()}`;
    
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };
    
    notifications.value.push(newNotification);
    
    // Auto-remover después de la duración
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  };
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };
  
  const clearNotifications = () => {
    notifications.value = [];
  };
  
  // Helpers para tipos de notificación
  const showSuccess = (title: string, message: string, duration?: number) => {
    return showNotification({ type: 'success', title, message, duration });
  };
  
  const showError = (title: string, message: string, duration?: number) => {
    return showNotification({ type: 'error', title, message, duration });
  };
  
  const showWarning = (title: string, message: string, duration?: number) => {
    return showNotification({ type: 'warning', title, message, duration });
  };
  
  const showInfo = (title: string, message: string, duration?: number) => {
    return showNotification({ type: 'info', title, message, duration });
  };
  
  // Actions - Modales
  const openModal = (modalName: string) => {
    activeModal.value = modalName;
  };
  
  const closeModal = (modalName?: string) => {
    if (modalName) {
      if (activeModal.value === modalName) {
        activeModal.value = null;
      }
    } else {
      activeModal.value = null;
    }
  };
  
  return {
    // Estado
    isLoading,
    loadingMessage,
    notifications,
    activeModal,
    
    // Actions - Loading
    showLoading,
    hideLoading,
    
    // Actions - Notifications
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Actions - Modales
    openModal,
    closeModal,
  };
});
