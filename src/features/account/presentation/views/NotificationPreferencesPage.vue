<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/app/stores/authStore';
import { useUpdateNotifications } from '../composables/use-update-notifications';
import { BaseCard, BaseButton } from '@/shared/components/ui';
import { Bell, Mail, MessageCircle } from 'lucide-vue-next';

const authStore = useAuthStore();
const { loading, submit } = useUpdateNotifications();

const email = ref(authStore.user?.notifications.email ?? true);
const whatsapp = ref(authStore.user?.notifications.whatsapp ?? true);

const hasChanges = computed(() => {
  return (
    email.value !== (authStore.user?.notifications.email ?? true) ||
    whatsapp.value !== (authStore.user?.notifications.whatsapp ?? true)
  );
});

const handleSave = async () => {
  await submit({ email: email.value, whatsapp: whatsapp.value });
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-text-primary mb-6">
      Notificaciones
    </h2>

    <BaseCard>
      <div class="space-y-6">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Mail class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-text-primary mb-1">
                Notificaciones por Email
              </h3>
              <p class="text-text-secondary text-sm">
                Recibe confirmaciones de compra, tickets y noticias en tu email
              </p>
            </div>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="email" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-dark-surface-elevated peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary"></div>
            <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>

        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
              <MessageCircle class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-text-primary mb-1">
                Notificaciones por WhatsApp
              </h3>
              <p class="text-text-secondary text-sm">
                Recibe tu ticket y confirmaciones directamente en WhatsApp
              </p>
            </div>
          </div>

          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="whatsapp" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-dark-surface-elevated peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary"></div>
            <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>

        <div class="pt-4 border-t border-border">
          <BaseButton
            variant="primary"
            :disabled="!hasChanges"
            :loading="loading"
            @click="handleSave"
          >
            Guardar Configuración
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="mt-6 bg-blue-500/10 border-blue-500/20">
      <div class="flex items-start gap-4">
        <Bell class="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
        <div>
          <h4 class="font-semibold text-text-primary mb-2">
            ¿Por qué activar las notificaciones?
          </h4>
          <ul class="text-text-secondary text-sm space-y-1">
            <li>✓ Recibe tu ticket inmediatamente después de comprar</li>
            <li>✓ Te avisamos si ganas algún premio</li>
            <li>✓ Conoce primero sobre nuevos sorteos y promociones</li>
          </ul>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
