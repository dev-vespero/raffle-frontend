import { raffleData } from "./constants.mjs";

let formBuyerData = new FormData();
let formPurchaseData = new FormData();
let formVoucherData = new FormData();
let currentPaymentType = {}
let buyerFoundData = {}
let purchaseWOPayFoundData = {}
let purchaseWOPayTotalAmount = 0
let ticket_qty = 1;
let priceTotal = 1;
let costByTicket = 0;
let imagePushed = false;
let nameFileDate = "";
let imageBlob = new Blob();
let total_promo_discount = 0;
let total_tickets_promo = 0;
let chipslibres = "";
let ticketsSelected = [];
let limitTicketsChoosen = 0;
let countTicketsSelected = 0;
let switchViewNumbers = false;
let loadRaffleTickets = false;
let participatingTickets = [];
let max_tickets_buy = 100;
let min_tickets_buy = 1;
let div_ticket_download = "";
let a_all_tickets = []
let hash_all_tickets = []
let number_of_pages = 0

let startTime, intervalPlusId, intervalMinusId

const contentChips = document.getElementById("pagingBox");
const numeros_seleccionados = document.getElementById("numeros_seleccionados");
const textSeleccionados = document.getElementById("textSeleccionados");
const resultTickets = document.getElementById("resultTickets");
const btn_upload_voucher = document.getElementById("btn_upload_voucher");

const container_fixed = document.getElementById('container_select_to_fixed');
const priceConvert = document.getElementById("priceConvert");
const container_element = document.getElementById('container-get-ticket');
const btn_view_selected = document.getElementById('btn_view_selected');
const btn_view_selected_bot = document.getElementById('btn_view_selected_bot');

window.addEventListener('scroll', () => {
  var rect = contentChips.getBoundingClientRect();
  var windowHeight = window.innerHeight;

  if (rect.bottom - 333 <= windowHeight && rect.bottom + 180 > windowHeight) {
    container_fixed.classList.add('fixed');
  } else {
    container_fixed.classList.remove('fixed');
  }
  const height_fixed = window.innerWidth < 600 ? 92 : 300
  if (rect.bottom + height_fixed <= windowHeight && rect.bottom + 1100 > windowHeight) {
    priceConvert.classList.add('pricefixed');
  } else {
    priceConvert.classList.remove('pricefixed');
  }
});

function continueForm () {
  if (numeros_seleccionados.style.display === "block") {
    toogleSelected()
  }
  $("#nombre").focus();
}

btn_view_selected.addEventListener('click', function (elmnt) { toogleSelected() });
btn_view_selected_bot.addEventListener('click', function (elmnt) { toogleSelected() });

function toogleSelected () {
  if (numeros_seleccionados.style.display === "none") {
    numeros_seleccionados.style.display = "block";
  } else {
    numeros_seleccionados.style.display = "none";
  }

  if (btn_view_selected.classList[2] == 'fa-chevron-up') {
    btn_view_selected.classList.remove('fa-chevron-up')
    btn_view_selected.classList.add('fa-chevron-down')
    btn_view_selected_bot.classList.remove('fa-chevron-down')
    btn_view_selected_bot.classList.add('fa-chevron-up')
  } else {
    btn_view_selected.classList.remove('fa-chevron-down')
    btn_view_selected.classList.add('fa-chevron-up')
    btn_view_selected_bot.classList.remove('fa-chevron-up')
    btn_view_selected_bot.classList.add('fa-chevron-down')
  }
}

const clientLogo = document.getElementById("clientLogo");
const montoTotalPrecio = document.getElementById("montoTotal");
const datosBanco = document.getElementById("datosBanco");
const banner = document.getElementById("banner");
const pagorealizado = document.getElementById("pagorealizado");
const cardmetodopago = document.getElementById("cardmetodopago");
const cardcantrifas = document.getElementById("cardcantrifas");
const btnrealizepago = document.getElementById("btnyarealizepago");
const step01 = document.getElementById("step01");
const step02 = document.getElementById("step02");
const msjerror = document.getElementById("msjerror");
const containimagenVoucher = document.getElementById("containimagenVoucher");
const montoCorrecto = document.getElementById("montoCorrecto");
const nameBuyer = document.getElementById("nombre");
const countryCode = document.getElementById("country_code");
const phoneBuyer = document.getElementById("celular");
const emailBuyer = document.getElementById("email");
const identificationBuyer = document.getElementById("identification");
const addressBuyer = document.getElementById("address");
const locationBuyer = document.getElementById("location");
const customFieldBuyer = document.getElementById("custom_field");
const notesPurchase = document.getElementById("notes");
const sellerBuyer = document.getElementById("seller");
const modalError = document.getElementById("modalError");
const modalSuccess = document.getElementById("modalSuccess");
const modalUseData = document.getElementById("modalUseData");
const modalTermsConds = document.getElementById("modalTermsConds");
const modalVoucher = document.getElementById("modalVoucher");
const modalMachine = document.getElementById("modalMachine");
const instanceError = M.Modal.init(modalError, {});
const instanceUseData = M.Modal.init(modalUseData);
const instanceTermsConds = M.Modal.init(modalTermsConds);
const instanceVoucher = M.Modal.init(modalVoucher);
const instanceSuccess = M.Modal.init(modalSuccess, { dismissible: false });
const instanceMachine = M.Modal.init(modalMachine, { dismissible: false });
const findPhone = document.getElementById("findPhone");
const msjRptaBusqueda = document.getElementById("msjRptaBusqueda");
const qrCode = document.getElementById("qrCode");

function showError (msj) {
  msjerror.innerHTML = msj
  instanceError.open()
}

function plusCountTickets () {
  startTime = Date.now();
  intervalPlusId = setInterval(function () {
    let pressDuration = (Date.now() - startTime) / 1;
    if (pressDuration > 400) $("#btnPlus").click();
  }, 50);
}
function minusCountTickets () {
  startTime = Date.now();
  intervalMinusId = setInterval(function () {
    let pressDuration = (Date.now() - startTime) / 1;
    if (pressDuration > 400) $("#btnMinus").click();
  }, 50);
}
$("#btnPlus").on("mousedown touchstart", function () {
  plusCountTickets()
});
$("#btnMinus").on("mousedown touchstart", function () {
  minusCountTickets()
});

$("#btnPlus").on("mouseup mouseout touchend touchleave", function () {
  clearInterval(intervalPlusId);
});
$("#btnMinus").on("mouseup mouseout touchend touchleave", function () {
  clearInterval(intervalMinusId);
});


(function ($) {
  $.fn.numberPicker = function () {
    var dis = 'disabled';
    return this.each(function () {
      var picker = $(this),
        m = picker.find('button:first-child'),
        p = picker.find('button:last-child'),
        input = picker.find('input'),
        min = parseInt(input.attr('min'), 10),
        // max = parseInt(input.attr('max'), 10),
        max = max_tickets_buy,
        inputFunc = function (picker) {
          var i = parseInt(input.val(), 10);
          $('.ticket_name').html(`${ticketName.toUpperCase()}${(i == 1) ? "" : "S"}`);
          if ((min == 1) && (max == 1)) {
            m.prop(dis, true);
            p.prop(dis, true);
          } else if ((i <= min) || (!i)) {
            input.val(min);
            m.prop(dis, true);
            p.prop(dis, false);
            clearInterval(intervalMinusId);
          } else if (i >= max) {
            input.val(max);
            m.prop(dis, false);
            p.prop(dis, true);
            clearInterval(intervalPlusId);
          } else {
            m.prop(dis, false);
            p.prop(dis, false);
          }
        },
        changeFunc = function (picker, quantity) {
          var q = parseInt(quantity, 10),
            i = parseInt(input.val(), 10);
          if ((i < max && (q > 0)) || (i > min && !(q > 0))) {
            input.val(i + q);
            inputFunc(picker);
          }
        };

      m.on('click', function () {
        let difference_number = limitTicketsChoosen - countTicketsSelected
        if (difference_number < raffleData.multiplier) {
          showError(`Tiene ${countTicketsSelected} ${ticketName}s elegidos, elimine ${raffleData.multiplier - difference_number} por favor.`);
          return
        }
        changeFunc(picker, -1);
        ticket_qty--;
        $("#continueForm").attr("disabled", (countTicketsSelected == 0 || countTicketsSelected < ticket_qty))
        calcMaxTicketSelect("decrease");
        calcTotalPrice("minus");
        printSelectedTickets();
      });

      p.on('click', function () {
        changeFunc(picker, 1);
        ticket_qty++;
        $("#continueForm").attr("disabled", (countTicketsSelected == 0 || countTicketsSelected < ticket_qty))
        calcMaxTicketSelect("increase");
        calcTotalPrice("plus");
        printSelectedTickets();
      });

      input.on('change', function () { inputFunc(picker); });
      inputFunc(picker); //init
    });
  };
}(jQuery));


calcMaxTicketSelect("increase")
setRaffle()
if (!raffleData.done_successfully) getAllTickets()
getPaymentTypes()
setPaymentTypes(configPaymentTypes)
$('.option-payment').on('click', function () { clicPaymentOption(this) });
changePaymentChoose()
calcTotalPrice("plus")
getSponsors()
getAwards()
setClient()

function getAllTickets () {
  $.ajax({
    url: `${baseUrl}raffles/${raffleData.token}/all_tickets`,
    type: 'GET',
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", tokenBearer);
    },
    dataType: 'json',
    success: function (tickets) {
      a_all_tickets = tickets
      setNumbers()
      if (raffleData.show_progress) calculateProgress();
      if (raffleData.modality == "percentage") calcDrawDate();
    },
    error: function (request, message, error) {
      handleException(request, message, error);
    }
  });
}

function buildFindPhone (token, phone) {
  return $.ajax({
    url: `${baseUrl}raffles/${configClient.raffleToken}/buyers/${phone}?token_recaptcha=${token}&recaptcha_group=${recaptchaGroup}`,
    type: 'GET',
    dataType: 'json',
    success: function (buyer) {
      buyerFoundData = buyer
      $("#resultTickets h5").show();
      buildNameStatsBuyer(buyer.name, buyer.phone, buyer.tickets.length);
      purchasesAddRow(buyer, null);
      instanceLoader.close();
    },
    error: function (request, message, error) {
      if (error == "Unauthorized") {
        showError("Ocurrió un error, reintentar por favor.")
      } else {
        showError("No registrado en el sistema.")
      }
      instanceLoader.close();
    }
  });
}

function buildFindTicket (token, ticket) {
  return $.ajax({
    url: `${baseUrl}raffles/${configClient.raffleToken}/tickets/${ticket}?token_recaptcha=${token}&recaptcha_group=${recaptchaGroup}`,
    type: 'GET',
    dataType: 'json',
    success: function (purchase) {
      $("#resultTickets h5").hide();
      purchasesAddRow(null, [purchase]);
      instanceLoader.close();
    },
    error: function (request, message, error) {
      if (error == "Unauthorized") {
        showError("Ocurrió un error, reintentar por favor.")
      } else {
        showError("No registrado en el sistema.")
      }
      instanceLoader.close();
    }
  });
}

function getRaffleTickets () {
  $('#randomNumberTicket').show();
  if (loadRaffleTickets) {
    shuffleTickets(participatingTickets);
    instanceLoader.close();
    return;
  }
  instanceLoader.open();
  $.ajax({
    url: `${baseUrl}raffles/${configClient.raffleToken}/tickets`,
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      loadRaffleTickets = true
      participatingTickets = response
      shuffleTickets(participatingTickets);
      instanceLoader.close();
    },
    error: function (request, message, error) {
      showError("Ocurrió un Error")
      instanceLoader.close();
    }
  });
}

function getAwards () {
  if (!listAwards || listAwards.length == 0) {
    $(".blog-section").hide();
    $(".awardsLink").hide();
  }
  else {
    setAwards(listAwards)
    setCarouselAwards(listAwards.length)
  }
}

function getSponsors () {
  if (!listSponsors || listSponsors.length == 0) {
    $(".clients-section").hide();
  }
  else {
    setSponsors(listSponsors)
    setCarouselSponsors(listSponsors.length)
  }
}

function getPaymentTypes () {
  currentPaymentType = configPaymentTypes[0]
  changeBtnToPayOnline()
}

function setClient () {
  if (raffleData.client.social.facebook) {
    $(".linkFacebook").attr("href", raffleData.client.social.facebook)
    $(".linkFacebook").show();
    // $(".linkMessenger").attr("href", `https://m.me/${raffleData.client.social.facebook.split("com/")[1]}` )
  }
  if (raffleData.client.social.instagram) {
    $(".linkInstagram").attr("href", raffleData.client.social.instagram)
    $(".linkInstagram").show();
  }
  if (raffleData.client.social.tiktok) {
    $(".linkTiktok").attr("href", raffleData.client.social.tiktok)
    $(".linkTiktok").show();
  }
  if (raffleData.client.social.twitter) {
    $(".linkTwitter").attr("href", raffleData.client.social.twitter)
    $(".linkTwitter").show();
  }
  if (raffleData.client.social.youtube) {
    $(".linkYoutube").attr("href", raffleData.client.social.youtube)
    $(".linkYoutube").show();
  }
  if (raffleData.client.social.linkedin) {
    $(".linkLinkedin").attr("href", raffleData.client.social.linkedin)
    $(".linkLinkedin").show();
  }
  if (raffleData.client.website) {
    $(".webClient").show();
    $(".linkWebClient").attr("href", raffleData.client.website)
    $(".linkWebClient").html(raffleData.client.website.split("//")[1])
  }
  setPhones()
  $(".clientLegalName").html(raffleData.client.name)
  $(".clientLegalId").html(raffleData.client.identification)
  $(".clientLegalAddress").html(raffleData.address)
  $(".clientDescription").html(raffleData.client.description)
}

function setPhones () {
  let phones = raffleData.phones.length > 0 ? raffleData.phones : raffleData.client.phones
  $(".phoneClient").html("+" + raffleData.country.code_phone + " " + + phones[0])
  $.each(phones, function (index, phone) {
    let listli = `<li>+${raffleData.country.code_phone} ${phone}</li>`
    let linkwhats = `https://wa.me/+${raffleData.country.code_phone}${phone}`
    let iconswhats = `<a href="${linkwhats}" rel="nofollow noopener noreferrer" target="_blank" class="whatsapp"><i class="fa fa-whatsapp"></i></a>`
    $("#contactLinks").append(listli)
    $("#linksfixed").append(iconswhats)
  })
}

function setNumbers () {
  if (a_all_tickets.length < raffleData.max_tickets_buy) {
    max_tickets_buy = a_all_tickets.length
  }
  else {
    max_tickets_buy = raffleData.max_tickets_buy
  }

  dibujarLibres(a_all_tickets, raffleData.show_used);
  $(".magic_button.show").show();
  $('.plusminus').numberPicker();
  if (a_all_tickets.length < 1) return setRaffleNoAvailableTickets();
  if (a_all_tickets.length < raffleData.min_tickets_buy) {
    min_tickets_buy = a_all_tickets.length
  }
  else {
    min_tickets_buy = raffleData.min_tickets_buy
  }
  for (var i = 0; i < min_tickets_buy - 1 && i < a_all_tickets.length - 1; i++) {
    $("#btnPlus").click();
  }
}
function setRaffle () {
  let name_social_up = raffleData.transmission.charAt(0).toUpperCase() + raffleData.transmission.slice(1);
  if (raffleData.custom_text.form_title) $("#formTitle").html(raffleData.custom_text.form_title)
  if (raffleData.custom_text.form_btn_random) $("#formBtnRandom").html(raffleData.custom_text.form_btn_random)
  if (raffleData.custom_text.form_option_send_after) $("#sendVoucherTextOption").html(raffleData.custom_text.form_option_send_after)
  if (raffleData.custom_text.form_lbl_voucher) $("#formLblVoucher").html(raffleData.custom_text.form_lbl_voucher)
  if (raffleData.custom_text.btn_get_tickets) $("#btnGetTickets").html(raffleData.custom_text.btn_get_tickets)
  if (raffleData.custom_text.modal_mgs_success) $("#modalMgsSuccess").html(raffleData.custom_text.modal_mgs_success)
  if (raffleData.voucher_wait_hours < 1) {
    $(".checkboxPayAfter").hide();
  }
  if (name_social_up == "Facebook") {
    $(".linkTransmission").attr("href", raffleData.client.social.facebook)
  } else if (name_social_up == "Instagram") {
    $(".linkTransmission").attr("href", raffleData.client.social.instagram)
  } else if (name_social_up == "Tiktok") {
    $(".linkTransmission").attr("href", raffleData.client.social.tiktok)
  } else if (name_social_up == "Youtube") {
    $(".linkTransmission").attr("href", raffleData.client.social.youtube)
  } else if (name_social_up == "Twitter") {
    $(".linkTransmission").attr("href", raffleData.client.social.twitter)
  } else if (name_social_up == "Website") {
    $(".linkTransmission").attr("href", raffleData.client.website)
  }
  $(".linkTransmission").html(name_social_up)
  $(".voucherWaitHours").html(raffleData.voucher_wait_hours)
  if (raffleData.price_unit == 0) $("#sectionAllPayments").hide()
  $(document.body).addClass(raffleData.color);
  $("#montoTotal").attr("data-original-title", raffleData.currency.name)
  if (raffleData.draw_is_today) $(".shuffle-section").show();
  if (raffleData.opportunities > 1) {
    $(".textOpportunities").show()
    $(".textSelectOpportunities").show()
    $(".quantityOpportunities").html(raffleData.opportunities)
  }
  if (raffleData.discount_rate || raffleData.discount_rate_increase) {
    $(".textDiscounts").show()
  }
  if (raffleData.free_ticket_promo > 1) {
    $(".textTicketPromos").show()
  }

  if (raffleData.client.extra_fields.identification) {
    let label_identification = raffleData.client.extra_fields.identification.label
    $(".extra_field_identification").show();
    if (raffleData.client.extra_fields.identification.required) {
      $("#identification").prop('required', true)
      label_identification += "*"
    }
    $("#label_identification").html(label_identification);
  }
  if (raffleData.client.extra_fields.notes) {
    let label_notes = raffleData.client.extra_fields.notes.label
    $(".extra_field_notes").show();
    if (raffleData.client.extra_fields.notes.required) {
      $("#notes").prop('required', true)
      label_notes += "*"
    }
    $("#label_notes").html(label_notes);
  }
  if (raffleData.client.extra_fields.email) {
    $(".extra_field_email").show();
    let label_email = raffleData.client.extra_fields.email.label;
    if (raffleData.client.extra_fields.email.required) {
      $("#label_email").prop('required', true)
      label_email += "*"
    }
    $("#label_email").html(label_email);
  }
  if (raffleData.client.extra_fields.location) {
    $(".extra_field_location").show();
    $("#label_location").html(raffleData.client.extra_fields.location.label);
  }
  if (raffleData.client.extra_fields.address) {
    $(".extra_field_address").show();
    $("#label_address").html(raffleData.client.extra_fields.address.label);
  }
  if (raffleData.client.extra_fields.custom) {
    $(".extra_field_custom").show();
    $("#label_custom_field").html(raffleData.client.extra_fields.custom.label);
  }
  if (raffleData.client.extra_fields.seller) {
    $(".extra_field_seller").show();
    $("#label_seller").html(raffleData.client.extra_fields.seller.label);
  }
  if (raffleData.terms) {
    if (raffleData.terms == "hide") {
      $(".labelPersonalData").hide();
    }
    else {
      $(".clientTermsConds").html(raffleData.terms);
      $(".labelClientTermsConds").show();
      $(".labelPersonalData").hide();
    }
  }
  printTextSeleccionados();
  printPlaceHolder();
  setQuestions(raffleData.questions);
  if (raffleData.done_successfully) { setRaffleSuccess(); return };
}
function calculateProgress () {
  $(".progress-contain").show()
  let progress = ((raffleData.on_quantity - a_all_tickets.length) * 100.00 / raffleData.on_quantity).toFixed(1)
  $(".progress-actual").css("width", `${progress}%`);
  $(".progress-percent").css("left", `${progress}%`);
  $(".progress-percent").html(`${progress}%`);
}

function setAwards (awards) {
  let countAwards = 0
  let mini_raffles = awards.map(award => award.draw_date)
  let filteredArray = mini_raffles.filter(function (e) { return e !== undefined })

  $.each(awards, function (index, award) {
    awardAddRow(index, award, filteredArray.length);
    countAwards += award.quantity
  });
  $("#cantAwards").html(countAwards)
}
function awardAddRow (index, award, awards_length) {
  $("#awardList").append(awardBuildTableRow(index, award, awards_length));
}
function awardBuildTableRow (index, award, awards_length) {
  let feature_award = ``
  let awardHeader = `<span class="btn"">${index + 1}</span>`
  let divsWinners = ``
  let titleWinners = "GANADOR"
  let evidenceLink = ``
  if (awards_length > 0) {
    awardHeader = `<span class="btn" data-toggle="tooltip" data-placement="bottom" title="${award.draw_hour}">Sorteo: ${award.draw_date_short}</span>`
  }
  if (award.featured) {
    feature_award = `<p class="featured_award"><i class="fa fa-star" aria-hidden="true"></i></p>`
  }

  $.each(award.winners, function (index, winner) {
    evidenceLink = winner.link ? `<a href="${winner.link}" rel="nofollow noopener noreferrer" target="_blank" class="link"><strong>VER</strong></a></p>` : ""
    divsWinners += `<p class="blog-post-text"><strong>${winner.name}</strong> </br>
                <strong># ${ticketName.toUpperCase()}:</strong> ${winner.number_ticket}</br>
                ${evidenceLink}`
  });
  if (award.winners.length > 1) {
    titleWinners += "ES"
  }
  let divAward = `
    <div class="col-lg-4 col-md-8 col-xs-10 blog-post-card-container">
      <div class="poppuler">
        ${awardHeader}
      </div>
      ${feature_award}
      <div class="blog-post-card">
        <div class="blog-post-icon">
          <img src="${award.photo.url}">
        </div>
        <h3 class="blog-post-title">(${award.quantity}) ${award.name}</h3>
        <pre class="blog-post-text">${award.description}</pre>
        ${award.sponsor != undefined ? `<a href='${award.sponsor.website}' target='_blank' class='blog-post-text mb-4 link_sponsor'>${award.sponsor.name} <i class='fa fa-external-link' aria-hidden='true'></i></a>` : ""}
        ${award.winners.length != 0 ? `<h3 class="blog-post-title">${titleWinners}</h3>` : ``} 
        ${divsWinners}
      </div>
    </div>
  `
  return divAward;
}

function setSponsors (sponsors) {
  $.each(sponsors, function (index, sponsor) {
    sponsorAddRow(sponsor);
  });
}
function sponsorAddRow (sponsor) {
  $("#sponsorList").append(sponsorBuildTableRow(sponsor));
}
function sponsorBuildTableRow (sponsor) {
  let divSponsor = `
    <div class="item client-logo-section">
      <a href="${sponsor.website}" target="_blank">
        <img src="${sponsor.logo.url}" alt="${sponsor.name}" title="${sponsor.name}">
      </a>
    </div>
  `
  return divSponsor;
}

function setPaymentTypes (paymentTypes) {
  $.each(paymentTypes, function (index, paymentType) {
    paymentTypeAddRow(index, paymentType);
  });
}
function paymentTypeAddRow (index, paymentType) {
  $("#container-payments").append(paymentTypeBuildTableRow(index, paymentType));
}
function paymentTypeBuildTableRow (index, paymentType) {
  let selected = ""
  if (index == 0) {
    selected = "selected"
  }
  let divPaymentType = `
    <div id="${paymentType.bank.var_name}-${paymentType.id}" data-id="${paymentType.id}" class="type option-payment ${selected}">
      <div class="logo">
          <img src="${paymentType.bank.logo.url}" width="86" alt="${paymentType.bank.name}">
      </div>
      <div class="text"></div>
    </div>
  `
  return divPaymentType;
}

function setQuestions (questions) {
  $.each(questions, function (index, question) {
    questionAddRow(question);
  });
  setAccordion();
}
function questionAddRow (question) {
  $("#questionList").append(questionBuildTableRow(question));
}
function questionBuildTableRow (question) {
  let divQuestion = `
    <button class="accordion">${question.name}</button>
    <div class="panel">
      <pre>${question.response}</pre>
    </div>
  `
  return divQuestion;
}

function createBuyer () {
  $.ajax({
    url: `${baseUrl}buyers`,
    type: 'POST',
    data: formBuyerData,
    contentType: false,
    processData: false,
    success: function (buyer) {
      getTokenFirebase('build_purchase', buyer);
    },
    error: function (request, message, error) {
      instanceLoader.close();
      showError(request.responseJSON.errors.filter((v, i, a) => a.indexOf(v) === i).join(", "));
    }
  });
}

function createPurchase (buyerToken) {
  $.ajax({
    url: `${baseUrl}buyers/${buyerToken}/purchases`,
    type: 'POST',
    data: formPurchaseData,
    contentType: false,
    processData: false,
    // dataType: "json",
    success: function (response) {
      instanceLoader.close();
      if (currentPaymentType.mode == "online") {
        execPayOnline(response.data.purchase.token)
      } else {
        instanceSuccess.open();
        if (response.data.purchase.file == null) {
          showMsjNoVoucher(response.data.purchase);
        }
        if (raffleData.client.redirect_whats) {
          optionRedirectWhats(response.data.purchase);
        }
      }
    },
    error: function (request, message, error) {
      instanceLoader.close();
      showError(request.responseJSON.errors.filter((v, i, a) => a.indexOf(v) === i).join(", "));
    }
  });
}

function updatePurchase (buyerToken, purchaseToken) {
  $.ajax({
    url: `${baseUrl}buyers/${buyerToken}/purchases/${purchaseToken}`,
    type: 'PATCH',
    data: formVoucherData,
    contentType: false,
    processData: false,
    success: function (purchase) {
      $("#titleSuccess").html("Voucher subido correctamente!")
      instanceLoader.close();
      instanceSuccess.open();
    },
    error: function (request, message, error) {
      instanceLoader.close();
      showError(request.responseJSON.errors.filter((v, i, a) => a.indexOf(v) === i).join(", "));
    }
  });
}

function msjMontoCorrecto () {
  let bankName = currentPaymentType.bank.name.toUpperCase()
  // priceTotal / raffleData.price_unit
  let amountLocal = `
  <strong>${bankName}: ${parsePriceCountry(priceTotal, "local")}</strong> (${ticket_qty} ${ticketName}${ticket_qty > 1 ? "s" : ""})
  `
  let amountInternat = `
  <strong data-toggle="tooltip" data-placement="bottom" data-original-title="${currentPaymentType.currency.name}" >Total: ${parsePriceCountry(priceTotal, "inter")}</strong> <small>(${ticket_qty} ${ticketName}${ticket_qty > 1 ? "s" : ""})</small>
  `
  montoCorrecto.innerHTML = amountLocal;
  priceConvert.innerHTML = amountInternat;
  $('[data-toggle="tooltip"]').tooltip({ html: true });
}

function calcTotalPrice (mode) {
  let promo_ticket_free = raffleData.free_ticket_promo
  let text_promo_free = ''
  priceTotal = ticket_qty * raffleData.price_unit

  if (raffleData.price_unit != 0) {
    priceTotal = calcDiscount(priceTotal, ticket_qty)
  }
  if (promo_ticket_free > 1) {
    if (ticket_qty % promo_ticket_free == 0 && mode == "plus") {
      let minusoneticket = calcDiscount(((ticket_qty - 1) * raffleData.price_unit), ticket_qty - 1)
      total_promo_discount += priceTotal - minusoneticket
      total_tickets_promo++
    }
    if (ticket_qty % promo_ticket_free == (promo_ticket_free - 1) && mode == "minus") {
      let moreoneticket = calcDiscount(((ticket_qty + 1) * raffleData.price_unit), ticket_qty + 1)
      let current_ticket = calcDiscount(((ticket_qty) * raffleData.price_unit), ticket_qty)
      total_promo_discount -= moreoneticket - current_ticket
      total_tickets_promo--
    }
  }
  priceTotal = priceTotal - total_promo_discount
  costByTicket = priceTotal / ticket_qty

  montoTotalPrecio.innerHTML = `Total: <span>${parsePriceCountry(priceTotal, "local")}</span>`

  text_promo_free = `${total_tickets_promo} ${ticketName}${total_tickets_promo != 1 ? "s ya son" : " ya es"}`
  $(".quantityTotalMultiplier").html(ticket_qty * raffleData.multiplier)
  $(".quantityTotalOpportunities").html(ticket_qty * raffleData.opportunities)
  $("#text_total_opportunities").html(ticket_qty * raffleData.opportunities)
  $(".quantityTotalTicketsPromos").html(text_promo_free)
  $("#costByTicket").html(parsePriceCountry(costByTicket, "local"))
  msjMontoCorrecto();
}

function calcDiscount (total_price, quantity) {
  let ticket_less = quantity - 1
  let discount_ticket_rate = ticket_less * raffleData.discount_rate
  let discount_increase = ticket_less * raffleData.discount_rate_increase
  if (ticket_less > raffleData.discount_max_tickets) {
    discount_increase = (raffleData.discount_max_tickets + 1) * raffleData.discount_rate_increase
  }
  return total_price - (discount_ticket_rate * discount_increase * 100 / raffleData.price_unit).toFixed(0)
}

function calcMaxTicketSelect (mode) {
  if (mode == "increase") {
    limitTicketsChoosen += raffleData.multiplier;
  } else if (mode == "decrease") {
    limitTicketsChoosen -= raffleData.multiplier;
  }
}

function parsePriceCountry (price, nation) {
  let country_code, currency_code, currencyDecimals, exchangeRate, currencyName
  // local inter
  currencyName = ""
  if (nation == "local") {
    country_code = raffleData.country.code
    currency_code = raffleData.currency.code
    currencyDecimals = raffleData.currency.decimals
    exchangeRate = 1
  }
  else if (nation == "inter") {
    country_code = currentPaymentType.currency.country_code
    currency_code = currentPaymentType.currency.code
    currencyDecimals = currentPaymentType.currency.decimals
    exchangeRate = currentPaymentType.exchange_rate
  }
  if (raffleData.country.code != currentPaymentType.currency.country_code && nation == "inter") {
    currencyName = currentPaymentType.currency.code
  }

  // return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price);
  let languageCountryCode = `es-${country_code}`

  try {
    return new Intl.NumberFormat(languageCountryCode, { style: 'currency', currency: currency_code, maximumFractionDigits: currencyDecimals }).format(price * exchangeRate) + " " + currencyName;
  } catch (e) {
    return new Intl.NumberFormat(languageCountryCode, { style: 'currency', currency: currency_code }).format(price * exchangeRate) + " " + currencyName;
  }
}

function setDemo () {
  let htmldemo = `<div class="confidential-watermark" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999;opacity: 0.2;pointer-events: none;"><p style="font-size: 3em;color: #383838;background: #fff;border-radius: 11px;padding: 9px;font-weight: bold;transform: rotate(-45deg);white-space: nowrap;">SITIO WEB DE PRUEBAS</p></div>`;
  $("#raffleDescription").prepend(htmldemo);
}

function openVerMisTickets () {
  instanceSuccess.close();
  findPhone.value = phoneBuyer.value || buyerFoundData.phone;
  searchBuyer(findPhone.value)
  resetTodo();
}

function clicPaymentOption (my_object) {
  var option_id = $(my_object).attr('data-id')
  currentPaymentType = configPaymentTypes.find(payment => payment.id == option_id)
  changePaymentChoose();
  $('.option-payment').removeClass("selected");
  my_object.classList.add("selected");
  if (configPaymentTypes.find(payment => payment.mode == "online")) {
    changeBtnToPayOnline();
  }
}

function changeBtnToPayOnline () {
  if (currentPaymentType.mode == "online") {
    $(".containerAllVoucher").hide();
    $('#checkboxPayAfter').prop("checked", true);
  }
  else {
    $(".containerAllVoucher").show();
    $('.s-voucher').show()
    $('#checkboxPayAfter').prop("checked", false);
  }
}

function execPayOnline (purchase_token) {
  instanceLoader.open();
  let formPayData = new FormData();
  let url = window.location.href.split(/\?|#/)[0]
  formPayData.append('url', url);
  formPayData.append('purchase_token', purchase_token);
  formPayData.append('bank', currentPaymentType["bank"]["var_name"]);
  $.ajax({
    url: `${baseUrl}payment_intents`,
    type: 'POST',
    data: formPayData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.data.type == 'GET') {
        window.location.href = response.data.url;
      }
      else if (response.data.type == 'POST') {
        buildExecFormPayOnline(response.data)
      }
    },
    error: function (request, message, error) {
      instanceLoader.close();
      console.error(request.responseJSON.errors);
      showError("Ocurrió un error con la Pasarela de Pagos, por favor vuelva a intentar el pago o comuníquese a Soporte.");
      // handleException(request, message, error);
    }
  });
}

function buildExecFormPayOnline (data) {
  let form = document.createElement('form');
  form.method = 'POST';
  form.action = data.url;
  form.style.display = 'none';

  let data_params = data.params;
  for (var key in data_params) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data_params[key];
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

function changePaymentChoose () {
  let icon_type_account = `<i class="help-account fa fa-${currentPaymentType.type_account == "personal" ? "user" : "university"}" aria-hidden="true"></i>`
  let text_type_account = currentPaymentType.type_account == "personal" ? "Personal" : "de Empresa"
  let image_qr = currentPaymentType.image ? `<img src="${currentPaymentType.image.url}" alt="Imagen" width="320" height="320">` : ""

  let data_interbank = ``
  if (currentPaymentType.interbank) {
    data_interbank = `
    <span class="nameAccountNumber">${currentPaymentType.interbank_alias}</span>
    <h3 class="interbankNumber">${transformLink(currentPaymentType.interbank)} ${genButtonCopyLink(currentPaymentType.mode, currentPaymentType.interbank)}</h3>
    `
  }
  let data_link = ``
  if (currentPaymentType.link) {
    data_link = `
      <span class="nameAccountNumber">${currentPaymentType.link_alias}</span>
      <h3 class="interbankNumber">${transformLink(currentPaymentType.link)} ${genButtonCopyLink(currentPaymentType.mode, currentPaymentType.link)}</h3>
      `
  }
  datosBanco.innerHTML = `
  <div>
    <h6>
      <span data-toggle="tooltip" data-placement="bottom" title="${currentPaymentType.bank.description}">${currentPaymentType.bank.name}</span>
      <span data-toggle="tooltip" data-placement="bottom" title="Cuenta ${text_type_account}">${icon_type_account}</span>
    </h6>
  </div>
  <div>
    ${image_qr}
    <span class="nameAccountNumber"><i class="fa fa-${currentPaymentType.icon}" aria-hidden="true"></i> ${currentPaymentType.number_alias || ""}</span>
    <h3>${transformLink(currentPaymentType.number)} ${genButtonCopyLink(currentPaymentType.mode, currentPaymentType.number)}</h3>
    ${currentPaymentType.interbank ? data_interbank : ""}
    ${currentPaymentType.link ? data_link : ""}
  </div>
  <div class="titularBank"><span>TITULAR</span>${currentPaymentType.owner}</div>
  <div class="payment-notes"><b>${currentPaymentType.notes || ""}</b></div>
  `;
  msjMontoCorrecto();
}

function transformLink (text) {
  if (text.split("//")[1]) {
    return `<a href="${text}" target="_blank" rel="nofollow noopener noreferrer">${text.split("/")[2]}</a>`
  }
  return text
}

function validURL (url) {
  let regex = /^(https?:\/\/)?(www\.)?[\w\.-]+\.\w{2,}(\/\S*)?$/;
  return regex.test(url);
}

function genButtonCopyLink (mode, text) {
  if (mode == "online") return ''
  let type_btn = {
    title: 'Copiar',
    icon: 'files-o',
    type: 'copy'
  }
  if (text.split("//")[1]) {
    type_btn.title = 'Ir al Enlace'
    type_btn.icon = 'external-link'
    type_btn.type = 'link'
  }
  return `<button onClick="actionButtonAccounts('${type_btn.type}', this, '${text}')" class="magic_button" data-toggle="tooltip" data-placement="top" title='${type_btn.title}'><i class="fa fa-${type_btn.icon}" aria-hidden="true"></i></button>`
}

function readfiles (files) {
  var existinginputs = document.getElementsByName('images[]');
  while (existinginputs.length > 0) {
    form.removeChild(existinginputs[0]);
  }

  for (var i = 0; i < files.length; i++) {
    processfile(files[i]); // process each file at once
  }
  fileinput.value = "";
}

function processfile (file) {
  if (!(/image/i).test(file.type)) {
    alert("File " + file.name + " is not an image.");
    return false;
  }
  var reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = function (event) {
    var blob = new Blob([event.target.result]);
    var myURL = window.URL || window.webkitURL;
    let blobURL = myURL.createObjectURL(blob);

    let image = new Image();
    image.src = blobURL;

    image.onload = function () {
      let resized = resizeMeToBlob(image);
      const contentType = 'image/jpg';
      const b64Data = resized.split(",")[1];
      imageBlob = base64toBlob(b64Data, contentType);
      nameFileDate = new Date().getTime() + ".jpg";
      containimagenVoucher.innerHTML = '<img src="' + resized + '">';
      resizeSmallUploadContainer()
      imagePushed = true
    }
  };
}

function resizeMeToBlob (img) {
  var canvas = document.createElement('canvas');
  var width = img.width;
  var height = img.height;
  if (width > height) {
    if (width > max_width) {
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

const base64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function resizeSmallUploadContainer () {
  $('#container_voucher_up').removeClass("col-lg-12");
  $('#container_voucher_up').addClass("col-lg-6");
}
function resizeBiggUploadContainer () {
  $('#container_voucher_up').addClass("col-lg-12");
  $('#container_voucher_up').removeClass("col-lg-6");
}

function buildNameStatsBuyer (buyerName, buyerPhone, numberTickets) {
  let urlBuyer = window.location.href.split(/\?|#/)[0] + "#" + buyerPhone
  // let qrCodeImage = `https://chart.googleapis.com/chart?chs=120x120&cht=qr&choe=UTF-8&chl=${encodeURIComponent(urlBuyer)}&chld=L|2`
  let qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(urlBuyer)}`

  qrCode.src = qrCodeImage;
  msjNombre.innerHTML = buyerName;
  msjRptaBusqueda.innerHTML = "Números en total: " + (numberTickets * raffleData.opportunities) + "";
}

function purchasesAddRow (buyer, purchases) {
  if (purchases == null) {
    purchases = sortArrPurchases(buyer.purchases)
  }
  $("#numbersContain").html("");
  $("#ticketsContain").html("");

  for (var i = 0; i < purchases.length; i++) {
    $("#numbersContain").append('<div class="chip misticketsson ">' + generateAllNumbers(purchases[i].tickets, 'web') + '</div>');
    if (buyer) {
      let linkTicketPrint = `<div class="minibtn"><a data-toggle="tooltip" data-placement="top" title="Versión para Imprimir" class="btn btn-invert" href="/printing/${purchases[i].token}" target="_blank"><i class="fa fa-print" aria-hidden="true"></i> Imprimir</a></div>`
      if (purchases[i].status == "no_voucher") {
        let link_send_whatsapp = urlSendTicketsWhatsApp(purchases[i])
        let btn_up_voucher = `<p id="btn_upload_voucher" class="mt-1">
                   <a class="pay-purchase btn-invert btn m-1" onClick="activateUploadVoucher('${purchases[i].token}')" href="#comprar" data-toggle="tooltip" data-placement="top" title="Completar el Pago"><i class="fa fa-upload" aria-hidden="true"></i> Pagar</a>
                   <a class="link-voucher-whatsApp btn-invert btn m-1" href="${link_send_whatsapp}" target="_blank" rel="nofollow noopener noreferrer" data-toggle="tooltip" data-placement="top" title="Reenviar a WhatsApp"><i class="fa fa-whatsapp fa-lg" aria-hidden="true"></i> Reenviar</a>
                 </p>`
        $("#ticketsContain").append(btn_up_voucher);
      }
      $("#ticketsContain").append(`<div id="container-minibtn-ticket"> ${linkTicketPrint}</div>`);
    }
    $.each(purchases[i].tickets, function (index, ticket) {
      $("#ticketsContain").append(drawTicket(purchases[i], ticket, buyer));
    });
  };

  $('[data-toggle="tooltip"]').tooltip({ html: true });
  resultTickets.style.display = "block";
  var element_to_scroll_to = document.getElementById('tickets');
  element_to_scroll_to.scrollIntoView();
}

function downloadTicket (div_id, btn_download_id) {
  let btn_download = document.getElementById(btn_download_id);
  btn_download.disabled = true;
  setTimeout(function () {
    btn_download.disabled = false;
  }, 5000);
  let div_ticket = document.getElementById(div_id);
  html2canvas(div_ticket, {
    allowTaint: true,
    useCORS: true
  }).then(function (canvas) {
    let now = new Date();
    let formattedDateTime = now.toISOString().replace(/[\-T:]/g, '').slice(0, -5);
    let div_ticket_download = document.createElement('a');
    div_ticket_download.href = canvas.toDataURL();
    div_ticket_download.download = 'boleto_' + formattedDateTime + '.png';
    div_ticket_download.click();
  });
}

function sortArrPurchases (purchases) {
  return purchases.sort(function (a, b) {
    let dateA = new Date(a.created_at);
    let dateB = new Date(b.created_at);
    if (dateA < dateB) {
      return 1;
    } else if (dateA > dateB) {
      return -1;
    }
    let timeA = dateA.getTime();
    let timeB = dateB.getTime();
    if (timeA < timeB) {
      return 1;
    } else if (timeA > timeB) {
      return -1;
    }
    return 0;
  });
}

function drawTicket (purchase, ticket, buyer) {
  let linkDownloadTicket = ''
  if (buyer) {
    linkDownloadTicket = `<div class="minibtn_download mb-1">
    <button id="btnDownload-${ticket}" onClick="downloadTicket('widgetTicketDownload-${ticket}', 'btnDownload-${ticket}')" data-toggle="tooltip" data-placement="top" title="Descargar Boleto" class="btn btn-invert download-button"><i class="fa fa-download" aria-hidden="true"></i></button></div>`
  }
  let datetime = purchase.created_at_time_zone.split(".")[0].split("T")
  let time = `${datetime[0]} ${datetime[1]}`
  let icon_status = "exclamation-triangle"
  let text_status = `Reservado`
  let css_hide = raffleData.modality == "percentage" ? "nodisplay" : ""
  let color = ''
  let span_status
  let span_location = purchase.location ? `<span><i class="fa fa-globe" aria-hidden="true"></i> ${purchase.location}</span>` : ''
  let format_notes = purchase.notes ? purchase.notes.replace(/\r\n/g, '<br>') : ''
  let span_notes = purchase.notes ? `<span data-toggle="tooltip" data-placement="bottom" title="${format_notes}"><i class="fa fa-file-text" aria-hidden="true"></i> Notas</span>` : ''

  if (purchase.status == 'verified') {
    icon_status = "check-circle"
    text_status = "Pago Verificado"
  }
  else if (purchase.status == 'unverified') {
    icon_status = "clock-o"
    text_status = "Verificación Pendiente"
  } else {
    if (raffleData.voucher_wait_hours != 0 && purchase.remaining_hours < 2) {
      text_status = `Reservado`
      color = 'orange'
    }
    if (raffleData.voucher_wait_hours != 0 && purchase.remaining_hours < 1) {
      text_status = `Reservado`
      color = 'orange'
    }
  }
  span_status = `<span class="ticket_status ${color}"><i class="fa fa-${icon_status}" aria-hidden="true"></i> ${text_status}</span>`
  // let tickets_str = generateAllNumbers(purchase.tickets, 'web')

  let extra_numbers = ''
  if (raffleData.opportunities > 1) {
    extra_numbers = "(" + genExtraNums(raffleData.digits, raffleData.start_number_on, raffleData.end_number_on, ticket, raffleData.opportunities).join(", ") + ")"
  }

  let size_number = 22
  if (extra_numbers.length > 50) {
    size_number = 18
  } else if (extra_numbers.length > 30) {
    size_number = 20
  }

  return `
  <div class="container_ticket">
  ${linkDownloadTicket}
  <widget id="widgetTicketDownload-${ticket}" type="ticket" class="--flex-column">
    <div class="top --flex-column container_banner">
      <div class="buy" data-toggle="tooltip" data-placement="bottom" title="${ticketName.toUpperCase()} ${purchase.mode == "online" ? "DIGITAL" : "IMPRESO"}"><i class="fa fa-${purchase.mode == "online" ? "globe" : "ticket"}" aria-hidden="true"></i></div>
      <div class="status ${color}" data-toggle="tooltip" data-placement="bottom" title="${text_status}"><i class="fa fa-${icon_status}" aria-hidden="true"></i></div>
      <div class="bandname -bold"><img src="${raffleData.client.logo.url}?cross" crossorigin="anonymous" alt="Logo" width="55" height="55"><br />
        ${raffleData.client.name}<br />
      </div>
      <div class="tourname">${raffleData.name}</div>
      <div class="imagenfondo"><img src="${raffleData.image.url}?cross" crossorigin="anonymous" alt="Banner" width="280" height="330"></div>
      <div id="nombres" class="nombres">
        ${span_status}
        ${span_location}
        <span><i class="fa fa-user-circle" aria-hidden="true"></i> ${purchase.name}</span>
        <span><i class="fa fa-whatsapp fa-lg" aria-hidden="true"></i>${purchase.phone_code} ${purchase.phone}</span>
        <span><i class="fa fa-calendar" aria-hidden="true"></i> ${time}</span>
        ${span_notes}
      </div>
      <div class="deetz --flex-row-j!sb">
        <div class="ticket-date ${css_hide} event --flex-column">
          <div class="date -bold">${raffleData.draw_date_short}</div>
        </div>
        <div class="ticket-date ${css_hide} --flex-column">
          <div class="cost -bold">${raffleData.draw_hour}</div>
        </div>
      </div>
    </div>
    <div class="rip"></div>
    <div class="bottom --flex-row-j!sb">
      <strong style="font-size:${size_number}px"><b>${ticket}</b>${extra_numbers}</strong>
    </div>
  </widget>
</div>
  `
}

function generateAllNumbers (list_tickets, platform) {
  let all_tickets = ""
  let open_tag = ''
  let close_tag = ''
  if (raffleData.opportunities > 1) {
    if (platform == 'web') {
      open_tag = '<b>'
      close_tag = '</b>'
    } else if (platform == 'whatsapp') {
      open_tag = '*'
      close_tag = '*'
    }
  }
  $.each(list_tickets, function (index, ticket) {
    all_tickets += open_tag + ticket + close_tag
    if (raffleData.opportunities > 1) {
      let extras_numbers = genExtraNums(raffleData.digits, raffleData.start_number_on, raffleData.end_number_on, ticket, raffleData.opportunities)
      if (platform == 'web') {
        all_tickets += "(" + extras_numbers.join(", ") + "), "
      } else if (platform == 'whatsapp') {
        all_tickets += "(" + extras_numbers.join(", ") + "), \n"
      }
    }
    else {
      all_tickets += ", "
    }
  });
  if (all_tickets.length > 0) {
    all_tickets = all_tickets.slice(0, -2);
  }
  return all_tickets
}

function changeViewTicket () {
  if (switchViewNumbers) {
    $('#ticketsContain').fadeIn();
    $('#numbersContain').fadeOut();
  }
  else {
    $('#ticketsContain').fadeOut();
    $('#numbersContain').fadeIn();
  }
  switchViewNumbers = !switchViewNumbers
}

findPhone.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBuyer(findPhone.value)
  }
});

function searchBuyer (buyerPhone = findPhone.value) {
  let size_ticket = raffleData.digits
  let is_ticket = buyerPhone.length == size_ticket
  if (buyerPhone == "") {
    showError("Porfavor escriba su número de celular.");
    return;
  }
  else if (buyerPhone.length < 8) {
    if (buyerPhone.length != size_ticket) {
      showError(`Porfavor escriba un ${ticketName} de ${size_ticket} dígitos.`);
      return;
    }
  }
  else if (buyerPhone.length > 15) {
    showError("Porfavor ingrese un celular válido.");
    return;
  }
  msjNombre.innerHTML = "";
  msjRptaBusqueda.innerHTML = "";
  resultTickets.style.display = "none";
  // btn_upload_voucher.style.display = "none";
  instanceLoader.open();
  if (is_ticket) {
    getTokenFirebase("build_find_ticket", buyerPhone)
  }
  else {
    getTokenFirebase("build_find_phone", buyerPhone)
  }
}

function printTextSeleccionados () {
  textSeleccionados.innerHTML = `${countTicketsSelected} de ${limitTicketsChoosen}`;
}

function printPlaceHolder () {
  let holder = ""
  for (let i = 0; i < limitTicketsChoosen; i++) {
    holder += '<div class="chip unselected_number">_ _ _</div>';
  }
  numeros_seleccionados.innerHTML = holder;
}

function resetTodo () {
  $("i.fa-times.close").click();
  formBuyerData = new FormData();
  formPurchaseData = new FormData();
  formVoucherData = new FormData();
  imageBlob = new Blob();
  imagePushed = false;
  containimagenVoucher.innerHTML = '';
  resizeBiggUploadContainer();
  containimagenVoucher.style.display = "none";
  nameBuyer.value = '';
  phoneBuyer.value = '';
}
function setRaffleSuccess () {
  resetTodo();
  $("#container-get-ticket").remove();
  $("#btnBuyTicket").remove();
  $("#btnGetTickets").attr("href", "#")
  $("#btnGetTickets").html("FINALIZADO")
}

function setRaffleNoAvailableTickets () {
  resetTodo();
  $("#container-get-ticket").remove();
  $("#btnBuyTicket").remove();
  $("#btnGetTickets").attr("href", "#")
  $("#btnGetTickets").html(`${ticketName.toUpperCase()}s AGOTADOS`)
}

function showMsjNoVoucher (purchase) {
  let link_msj = urlSendTicketsWhatsApp(purchase)
  $("#msgTimeVoucherUpload").show();
  $(".linkCustomWhatsApp").attr("href", link_msj)
}

function optionRedirectWhats (purchase) {
  let link_msj = urlSendTicketsWhatsApp(purchase)
  $("#btnSuccessModal").hide();
  $("#msgTimeVoucherUpload").hide();
  $("#msgRedirectWhats").show();
  $(".linkCustomWhatsApp").attr("href", link_msj)
  let time = 4
  let counter = setInterval(function () {
    if (time === 0) {
      clearInterval(counter);
    }
    $("#timerRedirect").html(time.toString())
    time--
  }, 1000);

  setTimeout(function () {
    window.location.href = link_msj;
  }, 4000);
}

function urlSendTicketsWhatsApp (purchase) {
  // $("#log").append("<br>build voucher ")
  let datetime = purchase.created_at_time_zone.split(".")[0].split("T")
  let url = (window.location.href.split(/\?|#/)[0]) + "#" + purchase.phone
  let tickets = generateAllNumbers(purchase.tickets, 'whatsapp')
  let text_in = raffleData.custom_message_whatsapp
  text_in = text_in.replace(/\*\|buyer_name\|\*/g, purchase.name)
  text_in = text_in.replace(/\*\|buyer_phone\|\*/g, (purchase.phone_code + purchase.phone))
  text_in = text_in.replace(/\*\|purchase_date\|\*/g, datetime[0])
  text_in = text_in.replace(/\*\|purchase_hour\|\*/g, datetime[1])
  text_in = text_in.replace(/\*\|total_tickets\|\*/g, purchase.tickets.length)
  text_in = text_in.replace(/\*\|amount\|\*/g, parsePriceCountry(purchase.amount, "local"))
  text_in = text_in.replace(/\*\|tickets\|\*/g, tickets)
  text_in = text_in.replace(/\*\|raffle_name\|\*/g, raffleData.name)
  text_in = text_in.replace(/\*\|url\|\*/g, url)
  text_in = encodeURIComponent(text_in)
  let phones = raffleData.phones.length > 0 ? raffleData.phones : raffleData.client.phones
  phone = phones[phones.length * Math.random() | 0]
  return `https://api.whatsapp.com/send?phone=${raffleData.country.code_phone}${phone}&text=${text_in}`
}

function paddy (num, padlen) {
  let pad = new Array(1 + padlen).join('0');
  return (pad + num).slice(-pad.length);
}

function dibujarLibres (availableTickets, show_used) {
  let chipslibres = ""
  if (!show_used) { // hide used
    $.each(availableTickets, function (index, ticket) {
      hash_all_tickets.push({
        ticket: ticket,
        selected: false,
        used: false
      })
    });
  }
  else { // show used
    const availables_set = new Set(availableTickets)

    for (let i = raffleData.start_number_on; i <= raffleData.end_number_on; i++) {
      const ticket_string = paddy(i, raffleData.digits)
      hash_all_tickets.push({
        ticket: ticket_string,
        selected: false,
        used: !availables_set.has(ticket_string)
      })
    }
  }

  var show_per_page = 0;
  if ($(window).width() < 601) { // mobile /6 / 5
    if (hash_all_tickets.length <= 2500) show_per_page = 2040
    else if (hash_all_tickets.length <= 15000) show_per_page = 1020
    else show_per_page = 2040
  }
  else { // desktop
    if (hash_all_tickets.length <= 2500) show_per_page = 2010
    else if (hash_all_tickets.length <= 15000) show_per_page = 1005
    else show_per_page = 2010
  }
  if (!show_used) { // hide used
    number_of_pages = Math.ceil(availableTickets.length / show_per_page);
  }
  else { // show used
    number_of_pages = Math.ceil(raffleData.on_quantity / show_per_page);
  }

  if (number_of_pages == 1) { $("#page_navigation").hide() }
  $('#current_page').val(0);
  $('#show_per_page').val(show_per_page);

  var navigation_html = '<button onclick="go_to_page(0);" class="btn-large waves-effect prev prevfirst"><i class="fa fa-angle-double-left" aria-hidden="true"></i></button> ';
  navigation_html += '<button onclick="previous();" class="btn-large waves-effect prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button> ';
  navigation_html += '<small><strong id="number_page_current">Pag: 1/' + number_of_pages + '</strong></small> ';
  navigation_html += '<button onclick="next();" class="btn-large waves-effect next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>';
  navigation_html += '<button onclick="go_to_page(' + (number_of_pages - 1) + ');" class="btn-large waves-effect next nextlast"><i class="fa fa-angle-double-right" aria-hidden="true"></i></button>';

  $('#page_navigation').html(navigation_html);
  $('#page_navigation .page_link:first').addClass('active_page');

  let object_tickets = hash_all_tickets.slice(0, show_per_page);

  $.each(object_tickets, function (index, obj_ticket) {
    let chip_used = obj_ticket.used ? "used" : ""
    chipslibres += '<div id="' + obj_ticket.ticket + '" class="chip ' + chip_used + '" onclick="selectChip(this)">' + obj_ticket.ticket + '</div>';
  });

  contentChips.innerHTML = chipslibres;
}

//Pagination JS
function previous () {
  let new_page = parseInt($('#current_page').val()) - 1;
  if (new_page < 0) return
  go_to_page(new_page);
}
function next () {
  let new_page = parseInt($('#current_page').val()) + 1;
  if (new_page >= number_of_pages) return
  go_to_page(new_page);
}
function go_to_page (page_num) {
  var show_per_page = parseInt($('#show_per_page').val());
  let start_from = page_num * show_per_page;
  let end_on = start_from + show_per_page;
  let object_tickets = hash_all_tickets.slice(start_from, end_on);
  let chipslibres = ""
  $.each(object_tickets, function (index, obj_ticket) {
    let select_css = obj_ticket.selected ? "selected" : ""
    let chip_used = obj_ticket.used ? "used" : ""
    chipslibres += '<div id="' + obj_ticket.ticket + '" class="chip ' + chip_used + ' ' + select_css + '" onclick="selectChip(this)">' + obj_ticket.ticket + '</div>';
  });
  contentChips.innerHTML = chipslibres;
  let text_current_page = `Pag: ${(page_num + 1)}/${number_of_pages}`
  $('#number_page_current').html(text_current_page);
  $('#pagingBox').scrollTop(0);
  $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');
  $('#current_page').val(page_num);
}

function go_to_search (hash_tickets, page_num) {
  let chipslibres = ""
  $.each(hash_tickets, function (index, obj_ticket) {
    let select_css = obj_ticket.selected ? "selected" : ""
    let chip_used = obj_ticket.used ? "used" : ""
    chipslibres += '<div id="' + obj_ticket.ticket + '" class="chip ' + chip_used + ' ' + select_css + '" onclick="selectChip(this)">' + obj_ticket.ticket + '</div>';
  });
  contentChips.innerHTML = chipslibres;
  let text_current_page = `Pag: ${(page_num + 1)}/${number_of_pages}`
  $('#number_page_current').html(text_current_page);
  $('#pagingBox').scrollTop(0);
  $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');
  $('#current_page').val(page_num);
}

function selectChip (chip) {
  var contenidoChip = chip.innerHTML;
  if (chip.classList.contains("selected")) {
    chip.classList.remove("selected");
    hash_all_tickets.find(obj => obj.ticket === contenidoChip).selected = false
    const index = ticketsSelected.indexOf(contenidoChip);
    if (index > -1) {
      ticketsSelected.splice(index, 1);
    }
    countTicketsSelected--;
    if (countTicketsSelected > 0) {
      $("#btnMinus").click();
    }
  }
  else {
    if (countTicketsSelected >= limitTicketsChoosen) {
      if (countTicketsSelected >= max_tickets_buy) {
        showError(`Lo sentimos. No puedes seleccionar más ${ticketName}s.`);
        return;
      }
      else {
        $("#btnPlus").click();
      }
    };
    countTicketsSelected++;
    hash_all_tickets.find(obj => obj.ticket === contenidoChip).selected = true
    chip.classList.add("selected");
    ticketsSelected.push(contenidoChip);

    sendDataPixel('AddedNumbers', { number_ticket: contenidoChip });
  }
  $("#continueForm").attr("disabled", (countTicketsSelected == 0 || countTicketsSelected < ticket_qty))
  printSelectedTickets()
}

function deleteChip (numeroChip) {
  const index = ticketsSelected.indexOf(numeroChip);
  if (index > -1) {
    ticketsSelected.splice(index, 1);
    sendDataPixel('RemovedNumbers', { number_ticket: numeroChip });
  }

  countTicketsSelected--;
  let chip = document.getElementById(numeroChip);
  if (chip) chip.classList.remove("selected");
  hash_all_tickets.find(obj => obj.ticket === numeroChip).selected = false

  printSelectedTickets();
  if (countTicketsSelected > 0) {
    $("#btnMinus").click();
  }
  $("#continueForm").attr("disabled", (countTicketsSelected == 0 || countTicketsSelected < ticket_qty))
}

function printSelectedTickets () {
  var tickets = ticketsSelected.sort();
  let contenido = "";
  for (let i = 0; i < tickets.length; i++) {
    let extra_numbers = genExtraNums(raffleData.digits, raffleData.start_number_on, raffleData.end_number_on, tickets[i], raffleData.opportunities)
    if (raffleData.opportunities > 1) { contenido += `<div class="container_selected_number">`; }
    contenido += `
      <div class="chip selected_number">${tickets[i]}
        <i onclick="deleteChip('${tickets[i]}')" class="fa fa-times close" aria-hidden="true"></i>
      </div>
    `;
    if (raffleData.opportunities > 1) { contenido += `<small>${buildExtraNumbers(extra_numbers)}</small></div>`; }
  }
  for (let i = 0; i < limitTicketsChoosen - countTicketsSelected; i++) {
    contenido += '<div class="chip unselected_number">_ _ _</div>';
  }
  numeros_seleccionados.innerHTML = contenido;
  printTextSeleccionados();
}

function buildExtraNumbers (array_numbers) {
  let extra_numbers = ``
  $.each(array_numbers, function (index, number) {
    extra_numbers += `<span>${number}</span>`
  });
  return extra_numbers
}

function genExtraNums (digits, start_number, end_number, number_str, extras) {
  let extra_numbers = []
  let number = parseInt(number_str, 10)
  let total_numbers = end_number - start_number + 1
  let init_zero = start_number == 0 ? 1 : 0
  let pairs = number
  let odds = total_numbers - number + start_number - init_zero
  for (let i = start_number; i < (extras - init_zero); i++) {
    pairs += total_numbers
    odds += total_numbers
    extra_numbers.push(i % 2 == init_zero ? paddy(pairs, digits) : paddy(odds, digits))
  }
  return extra_numbers
}

function confirmTickets () {
  if (countTicketsSelected < min_tickets_buy && min_tickets_buy > 1) {
    let miss_tickets = min_tickets_buy - countTicketsSelected;
    let txterror = `Debes elegir al menos ${min_tickets_buy} ${ticketName}s. Aún te falta seleccionar ${miss_tickets}.`;
    showError(txterror);
    return;
  }
  else if (countTicketsSelected < limitTicketsChoosen) {
    let resta = limitTicketsChoosen - countTicketsSelected;
    let txterror = `Falta ${resta} ${ticketName}${resta > 1 ? "s" : ""} por elegir.`;
    showError(txterror);
    return;
  }
  else if (nameBuyer.value == "") showError("Por favor escriba su nombre.");
  else if (nameBuyer.value.length < 9 || nameBuyer.value.split(" ").length == 1) showError("Por favor ingrese su nombre completo.");
  else if (phoneBuyer.value == "") showError("Por favor escriba su celular.");
  else if (phoneBuyer.value.length > 14 || phoneBuyer.value.length < 8) showError("Por favor ingrese un celular correcto.");
  else if ((raffleData.client.extra_fields.email && emailBuyer.value.length > 0) && !validateEmail(emailBuyer.value)) showError("Por favor ingrese un email correcto.");
  else if ((raffleData.client.extra_fields.email && raffleData.client.extra_fields.email.required) && emailBuyer.value.length == 0) showError("Por favor ingrese un email.");
  else if ((raffleData.client.extra_fields.identification && raffleData.client.extra_fields.identification.required) && identificationBuyer.value.length == 0) showError("Disculpe, el campo " + raffleData.client.extra_fields.identification.label + " es obligatorio.");
  else if ((raffleData.client.extra_fields.notes && raffleData.client.extra_fields.notes.required) && notesPurchase.value.length == 0) showError("Disculpe, el campo " + raffleData.client.extra_fields.notes.label + " es obligatorio.");
  else if (imagePushed == false && !$('#checkboxPayAfter').prop('checked')) instanceVoucher.open();
  else if (raffleData.terms && raffleData.terms != "hide" && (!$('#checkboxClientTermsConds').prop('checked'))) {
    showError("Por favor acepte los Términos y Condiciones.")
  }
  else {
    var userData = {
      'name': nameBuyer.value,
      'phone': phoneBuyer.value,
      'location': locationBuyer.value || "",
      'email': emailBuyer.value || ""
    };
    sendDataPixel('CompleteRegistration', { userData: userData });
    sendDataPixel('ConfirmButton', { selected_tickets: ticketsSelected });
    instanceLoader.open();
    getTokenFirebase('build_buyer', "");
  }
}

function validateEmail (mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(mail)) {
    return true
  }
  return false
}

function buildVoucher (token, buyer) {
  formVoucherData = new FormData();
  formVoucherData.append("purchase[file]", imageBlob, nameFileDate);
  formVoucherData.append('purchase[token_recaptcha]', token);
  formVoucherData.append('purchase[payment_type_id]', currentPaymentType.id);
  formVoucherData.append('purchase[recaptcha_group]', recaptchaGroup);
  updatePurchase(buyer.token, purchaseWOPayFoundData.token)
}

function buildPurchase (token, response_buyer) {
  if (response_buyer.status == "success") {
    formPurchaseData = new FormData();
    formPurchaseData.append('purchase[name]', nameBuyer.value);
    formPurchaseData.append('purchase[amount]', priceTotal);
    formPurchaseData.append("purchase[file]", imageBlob, nameFileDate);
    formPurchaseData.append('purchase[quantity]', limitTicketsChoosen);
    formPurchaseData.append('purchase[mode]', "online");
    formPurchaseData.append('purchase[token_recaptcha]', token);
    formPurchaseData.append('purchase[recaptcha_group]', recaptchaGroup);
    ticketsSelected.forEach(ticket => formPurchaseData.append('purchase[tickets][]', ticket));
    formPurchaseData.append('purchase[payment_type_id]', currentPaymentType.id);
    formPurchaseData.append('purchase[notes]', notesPurchase.value);
    if (raffleData.client.extra_fields.seller) {
      formPurchaseData.append('purchase[seller]', sellerBuyer.value);
    }
    createPurchase(response_buyer.data.buyer.token)
  }
  else {

  }
}

function buildBuyer (token) {
  formBuyerData = new FormData();
  formBuyerData.append('buyer[raffle_token]', configClient.raffleToken);
  formBuyerData.append('buyer[name]', nameBuyer.value);
  formBuyerData.append('buyer[phone_code]', countryCode.value);
  formBuyerData.append('buyer[phone]', phoneBuyer.value);
  if (raffleData.client.extra_fields.identification) {
    formBuyerData.append('buyer[identification]', identificationBuyer.value);
  }
  if (raffleData.client.extra_fields.email) {
    formBuyerData.append('buyer[email]', emailBuyer.value);
  }
  if (raffleData.client.extra_fields.location) {
    formBuyerData.append('buyer[location]', locationBuyer.value);
  }
  if (raffleData.client.extra_fields.address) {
    formBuyerData.append('buyer[address]', addressBuyer.value);
  }
  if (raffleData.client.extra_fields.custom) {
    formBuyerData.append('buyer[custom_field]', customFieldBuyer.value);
  }
  if (raffleData.client.extra_fields.seller) {
    formBuyerData.append('buyer[seller]', sellerBuyer.value);
  }
  formBuyerData.append('buyer[token_recaptcha]', token);
  formBuyerData.append('buyer[recaptcha_group]', recaptchaGroup);
  createBuyer();
}

function setAccordion () {
  var acc = document.getElementsByClassName("accordion");
  var i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function chooseTicketsAuto () {
  let actual_count = countTicketsSelected - 1
  $("i.fa-times.close").click();
  for (let i = 0; i < actual_count; i++) {
    $("#btnPlus").click();
  }

  hash_all_tickets.filter(obj => { return obj.selected === true }).map(obj => obj.selected = false)
  const hashes_numbers = hash_all_tickets.filter(obj => { return obj.used === false }).slice(0, limitTicketsChoosen);
  $.each(hashes_numbers, function (index, hash_number) {
    let chip = $(`#${hash_number.ticket}`)
    if (chip[0] != undefined && !chip.hasClass("selected") && !chip.hasClass("used")) {
      chip.addClass("selected");
    }
    countTicketsSelected++;
    ticketsSelected.push(hash_number.ticket);
    hash_all_tickets.find(obj => obj.ticket === hash_number.ticket).selected = true
  });
  printSelectedTickets()
  window.location.href = "#lista";
}

function chooseTicketsRandom () {
  instanceMachine.open();
  // $(".chip.selected").click();
  let actual_count = countTicketsSelected - 1
  $("i.fa-times.close").click();
  for (let i = 0; i < actual_count; i++) {
    $("#btnPlus").click();
  }

  // Clean Hash Selected
  hash_all_tickets.filter(obj => { return obj.selected === true }).map(obj => obj.selected = false)
  const digits = raffleData.digits

  let random_numbers_s = []
  do {
    const random_position = Math.floor((Math.random() * (a_all_tickets.length)));
    const random_number = a_all_tickets[random_position]
    if (!random_numbers_s.includes(paddy(random_number, digits))) {
      random_numbers_s.push(paddy(random_number, digits));
    }
  } while (random_numbers_s.length < limitTicketsChoosen);

  setTimeout(function () {
    $.each(random_numbers_s, function (index, random_number_s) {
      let found_ticket = hash_all_tickets.find(obj => obj.ticket === random_number_s)
      let chip = $(`#${found_ticket.ticket}`)
      if (chip[0] != undefined && !chip.hasClass("selected")) {
        chip.addClass("selected");
      }
      countTicketsSelected++;
      ticketsSelected.push(found_ticket.ticket);
      hash_all_tickets.find(obj => obj.ticket === found_ticket.ticket).selected = true
    });
    printSelectedTickets()
    continueForm()
    instanceMachine.close();
  }, 1292);

}

function searchHashTicket (value) {
  let val_int = parseInt(value);
  let val_str = ""
  if (val_int <= raffleData.end_number_on) {
    val_str = paddy(value.toString(), raffleData.digits)
  }
  else {
    if (raffleData.opportunities == 1) return;
    val_str = decodeNumber(raffleData.start_number_on, raffleData.end_number_on, raffleData.digits, value.toString())
  }

  // let hash_ticket_filtered = searchArray(hash_ticket_filtered, val_str)
  let hash_ticket_filtered = hash_all_tickets.filter(obj => { return obj.used == false && obj.ticket == val_str })
  let object_tickets = hash_ticket_filtered.slice(0, 100);

  go_to_search(object_tickets, 0)
}

function decodeNumber (start_number, end_number, digits, number_str) {
  let number_i = parseInt(number_str)
  const total_numbers = end_number - start_number + 1
  let count = 1
  let result = 0

  do {
    number_i -= total_numbers
    count += 1
  } while (end_number < number_i);

  if (count % 2 == 0) {
    result = (end_number - number_i + start_number)
  }
  else {
    result = number_i
  }
  return paddy(result, digits)
}

function searchArray (myArray, number) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].ticket == number) {
      return myArray[i];
    }
  }
}

function randomName (tickets) {
  let rand = Math.floor(Math.random() * tickets.length);
  let ticket = tickets[rand];
  $('#randomNumberTicket').text(ticket);
}
function shuffleTickets (tickets) {
  $('#btnShuffleNumber').prop("disabled", true);
  $('#randomNumberTicket').removeClass("winner");

  setDeceleratingTimeout(function () { randomName(tickets) }, 10, 40);

  setTimeout(function () {
    var winner = $('#randomNumberTicket').text();
    $('#btnShuffleNumber').prop("disabled", false);
    $('#randomNumberTicket').addClass("winner");
  }, 7666);
}
function setDeceleratingTimeout (callback, factor, times) {
  var internalCallback = function (t, counter) {
    return function () {
      if (--t > 0) {
        window.setTimeout(internalCallback, ++counter * factor);
        callback();
      }
    }
  }(times, 0);
  window.setTimeout(internalCallback, factor);
};

function confirmVoucher () {
  if (currentPaymentType.mode == "online") {
    execPayOnline(purchaseWOPayFoundData.token)
  } else {
    if (imagePushed == false) showError("Por favor suba el Voucher (Comprobante de Pago)");
    else {
      instanceLoader.open();
      getTokenFirebase('build_voucher', buyerFoundData);
    }
  }
}

function actionButtonAccounts (action_type, elemnt, text) {
  if (action_type == 'copy') {
    $(elemnt).addClass("copied");
    setTimeout(function () {
      $(elemnt).removeClass("copied");
    }, 1200);
    var sampleTextarea = document.createElement("textarea");
    document.body.appendChild(sampleTextarea);
    sampleTextarea.value = text.replace(/ /g, '');
    sampleTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(sampleTextarea);
  }
  else if (action_type == 'link') {
    window.open(text, '_blank').focus();
  }
}

function activateUploadVoucher (purchase_token) {
  purchaseWOPayFoundData = buyerFoundData.purchases.find(purchase => purchase.token == purchase_token)
  ticket_qty = purchaseWOPayFoundData.quantity
  priceTotal = purchaseWOPayFoundData.amount
  findPhone.value = buyerFoundData.phone;
  $(".pricing-title > h2").html("Completar Pago")
  $("#new-purchase").hide();
  $(".labelPersonalData").hide();
  $('.s-voucher').show()
  $('.checkboxPayAfter').hide();

  $("#confirmTickets").html("Completar")
  $("#confirmTickets").attr("onclick", "confirmVoucher()")
  if (currentPaymentType.mode == "online") {
    $('#checkboxPayAfter').prop("checked", true);
  }
  else {
    $('#checkboxPayAfter').prop("checked", false);
  }

  msjMontoCorrecto();
}

function searchTicket () {
  $("#btnSearchTickets").hide()
  $("#inputSearchTicket").show()
  $("#resetSearchTicket").show()
  $("#inputSearchTicket").focus();
}
function closeSearchTicket () {
  $("#btnSearchTickets").show()
  $("#inputSearchTicket").hide()
  $("#resetSearchTicket").hide()
  $("#inputSearchTicket").val("");
  $("#inputSearchTicket").blur();
  go_to_page(0)
}

function calcDrawDate () {
  const start_date = new Date(raffleData.start_date);
  const current_date = new Date();
  const days_passed = Math.floor((current_date - start_date) / (1000 * 60 * 60 * 24)); // 10
  if (a_all_tickets.length == 0) {
    $(".header_aprox_date").hide()
    return
  }
  const total_selled = raffleData.on_quantity - a_all_tickets.length
  if (total_selled < 8) return $("#aprox_date").html("POR DETERMINAR")
  const total_days_need = Math.ceil(days_passed * raffleData.percent_draw_date / total_selled);

  let aprox_date = new Date();
  aprox_date.setDate(current_date.getDate() + total_days_need);
  const options_date = { day: 'numeric', month: 'short', year: 'numeric' };
  aprox_date = aprox_date.toLocaleDateString(`es-${raffleData.country.code}`, options_date).replace(/de/g, '');
  $("#aprox_date").html(aprox_date.toUpperCase())
}

function sendDataPixel (event_track, data) {
  if (!raffleData.client.tracking["pixel"]) return;
  fbq('track', event_track, data);
}

$(document).on('ready', function () {
  let params = new URLSearchParams(window.location.href.split('?')[1]);
  let refValue = params.get('ref');
  let showValue = params.get('show');
  if (refValue) {
    $("#seller").val(refValue).change();
    $("#seller").prop("disabled", true);
  }
  if (showValue == "terminos") {
    instanceTermsConds.open()
  }
  if (window.location.hash) {
    let phoneParsedUrl = window.location.hash.split("#")[1];
    if (phoneParsedUrl.indexOf("?") > -1) phoneParsedUrl = phoneParsedUrl.split("?")[0]
    if (phoneParsedUrl.indexOf("&") > -1) phoneParsedUrl = phoneParsedUrl.split("&")[0]
    if (!isNaN(phoneParsedUrl) && phoneParsedUrl.length >= 8) {
      findPhone.value = phoneParsedUrl;
      setTimeout(function () {
        searchBuyer(phoneParsedUrl);
      }, 670);
    }
  }
  $('#ticketQty').val(ticket_qty);
  $('#buttfixed').on('click', function () { $('#linksfixed').toggle() });
  $('#openModalUseData').on('click', function (event) { event.preventDefault(); instanceUseData.open() });
  $('#openModalTermsConds').on('click', function (event) { event.preventDefault(); instanceTermsConds.open() });
  $('#btnAccepUseData').on('click', function (event) { event.preventDefault(); $('#checkboxPersonalData').prop('checked', true) });
  $('#btnAccepTermsConds').on('click', function () { $('#checkboxClientTermsConds').prop('checked', true) });
  $('#btnCancelTermsConds').on('click', function () { $('#checkboxClientTermsConds').prop('checked', false) });
  $('#btnChooseRandomChips').on('click', function (event) { event.preventDefault(); chooseTicketsRandom() });
  $('#btnSearchTickets').on('click', function (event) { event.preventDefault(); searchTicket() });
  $('#resetSearchTicket').on('click', function (event) { event.preventDefault(); closeSearchTicket() });

  $("#inputSearchTicket").attr('maxlength', raffleData.digits);
  $("#inputSearchTicket").on("input", function () {
    let input_value = $("#inputSearchTicket").val()
    if (input_value.length < 1) {
      go_to_page(0)
    }
    else {
      searchHashTicket($("#inputSearchTicket").val())
    }
  });

  $('#checkboxPayAfter').change(function () { // listen check novoucher
    if ($(this).is(':checked')) {
      $('#msgTimeVoucherUpload').show()
      $('.s-voucher').hide()
    }
    else {
      $('#msgTimeVoucherUpload').hide()
      $('.s-voucher').show()
    }
  });
  if (raffleData.client.redirect_whats) {
    $('#checkboxPayAfter').prop("checked", true);
    $('.s-voucher').hide()
  }
  if (window.pageYOffset > 0) {
    $("#navbar").addClass("header-scrolled")
  }
});

function setCarouselSponsors (sponsorsSize) {
  count = sponsorsSize > 2 ? 3 : sponsorsSize
  $("#sponsorList").owlCarousel({
    items: count,
    loop: (count > 2),
    nav: true,
    autoplay: true,
    autoplayTimeout: 9200,
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: count
      },
      1000: {
        items: count
      }
    }
  });
}
function setCarouselAwards (awardsSize) {
  count = awardsSize > 2 ? 3 : 1
  $("#awardList").owlCarousel({
    items: count,
    loop: (awardsSize > 3),
    nav: true,
    autoplay: (awardsSize > 3),
    autoplayTimeout: 6600,
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: count
      },
      1000: {
        items: count
      }
    }
  });
};
