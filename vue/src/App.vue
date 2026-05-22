<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useUiStore } from '@/stores/uiStore';
import Navbar from '@/shared/components/layout/Navbar.vue';
import Footer from '@/shared/components/layout/Footer.vue';
import BaseModal from '@/shared/components/ui/BaseModal.vue';
import BaseLoader from '@/shared/components/ui/BaseLoader.vue';
import BaseAlert from '@/shared/components/ui/BaseAlert.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const uiStore = useUiStore();
const route = useRoute();

// Inicializar stores
onMounted(() => {
  authStore.initAuth();
  themeStore.initTheme();
});

// Escuchar evento de unauthorized para redirigir
window.addEventListener('auth:unauthorized', () => {
  uiStore.showError('Sesión expirada', 'Por favor inicia sesión nuevamente');
  setTimeout(() => {
    window.location.href = '/login';
  }, 2000);
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main content -->
    <main class="flex-1 pt-16">
      <RouterView v-slot="{ Component }">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          mode="out-in"
        >
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Loading overlay -->
    <BaseLoader
      v-if="uiStore.isLoading"
      overlay
      :message="uiStore.loadingMessage"
    />
    
    <!-- Notifications -->
    <Teleport to="body">
      <div class="fixed bottom-4 right-4 z-50 space-y-2">
        <TransitionGroup
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-x-8"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-8"
        >
          <BaseAlert
            v-for="notification in uiStore.notifications"
            :key="notification.id"
            :variant="notification.type"
            :title="notification.title"
            class="w-80 shadow-lg"
            @dismiss="uiStore.removeNotification(notification.id)"
          >
            {{ notification.message }}
          </BaseAlert>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>
