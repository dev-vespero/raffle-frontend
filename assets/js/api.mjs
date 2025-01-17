import { FormManager } from "./forms.mjs";

export const APIManager = {
  getAllTickets: () => {
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
  },
  buildFindPhone: (token, phone) => {
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
  },
  buildFindTicket: (token, ticket) => {
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
  },
  getRaffleTickets: () => {
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
  },
  createBuyer: () => {
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
  },
  createPurchase: (buyerToken) => {
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
  },
  updatePurchase: (buyerToken, purchaseToken) => {
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
  },
};

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

function getTokenFirebase (action_name, obj) {
  grecaptcha.ready(function () {
    grecaptcha.execute('6LctjKkfAAAAAAvlMbLxs_6tz_2H_jzkh0MT87V1', { action: action_name })
      .then(function (token) {
        if (action_name == 'build_buyer') {
          FormManager.buildBuyer(token);
        }
        else if (action_name == 'build_purchase') {
          FormManager.buildPurchase(token, obj);
        }
        else if (action_name == 'build_voucher') {
          FormManager.buildVoucher(token, obj);
        }
        else if (action_name == 'build_find_phone') {
          buildFindPhone(token, obj);
        }
        else if (action_name == 'build_find_ticket') {
          buildFindTicket(token, obj);
        }
      })
      .catch(function (error) {
        console.error('Error al obtener el token de reCAPTCHA:', error);
        showError("Ocurrió un error, reintentar por favor.");
        instanceLoader.close();
      });
  });
}
