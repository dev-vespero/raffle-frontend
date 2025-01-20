const Main = {
  init: () => {
    Main.addEventListener();
    Main.fileInput();
    Main.setInputFilter(document.getElementById("celular"), (value) => /^\d*$/.test(value));
    Main.setInputFilter(document.getElementById("inputSearchTicket"), (value) => /^\d*$/.test(value));
    Main.fileInput();

    $("#navbarNav").on("click", "a", () => $(".navbar-toggle").click());
    $(".nav-item").on("click", "a", () => $("#navbarNav").removeClass('show'));
  },
  ready: () => {
    (function ($) {
      console.info($)
      $.fn.numberPicker = function () {
        var dis = 'disabled';
        return this.each(function () {
          console.info($(this))
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
  },
  fileInput: () => {
    fileinput.onchange = function () {
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
        return false;
      }
      ImageFiles.readfiles(fileinput, fileinput.files);
      containimagenVoucher.style.display = "block";
    }
  },
  setInputFilter: (textbox, inputFilter) => {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach((event) => {
      textbox.addEventListener(event, function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  },
  addEventListener: () => {
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

    btn_view_selected.addEventListener('click', () => Rifa.toogleSelected());
    btn_view_selected_bot.addEventListener('click', () => Rifa.toogleSelected());

    $('#btnChooseRandomChips').on('click', (event) => {
      event.preventDefault();
      Rifa.chooseTicketsRandom()
    });
  }
};

const Rifa = {
  chooseTicketsRandom: () => {
    instanceMachine.open();
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
      Rifa.continueForm()
      instanceMachine.close();
    }, 1292);

  },
  printSelectedTickets: () => {
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
  },
  printTextSeleccionados: () => {
    textSeleccionados.innerHTML = `${countTicketsSelected} de ${limitTicketsChoosen}`;
  },
  continueForm: () => {
    if (numeros_seleccionados.style.display === "block") {
      Rifa.toogleSelected()
    }
    $("#nombre").focus();
  },
  toogleSelected: () => {
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
};

const ImageFiles = {
  readfiles: (fileinput, files) => {
    let existinginputs = document.getElementsByName('images[]');
    while (existinginputs.length > 0) {
      form.removeChild(existinginputs[0]);
    }

    for (let i = 0; i < files.length; i++) {
      ImageFiles.processfile(files[i]);
    }
    fileinput.value = "";
  },
  processfile: (file) => {
    if (!(/image/i).test(file.type)) {
      alert("File " + file.name + " is not an image.");
      return false;
    }
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (event) {
      let blob = new Blob([event.target.result]);
      let myURL = window.URL || window.webkitURL;
      let blobURL = myURL.createObjectURL(blob);

      let image = new Image();
      image.src = blobURL;

      image.onload = function () {
        let resized = ImageFiles.resizeMeToBlob(image);
        const contentType = 'image/jpg';
        const b64Data = resized.split(",")[1];
        imageBlob = ImageFiles.base64toBlob(b64Data, contentType);
        nameFileDate = new Date().getTime() + ".jpg";
        containimagenVoucher.innerHTML = '<img src="' + resized + '">';
        ImageFiles.resizeSmallUploadContainer()
        imagePushed = true
      }
    };
  },
  resizeMeToBlob: (img) => {
    let canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;
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
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.82);
  },
  base64toBlob: (b64Data, contentType = '', sliceSize = 512) => {
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
  },
  resizeSmallUploadContainer: () => {
    $('#container_voucher_up').removeClass("col-lg-12");
    $('#container_voucher_up').addClass("col-lg-6");
  }
};

const APIManager = {
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
        showError("Ocurrió un Error")
        console.log({request, message, error})
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
};

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


Main.init();
