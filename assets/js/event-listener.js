window.addEventListener('scroll', () => {
  var rect = contentChips.getBoundingClientRect();
  var windowHeight = window.innerHeight;

  if (rect.bottom - 333 <= windowHeight && rect.bottom + 180 > windowHeight ) {
    container_fixed.classList.add('fixed');
  } else {
    container_fixed.classList.remove('fixed');
  }
  const height_fixed = window.innerWidth < 600 ? 92 : 300
  if (rect.bottom + height_fixed <= windowHeight && rect.bottom + 1100 > windowHeight ) {
    priceConvert.classList.add('pricefixed');
  } else {
    priceConvert.classList.remove('pricefixed');
  }
});

btn_view_selected.addEventListener('click', () => toogleSelected());
btn_view_selected_bot.addEventListener('click', () => toogleSelected());