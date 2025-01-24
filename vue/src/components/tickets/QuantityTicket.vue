<script setup lang="ts">

</script>

<template>
  <div class="input-field col col-lg-12 s12 m12 text-center">
    <div class="plusminus horiz">
      <button id="btnMinus"></button>
      <div>
        <input id="ticketQty" type="number" name="productQty" value="1" min="1" max="100">
        <span class="ticket_name">BOLETO</span>
      </div>
      <button id="btnPlus"></button>
    </div>
  </div>
</template>

<style scoped>

</style>
