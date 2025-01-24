<script setup lang="ts"></script>

<template>
  <div id="containerSearch" class="mb-2">
    <button id="btnSearchTickets" style="display:none" class="magic_button show">
      <i class="fa fa-search" aria-hidden="true"></i> BUSCAR
    </button>

    <input id="inputSearchTicket" style="display:none" type="tel" class="validate invalid" maxlength="5">
    
    <button id="resetSearchTicket" class="magic_button" style="display:none" value="Reset">
      <i class="fa fa-times" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped></style>
