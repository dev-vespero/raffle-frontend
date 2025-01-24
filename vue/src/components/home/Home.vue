<script setup lang="ts">
import ProgressContain from './ProgressContain.vue'

</script>

<template>
  <div class="header pb-5">
    <div class="container header-container">
      <div class="col-lg-6 header-img-section">
        <img id="raffleImage"
          alt="GANATE UNA SBR 6G 2025 0KM"
          src="https://rifarito.s3.amazonaws.com/uploads/raffle/image/3046/bnrrpost-ig.jpg"
          width="550"
          height="750"
        >
      </div>

      <div class="col-lg-6 offset-lg-0 header-title-section">
        <p class="header-subtitle">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span class="raffleDrawDate">24 FEB 2025</span> &#160
          <i class="fa fa-clock-o" aria-hidden="true"></i>
          <span class="raffleDrawHour">08:00 PM</span>
        </p>

        <progress-contain />

        <h1 id="raffleName" class="header-title mt-2">GANATE UNA SBR 6G 2025 0KM</h1>

        <span id="raffleDescription">
          <pre>
            PARTICIPA Y GANATE UNA SBR 6G 2025 0KM POR TAN SOLO 1.5$ CADA TICKET Y LO MEJOR DE TODO A TASA BCV.

            PREMIOS:
            🥇1ER LUGAR: SBR 6G 0KM 2025 🏍️
            🥈2DO LUGAR: 50$ 💴
            🥉3ER LUGAR: 2 CAMBIOS DE ACEITE PARA MOTO 150 CC

            ** CON COMPRAS MAYOR A 60$ EN NUESTRAS TIENDAS YA ESTARAS PARTICIPANDO.
            ** LA RIFA SERA REALIZADA AL TOTALIZAR LA VENTA DE LOS TICKETS
            ** FECHA PUBLICADA ESTA SUJETA A CAMBIOS POR LA VENTA DE LOS BOLETOS
          </pre>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
