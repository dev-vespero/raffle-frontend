<script setup lang="ts"></script>

<template>
  <div class="navbar-brand">
    <a class="navbar-brand-logo" href="https://www.motomotorifas.com/">
      <img src="https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png"
        width="110px"
        height="110px"
        alt="Logo"
      >
    </a>
  </div>
</template>

<style scoped>
.header-scrolled .navbar-brand img {
  width: 122px;
  height: auto
}

.navbar-brand {
  display: flex;
  align-items: center;
  z-index: 1
}

.navbar-brand img {
  margin-left: 15px;
  width: 220px;
  height: auto
}

.navbar-brand-logo {
  position: relative
}

.navbar-brand-logo>img {
  position: absolute;
  top: -37px;
  left: 15px;
  width: 144px;
  border-radius: 18px;
  transition: all 0.5s ease
}

@media screen and (max-width: 991.98px) {
  .navbar-brand img {
    width: 100px;
    padding: 5px 0;
    left: 0 !important
  }

  .header-scrolled .navbar-brand img {
    width: 100px
  }
}
</style>
