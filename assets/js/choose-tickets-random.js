$('#btnChooseRandomChips').on('click', (event) => {
  event.preventDefault();
  chooseTicketsRandom()
});

function chooseTicketsRandom () {
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