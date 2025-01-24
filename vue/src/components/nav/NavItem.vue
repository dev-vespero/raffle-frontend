<script setup lang="ts">
const emit = defineEmits(['closedNavbar']);

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  linkNumber: {
    type: String,
    required: true,
  },
  iconClass: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    required: true,
  }
});
  
const closeNavbar = () => emit('closedNavbar');
</script>

<template>
  <li class="nav-item">
    <a class="nav-link" :href="props.href" @click="closeNavbar">
      <p class="nav-link-number">{{ props.linkNumber }}</p>
      <p class="nav-link-menu">
        <slot name="icon"><i :class="props.iconClass" aria-hidden="true"></i></slot>  
        {{ props.linkText }}
      </p>
    </a>
  </li>
</template>

<style scoped>
:root {
  --color-primary: #FFD700;
  --color-shadow: #7bff00b9;
  --color-secondary: #0044ffb9;
}

.header-scrolled .nav-link-number {
  display: none
}

.navbar-expand-lg .navbar-nav .nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem
}

.navbar-expand-lg ul.menu-navbar-nav.navbar-nav a.nav-link:hover {
  background: #f4f4f4;
  border-radius: 12px
}

.nav-item {
  margin-left: 0;
  margin-right: 0
}

.nav-item .nav-link {
  text-align: right
}

.nav-item .nav-link:hover .nav-link-number {
  color: var(--color-secondary) !important;
}

.nav-item .nav-link:hover .nav-link-menu {
  color: var(--color-secondary) !important;
}
</style>
