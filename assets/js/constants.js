let tokenRecaptcha = ""
const recaptchaGroup = "G1"
const modalLoader = document.getElementById("modalLoader");
const instanceLoader = M.Modal.init(modalLoader, { dismissible: false });
const baseUrl = "/api/v1/"
const configClient = {
  clientToken: "WqX5DQ",
  raffleToken: "vyUrgVCW"
}
const listSponsors = []
const listAwards = []
const tokenBearer = "0000+L22:20:71L41-100000+L22:20:71L41-10"

let formBuyerData = new FormData();
let formPurchaseData = new FormData();
let formVoucherData = new FormData();

const modalTermsConds = document.getElementById("modalTermsConds");
const modalVoucher = document.getElementById("modalVoucher");
const modalMachine = document.getElementById("modalMachine");
const instanceTermsConds = M.Modal.init(modalTermsConds);
const instanceVoucher = M.Modal.init(modalVoucher);
const instanceMachine = M.Modal.init(modalMachine, { dismissible: false });



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

const ticketName = "boleto"
const form = document.getElementById('formimage');
const contentChips = document.getElementById("pagingBox");
const numeros_seleccionados = document.getElementById("numeros_seleccionados");
const textSeleccionados = document.getElementById("textSeleccionados");
const resultTickets = document.getElementById("resultTickets");
const container_fixed = document.getElementById('container_select_to_fixed');
const priceConvert = document.getElementById("priceConvert");
const container_element = document.getElementById('container-get-ticket');

/******************************************************
 *** File input                                     ***
 ******************************************************/
const fileinput = document.getElementById('files');
let max_width = fileinput.getAttribute('data-maxwidth');
let max_height = fileinput.getAttribute('data-maxheight');

const btn_upload_voucher = document.getElementById("btn_upload_voucher");
const btn_view_selected = document.getElementById('btn_view_selected');
const btn_view_selected_bot = document.getElementById('btn_view_selected_bot');

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
const findPhone = document.getElementById("findPhone");
const msjRptaBusqueda = document.getElementById("msjRptaBusqueda");
const qrCode = document.getElementById("qrCode");

/******************************************************
 *** Modal                                          ***
 ******************************************************/
const modalError = document.getElementById("modalError");
const modalSuccess = document.getElementById("modalSuccess");
const modalUseData = document.getElementById("modalUseData");
const modalSale = document.getElementById("modalSale");
/******************************************************
 *** Modal Materialize                              *** 
 ******************************************************/
const instanceError = M.Modal.init(modalError, {});
const instanceUseData = M.Modal.init(modalUseData);
const instanceSale = M.Modal.init(modalSale);
const instanceSuccess = M.Modal.init(modalSuccess, { dismissible: false });

/******************************************************
 *** Configuracion de la rifa                       *** 
 ******************************************************/
const raffleData = {
  "digits": 3,
  "multiplier": 1,
  "done_successfully": false,
  "questions": [],
  "show_progress": true,
  "modality": "end_date",
  "address": "Guatire, Miranda, Venezuela",
  "name": "GANATE UNA SBR 6G 2025 0KM",
  "description": "PARTICIPA Y GANATE UNA SBR 6G 2025 0KM POR TAN SOLO 1.5$ CADA TICKET Y LO MEJOR DE TODO A TASA BCV.\r\n\r\nPREMIOS:\r\n🥇1ER LUGAR: SBR 6G 0KM 2025 🏍️\r\n🥈2DO LUGAR: 50$ 💴\r\n🥉3ER LUGAR: 2 CAMBIOS DE ACEITE PARA MOTO 150 CC\r\n\r\n** CON COMPRAS MAYOR A 60$ EN NUESTRAS TIENDAS YA ESTARAS PARTICIPANDO.\r\n** LA RIFA SERA REALIZADA AL TOTALIZAR LA VENTA DE LOS TICKETS\r\n** FECHA PUBLICADA ESTA SUJETA A CAMBIOS POR LA VENTA DE LOS BOLETOS",
  "price_unit": 1.5,
  "draw_date_short": "24 FEB 2025",
  "draw_date": "24 Febrero, 2025",
  "draw_hour": "08:00 PM",
  "draw_is_today": false,
  "opportunities": 1,
  "image": {
    "url": "https://rifarito.s3.amazonaws.com/uploads/raffle/image/3046/bnrrpost-ig.jpg",
    "name": "bnrrpost-ig.jpg"
  },
  "colors": {
    "dark": "#73141c",
    "primary": "#c5010e",
    "bg_header": "#610b10",
    "secondary": "#f8cc13",
    "text_hover": "#ffffff",
    "text_header": "#faf6f6",
    "text_normal": "#ffffff"
  },
  "phones": [
    "04129753098"
  ],
  "min_tickets_buy": 1,
  "max_tickets_buy": 50,
  "on_quantity": 1000,
  "start_number_on": 0,
  "end_number_on": 999,
  "voucher_wait_hours": 24,
  "transmission": "instagram",
  "discount_rate": 0.0,
  "discount_rate_increase": 0.0,
  "discount_max_tickets": 0,
  "free_ticket_promo": 0,
  "terms": "",
  "custom_text": {
    "form_option_send_after": "Enviar comprobante de pago a WhatsApp"
  },
  "show_used": true,
  "custom_message_whatsapp": "Hola, soy *|buyer_name|*, con mi celular *|buyer_phone|* registré estos números: *|tickets|* en *|raffle_name|* *|url|*",
  "percent_draw_date": 0,
  "start_date": "2024-12-18T16:50:00.000-05:00",
  "country": {
    "code": "VE",
    "code_phone": "58"
  },
  "client": {
    "name": "MOTO MOTO RIFAS",
    "identification": "S/N",
    "description": "MOTO MOTO RIFAS",
    "website": "https://www.motomotorifas.com",
    "logo": "https://rifarito.s3.amazonaws.com/uploads/client/logo/2334/llgLOGO1-min.png",
    "redirect_whats": false,
    "social": {
      "tiktok": "",
      "twitter": "",
      "youtube": "",
      "facebook": "",
      "linkedin": "",
      "instagram": "https://www.instagram.com/motomotorifascom/"
    },
    "tracking": {},
    "extra_fields": {}
  },
  "currency": {
    "name": "Dólares Americanos",
    "code": "USD",
    "decimals": 2,
  }
}

const configPaymentTypes = {
  "name": "KATIUSKA MIRELES",
  "type_account": "personal",
  "number": "0412 9753098",
  "interbank": "14755978",
  "number_alias": "TELÉFONO",
  "interbank_alias": "CÉDULA",
  "exchange_rate": "1.0",
  "bank": {
    "description": "Banco de Venezuela",
    "name": "PagomóvilBDV",
    "var_name": "PAGO_MOVIL",
    "logo": "https://rifarito.s3.amazonaws.com/uploads/bank/logo/54/vepagomovilc2c.png"
  },
  "currency": {
    "name": "Dólares Americanos",
    "code": "USD",
    "decimals": 2,
  }
}
