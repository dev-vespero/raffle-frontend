if (!raffleData.done_successfully) {
  max_width = fileinput.getAttribute('data-maxwidth');
  max_height = fileinput.getAttribute('data-maxheight');
  fileinput.onchange = function () {
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert('The File APIs are not fully supported in this browser.');
      return false;
    }
    readfiles(fileinput.files);
    containimagenVoucher.style.display = "block";
  }
  setInputFilter(document.getElementById("celular"), function (value) {
    return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
  });
  setInputFilter(document.getElementById("inputSearchTicket"), function (value) {
    return /^\d*$/.test(value);
  });
  // setInputFilter(document.getElementById("findPhone"), function (value) {
  //   return /^\d*$/.test(value);
  // });
}

function setInputFilter (textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
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
}

$("#navbarNav").on("click", "a", function () {
  $(".navbar-toggle").click();
});
$(".nav-item").on("click", "a", function () {
  $("#navbarNav").removeClass('show');
});

$(window).scroll(function () {
  if ($(this).scrollTop() > 20) {
    $('#navbar').addClass('header-scrolled');
  } else {
    $('#navbar').removeClass('header-scrolled');
  }
});

function getTokenFirebase (action_name, obj) {
  grecaptcha.ready(function () {
    grecaptcha.execute('6LctjKkfAAAAAAvlMbLxs_6tz_2H_jzkh0MT87V1', { action: action_name })
      .then(function (token) {
        tokenRecaptcha = token
        if (action_name == 'build_buyer') {
          buildBuyer(token);
        }
        else if (action_name == 'build_purchase') {
          buildPurchase(token, obj);
        }
        else if (action_name == 'build_voucher') {
          buildVoucher(token, obj);
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