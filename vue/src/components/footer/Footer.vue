<script setup lang="ts"></script>

<template>
  <div class="footer-section">
    <div class="container footer-container">
      <div class="col-lg-3 col-md-6 footer-subsection">
        <h3 class="footer-subsection-title clientLegalName"></h3>
        <p class="footer-subsection-text clientDescription"></p>
      </div>
      <div class="col-lg-3 col-md-6 footer-subsection">
        <h3 class="footer-subsection-title">Secciones</h3>
        <div class="footer-social-media-menu-section">
          <a href="#home" class="footer-subsection-text">Inicio</a>
          <a href="#awards" class="footer-subsection-text awardsLink">Lista de Premios</a>
          <a href="#comprar" class="footer-subsection-text">Lista de Boletos</a>
          <a href="#tickets" class="footer-subsection-text">Verificar mis Boletos</a>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 footer-subsection">
        <h3 class="footer-subsection-title">Contacto</h3>
        <ul id="contactLinks" class="footer-subsection-list">
          <li class="webClient" style="display:none"><a href="#" class="linkWebClient"
              rel="nofollow noopener noreferrer" target="_blank"></a></li>
          <li><span class="clientLegalAddress"></span></li>
        </ul>
      </div>

      <div class="col-lg-3 col-md-6 footer-subsection">
        <div class="footer-subsection-2-2">
          <h3 class="footer-subsection-title">Síguenos</h3>
          
          <div class="footer-social-media-icons-section">
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="Facebook" class="footer-social-media-icon linkFacebook">
              <i class="fa fa-facebook"></i>
            </a>
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="Instagram" class="footer-social-media-icon linkInstagram">
              <i class="fa fa-instagram"></i>
            </a>
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="TikTok" class="footer-social-media-icon linkTiktok">
              <svg xmlns="http://www.w3.org/2000/svg" width="24"
                height="28" fill="currentColor" class="bi bi-tiktok" viewBox="0 0 16 16">
                <path
                  d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z">
                </path>
              </svg>
            </a>
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="Twitter" class="footer-social-media-icon linkTwitter">
              <i class="fa fa-twitter"></i>
            </a>
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="YouTube" class="footer-social-media-icon linkYoutube">
              <i class="fa fa-youtube-play"></i>
            </a>
            <a style="display:none" href="#" rel="nofollow noopener noreferrer" target="_blank" title="Linkedin" class="footer-social-media-icon linkLinkedin">
              <i class="fa fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="container footer-credits">
      <a href="https://www.rifarito.com" target="_blank" title="Sistema de Rifas">
        <img
          src="https://rifarito.s3.amazonaws.com/assets/rifaritowatermark-c.png"
          width="166"
          height="47"
          alt="Sistema de Rifas"
        />
      </a>
      <p>
        <span class="legalLinks">
          <a href="/legal/terms.html" target="_blank" rel="nofollow noopener noreferrer">Condiciones</a> | 
          <a href="/legal/privacy.html" target="_blank" rel="nofollow noopener noreferrer">Privacidad</a> |
          <a href="/legal/disclaimer.html" target="_blank" rel="nofollow noopener noreferrer">Responsabilidad</a>
        </span>
        
        <br />© 2024. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
