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
export const numeros_seleccionados = document.getElementById("numeros_seleccionados");
const textSeleccionados = document.getElementById("textSeleccionados");
const resultTickets = document.getElementById("resultTickets");
const btn_upload_voucher = document.getElementById("btn_upload_voucher");
const container_fixed = document.getElementById('container_select_to_fixed');
const priceConvert = document.getElementById("priceConvert");
const container_element = document.getElementById('container-get-ticket');
export const btn_view_selected = document.getElementById('btn_view_selected');
export const btn_view_selected_bot = document.getElementById('btn_view_selected_bot');

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
const modalTermsConds = document.getElementById("modalTermsConds");
const modalVoucher = document.getElementById("modalVoucher");
const modalMachine = document.getElementById("modalMachine");
/******************************************************
 *** Modal Materialize                              *** 
 ******************************************************/
const instanceError = M.Modal.init(modalError, {});
const instanceUseData = M.Modal.init(modalUseData);
const instanceTermsConds = M.Modal.init(modalTermsConds);
const instanceVoucher = M.Modal.init(modalVoucher);
const instanceSuccess = M.Modal.init(modalSuccess, { dismissible: false });
const instanceMachine = M.Modal.init(modalMachine, { dismissible: false });
