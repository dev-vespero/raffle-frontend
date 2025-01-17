import { readfiles } from "./images.mjs";
console.info("HAOl")

const Main = {
  init: () => {
    console.info("HAOl")
    fileInput();
    setInputFilter(document.getElementById("celular"), (value) => /^\d*$/.test(value));
    setInputFilter(document.getElementById("inputSearchTicket"), (value) => /^\d*$/.test(value));

    $("#navbarNav").on("click", "a", () => $(".navbar-toggle").click());
    $(".nav-item").on("click", "a", () => $("#navbarNav").removeClass('show'));
  },
  fileInput: () => {
    const fileinput = document.getElementById('files');

    fileinput.onchange = function () {
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
        return false;
      }
      readfiles(fileinput.files);
      containimagenVoucher.style.display = "block";
    }
  },
  setInputFilter: (textbox, inputFilter) => {
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
};

console.info("HAOl")
Main.init();
