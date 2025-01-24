<script setup lang="ts">
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
</script>

<template>
  <nav id="navbar" class="navbar fixed-top navbar-expand-lg navbar-header navbar-mobile">
    <div class="navbar-container container">
      <!-- LOGO -->
      <navbar-brand />

      <button id="buttonNavMobile"
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fa fa-th-large" aria-hidden="true"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-around" id="navbarNav">
        <ul class="navbar-nav menu-navbar-nav">
          <nav-item v-for="(item, index) in menuItems"
            :key="index"
            :href="item.href"
            :linkNumber="item.linkNumber"
            :iconClass="item.iconClass"
            :linkText="item.linkText"
          >
            <template #linkNumber><i :class="item.iconClass" aria-hidden="true"></i></template>
          </nav-item>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a id="btnGetTickets" class="nav-link learn-more-btn large-btn text-center" href="#comprar">
              LISTA DE BOLETOS
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
