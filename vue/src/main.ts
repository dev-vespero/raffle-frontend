import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

// Configurar Vue Query
const vueQueryConfig = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      },
    },
  },
};

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, vueQueryConfig);

app.mount('#app');
