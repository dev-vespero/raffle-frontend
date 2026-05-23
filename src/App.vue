<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/app/stores/authStore';
import { useThemeStore } from '@/app/stores/themeStore';
import PublicLayout from '@/shared/components/layout/public-layout.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(() => {
  authStore.initAuth();
  themeStore.initTheme();
});

window.addEventListener('auth:unauthorized', () => {
  window.location.href = '/login';
});
</script>

<template>
  <PublicLayout />
</template>
