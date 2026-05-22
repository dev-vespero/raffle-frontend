<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Menu, X, Sun, Moon, User, LogOut, Ticket, Settings, Trophy } from 'lucide-vue-next';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const route = useRoute();

const isMenuOpen = ref(false);

const navLinks = computed(() => [
  { name: 'Inicio', path: '/', icon: null },
  { name: 'Boletos', path: '/boletos', icon: null },
  { name: 'Verificar', path: '/verificar', icon: null },
  { name: 'Ganadores', path: '/ganadores', icon: Trophy },
]);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleTheme = () => {
  themeStore.toggle();
};

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-border">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <img
            src="https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png"
            alt="Logo"
            class="h-10 w-10 object-contain"
          />
          <span class="font-display font-bold text-xl text-text-primary hidden sm:block">
            Moto Moto Rifas
          </span>
        </RouterLink>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isActive(link.path)
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface',
            ]"
          >
            <span class="flex items-center gap-2">
              <component :is="link.icon" v-if="link.icon" class="w-4 h-4" />
              {{ link.name }}
            </span>
          </RouterLink>
        </div>
        
        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-surface transition-colors"
            aria-label="Cambiar tema"
          >
            <Sun v-if="themeStore.isDarkMode" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
          
          <!-- Auth buttons -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/cuenta"
              class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-dark-surface text-text-primary hover:bg-dark-surface-elevated transition-colors"
            >
              <User class="w-4 h-4" />
              <span>{{ authStore.userName }}</span>
            </RouterLink>
            
            <button
              @click="authStore.logout"
              class="p-2 rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut class="w-5 h-5" />
            </button>
          </template>
          
          <template v-else>
            <RouterLink
              to="/login"
              class="hidden sm:block px-4 py-2 rounded-lg font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Iniciar Sesión
            </RouterLink>
            <RouterLink
              to="/registro"
              class="hidden sm:block btn-primary"
            >
              Registrarse
            </RouterLink>
          </template>
          
          <!-- Mobile menu button -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-surface transition-colors"
            aria-label="Menú"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMenuOpen" class="md:hidden border-t border-border bg-dark-bg">
        <div class="container mx-auto px-4 py-4 space-y-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
              isActive(link.path)
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface',
            ]"
            @click="isMenuOpen = false"
          >
            <component :is="link.icon" v-if="link.icon" class="w-5 h-5" />
            {{ link.name }}
          </RouterLink>
          
          <div class="border-t border-border pt-4 mt-4 space-y-2">
            <template v-if="authStore.isAuthenticated">
              <RouterLink
                to="/cuenta"
                class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-text-secondary hover:text-text-primary hover:bg-dark-surface"
                @click="isMenuOpen = false"
              >
                <User class="w-5 h-5" />
                {{ authStore.userName }}
              </RouterLink>
              <RouterLink
                to="/cuenta/numeros"
                class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-text-secondary hover:text-text-primary hover:bg-dark-surface"
                @click="isMenuOpen = false"
              >
                <Ticket class="w-5 h-5" />
                Mis Boletos
              </RouterLink>
              <RouterLink
                to="/cuenta/notificaciones"
                class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-text-secondary hover:text-text-primary hover:bg-dark-surface"
                @click="isMenuOpen = false"
              >
                <Settings class="w-5 h-5" />
                Notificaciones
              </RouterLink>
              <button
                @click="authStore.logout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10"
              >
                <LogOut class="w-5 h-5" />
                Cerrar Sesión
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-text-secondary hover:text-text-primary hover:bg-dark-surface"
                @click="isMenuOpen = false"
              >
                Iniciar Sesión
              </RouterLink>
              <RouterLink
                to="/registro"
                class="block w-full text-center btn-primary"
                @click="isMenuOpen = false"
              >
                Registrarse
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>
