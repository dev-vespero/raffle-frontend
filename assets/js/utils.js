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

function continueForm () {
  if (numeros_seleccionados.style.display === "block") {
    toogleSelected()
  }
  $("#nombre").focus();
}

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