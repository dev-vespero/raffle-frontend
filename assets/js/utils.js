import { btn_view_selected, btn_view_selected_bot, numeros_seleccionados } from "./constants.mjs";

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

function resetTodo () {
  $("i.fa-times.close").click();
  imageBlob = new Blob();
  imagePushed = false;
  containimagenVoucher.innerHTML = '';
  resizeBiggUploadContainer();
  containimagenVoucher.style.display = "none";
  nameBuyer.value = '';
  phoneBuyer.value = '';
}


/******************************************************
 *** Animacion para el menu al hacer scroll         *** 
 ******************************************************/
$(window).scroll(function () {
  if ($(this).scrollTop() > 20) {
    $('#navbar').addClass('header-scrolled');
  } else {
    $('#navbar').removeClass('header-scrolled');
  }
});