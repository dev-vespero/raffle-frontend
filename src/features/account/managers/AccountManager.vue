<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import BaseCard from '@/shared/components/ui/BaseCard.vue';
import { User, Ticket, Trophy, Settings, Bell, LogOut } from 'lucide-vue-next';

const authStore = useAuthStore();
const route = useRoute();

const menuItems = [
  {
    name: 'Mis Números',
    path: '/cuenta/numeros',
    icon: Ticket,
    description: 'Ver todas tus compras',
  },
  {
    name: 'Mis Premios',
    path: '/cuenta/premios',
    icon: Trophy,
    description: 'Premios ganados',
  },
  {
    name: 'Mi Perfil',
    path: '/cuenta/perfil',
    icon: User,
    description: 'Datos personales y contraseña',
  },
  {
    name: 'Notificaciones',
    path: '/cuenta/notificaciones',
    icon: Bell,
    description: 'Configuración de alertas',
  },
];

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-display text-3xl font-bold text-text-primary mb-2">
        Mi Cuenta
      </h1>
      <p class="text-text-secondary">
        Gestiona tu perfil, compras y preferencias
      </p>
    </div>
    
    <div class="grid lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <BaseCard class="p-0 overflow-hidden">
          <!-- User info -->
          <div class="p-6 border-b border-border bg-dark-surface-elevated">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {{ authStore.userName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-text-primary">
                  {{ authStore.userName }}
                </p>
                <p class="text-sm text-text-muted">
                  {{ authStore.userEmail }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Menu -->
          <nav class="p-2">
            <RouterLink
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1',
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-dark-surface-elevated hover:text-text-primary',
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-xs text-text-muted">{{ item.description }}</p>
              </div>
            </RouterLink>
          </nav>
          
          <!-- Logout -->
          <div class="p-2 border-t border-border">
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut class="w-5 h-5" />
              <span class="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </BaseCard>
      </div>
      
      <!-- Main content -->
      <div class="lg:col-span-3">
        <RouterView />
      </div>
    </div>
  </div>
</template>
