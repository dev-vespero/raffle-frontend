export const FormManager = {
  buildBuyer: (token) => {
    const formBuyerData = new FormData();
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

    APIManager.createBuyer();
  },

  buildPurchase: (token, response_buyer) => {
    if (response_buyer.status != "success") return;

    const formPurchaseData = new FormData();
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

    APIManager.createPurchase(response_buyer.data.buyer.token)
  },

  buildVoucher: (token, buyer) => {
    const formVoucherData = new FormData();
    formVoucherData.append("purchase[file]", imageBlob, nameFileDate);
    formVoucherData.append('purchase[token_recaptcha]', token);
    formVoucherData.append('purchase[payment_type_id]', currentPaymentType.id);
    formVoucherData.append('purchase[recaptcha_group]', recaptchaGroup);

    APIManager.updatePurchase(buyer.token, purchaseWOPayFoundData.token)
  }
};
