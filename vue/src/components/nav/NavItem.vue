<script setup lang="ts">
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
  },
});
</script>

<template>
  <li class="nav-item">
    <a class="nav-link" :href="props.href">
      <p class="nav-link-number">{{ props.linkNumber }}</p>
      <p class="nav-link-menu">
        <slot name="icon"><i :class="props.iconClass" aria-hidden="true"></i></slot>  
        {{ props.linkText }}
      </p>
    </a>
  </li>
</template>

<style scoped>

</style>
