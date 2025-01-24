<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import NavbarBrand from './NavbarBrand.vue'
import NavItem from './NavItem.vue'

const menuItems = [
  {
    href: "#home",
    linkNumber: "Home",
    iconClass: "fa fa-home",
    linkText: "INICIO",
  },
  {
    href: "#tickets",
    linkNumber: "Buscar tus números",
    iconClass: "fa fa-check-circle",
    linkText: "VERIFICADOR",
  },
  {
    href: "#contacto",
    linkNumber: "WhatsApp Ayuda",
    iconClass: "fa fa-user-circle",
    linkText: "CONTACTO",
  },
];

const isScrolled = ref(false);
// const handleScroll = () => (isScrolled.value = window.pageYOffset > 0);
const handleScroll = () => (isScrolled.value = window.scrollY > 20);
onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const navbarCollapse = ref<HTMLButtonElement | null>(null);
const navbarExpanded = () => navbarCollapse.value?.classList.remove('show');
</script>

<template>
  <nav class="navbar fixed-top navbar-expand-lg" :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <!-- LOGO -->
      <navbar-brand />

      <button class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fa fa-th-large" aria-hidden="true"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-around" id="navbarNav" ref="navbarCollapse">
        <ul class="navbar-nav menu-navbar-nav">
          <nav-item v-for="(item, index) in menuItems"
            :key="index"
            :href="item.href"
            :linkNumber="item.linkNumber"
            :iconClass="item.iconClass"
            :linkText="item.linkText"
            @closed-navbar="navbarExpanded"
          >
            <template #linkNumber><i :class="item.iconClass" aria-hidden="true"></i></template>
          </nav-item>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link learn-more-btn large-btn text-center" href="#comprar" @click="navbarExpanded">
              LISTA DE BOLETOS
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  border-top: 0.6em solid var(--color-shadow);
  border-bottom: 0.6em solid var(--color-shadow);
}
.navbar {
  background-color: var(--color-primary);
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  transition: all .2s linear
}

.header-scrolled {
  box-shadow: 0 0.6em 0.9em 0 var(--color-shadow);
}

.header-scrolled {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background-color: var(--color-primary) !important
}

.navbar-toggler:not(:disabled):not(.disabled) {
  color: var(--color-secondary);
}

.navbar-toggler:not(:disabled):not(.disabled) {
  cursor: pointer;
  font-size: 32px;
  padding: 15px 28px !important
}

.navbar-toggler:focus,.navbar-toggler:hover {
  background-color: inherit
}

.navbar-nav {
  align-items: center
}

.navbar-nav:not(.menu-navbar-nav) .nav-item:last-of-type {
  margin-left: 0px !important;
  margin-right: 0px !important
}

.menu-navbar-nav {
  width: 100%;
  display: flex;
  justify-content: right
}

.learn-more-btn, button {
  background-color: var(--color-primary);
}

.learn-more-btn {
  box-shadow: 0 0 18px #c5010e4a;
}

.learn-more-btn:hover, button:hover {
  background-color: var(--color-important);
}

.learn-more-btn:hover {
  box-shadow: 0 0 18px var(--color-important-ex);
}

@media screen and (max-width: 991.98px) {
  .navbar {
    background-color:var(--color-primary)
  }

  .header-scrolled {
    height: auto
  }

  .navbar-expand-lg .navbar-nav .nav-link {
    padding-right: 0.5rem;
    padding-left: 0.5rem
  }

  .navbar-collapse {
    background-color: var(--color-primary);
    color: #000;
    padding-bottom: 20px;
    padding-top: 30px;
    margin-bottom: 20px
  }

  .navbar-collapse .nav-link-menu {
    color: #000
  }
}

@media screen and (max-width: 575.98px) {
  .navbar {
      padding-top:0;
      padding-bottom: 0
  }

  .menu-navbar-nav {
      padding-bottom: 10px
  }
}
</style>
