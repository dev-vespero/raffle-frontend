<script setup lang="ts">
import QuantityTicket from './QuantityTicket.vue'
import SearchButton from '../buttons/SearchButton.vue'
import RandomButton from '../buttons/RandomButton.vue'
</script>

<template>
  <div id="container-get-ticket" class="pricing-section">
    <div class="container pricing-container pricing-head">
      <article class="card">
        <div class="container">
          <div class="card-body container-payment">
            <div class="payment-type">
              <div class="pricing-title">
                <i class="fa fa-ticket fixleft" aria-hidden="true"></i>
                <i class="fa fa-ticket fixright" aria-hidden="true"></i>
                <h2><span id="formTitle">LISTA DE BOLETOS</span></h2>
              </div>

              <div id="new-purchase">
                <div id="containerBtnTickets" class="col-lg-12 mb-40">
                  <div class="row">
                    <quantity-ticket />
                  </div>
                </div>

                <div class="row">
                  <div class="col s12 m12 p0">
                    <div class="card-content">
                      <div class="row center text-center container_tickets_boxes">
                        <div class="col-12 s12 m6 p0">
                          <h6>
                            <search-button />
                            <br>
                            <random-button />
                          </h6>

                          <div id="lista" class="input-field col s12 containtickets">
                            <input type='hidden' id='current_page' />
                            <input type='hidden' id='show_per_page' />
                            
                            <div id="pagingBox">
                              <img class="loading" src="https://rifarito.s3.amazonaws.com/assets/loadingc.gif">
                            </div>

                            <div id='page_navigation'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col s12 m12 p0">
                    <div id="container_select_to_fixed" class="row center text-center container_selected" style="display: block">
                      <div class="col-12 s12 m6 p0">
                        <div id="btn_view_selected" class="btn_view_selected fa fa-chevron-up" style="display: none;" aria-hidden="true"></div>

                        <div class="info_fixed">
                          <div class="cards_fixed">
                            <strong class="text_selected_ticket">SELECCIONADOS</strong>
                            <strong id="textSeleccionados">0 de 1</strong>
                            <strong class="text_selected_ticket_bot" style="display: none;">SELECCIONADOS</strong>
                          </div>

                          <div class="cards_fixed containerContinue">
                            <button class="btn-large" id="continueForm" onclick="continueForm()" disabled>
                              <i class="fa fa-arrow-down" aria-hidden="true"></i> CONTINUAR
                            </button>
                          </div>
                        </div>
                        
                        <div id="numeros_seleccionados" class="input-field col s12 p0" style="display: none;"></div>
                        <div id="btn_view_selected_bot" class="btn_view_selected fa fa-chevron-down"
                          aria-hidden="true"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-12 mb-30 text-center">
            <button class="btn-large" id="continueFormFixed" onclick="continueForm()" disabled>
              <i class="fa fa-arrow-down" aria-hidden="true"></i> CONTINUAR
            </button>
          </div>
        </div>
      </article>

      <p class="text-center">
        <small class="gray">
          Centro de Ayuda: <i class="fa fa-whatsapp" aria-hidden="true"></i>
          <span class="phoneClient"></span>
        </small>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
