<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MapPin, Phone, Mail, Globe } from 'lucide-vue-next';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/motomotorifascom/' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Youtube', icon: Youtube, url: '#' },
  { name: 'LinkedIn', icon: Linkedin, url: '#' },
];

const footerLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Boletos', path: '/boletos' },
  { name: 'Verificar', path: '/verificar' },
  { name: 'Ganadores', path: '/ganadores' },
];

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-dark-surface border-t border-border">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <img
              src="https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png"
              alt="Logo"
              class="h-12 w-12 object-contain"
            />
            <span class="font-display font-bold text-xl text-text-primary">
              Moto Moto Rifas
            </span>
          </div>
          <p class="text-text-secondary text-sm mb-4">
            Participa y gana increíbles premios. ¡Tu suerte puede cambiar hoy mismo!
          </p>
          <div class="flex gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg bg-dark-surface-elevated text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <!-- Links -->
        <div>
          <h4 class="font-semibold text-text-primary mb-4">Navegación</h4>
          <ul class="space-y-2">
            <li v-for="link in footerLinks" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-text-secondary hover:text-primary transition-colors text-sm"
              >
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-text-primary mb-4">Contacto</h4>
          <ul class="space-y-3">
            <li class="flex items-center gap-3 text-text-secondary text-sm">
              <Phone class="w-4 h-4 text-primary" />
              <a href="tel:+584129753098" class="hover:text-primary transition-colors">
                +58 412-9753098
              </a>
            </li>
            <li class="flex items-center gap-3 text-text-secondary text-sm">
              <Mail class="w-4 h-4 text-primary" />
              <a href="mailto:info@motomotorifas.com" class="hover:text-primary transition-colors">
                info@motomotorifas.com
              </a>
            </li>
            <li class="flex items-center gap-3 text-text-secondary text-sm">
              <MapPin class="w-4 h-4 text-primary" />
              <span>Guatire, Miranda, Venezuela</span>
            </li>
            <li class="flex items-center gap-3 text-text-secondary text-sm">
              <Globe class="w-4 h-4 text-primary" />
              <a href="https://www.motomotorifas.com" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                www.motomotorifas.com
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Legal -->
        <div>
          <h4 class="font-semibold text-text-primary mb-4">Legal</h4>
          <ul class="space-y-2">
            <li>
              <a href="/legal/terms" class="text-text-secondary hover:text-primary transition-colors text-sm">
                Términos y Condiciones
              </a>
            </li>
            <li>
              <a href="/legal/privacy" class="text-text-secondary hover:text-primary transition-colors text-sm">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="/legal/responsibility" class="text-text-secondary hover:text-primary transition-colors text-sm">
                Responsabilidad
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom -->
      <div class="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-text-muted text-sm text-center md:text-left">
          © {{ currentYear }} Moto Moto Rifas. Todos los derechos reservados.
        </p>
        <p class="text-text-muted text-sm">
          Powered by <a href="https://www.rifarito.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Rifarito</a>
        </p>
      </div>
    </div>
  </footer>
</template>
