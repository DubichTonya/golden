$(document).ready(function () {

  $('.slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [{
      breakpoint: 768,
      settings: "unslick"
    }]
  });


  // range ------------------------

  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 350,
    values: [75, 250],
    slide: function (event, ui) {
      $("#sqr-1").val(ui.values[0]);
      $("#sqr-2").val(ui.values[1]);
    }
  });
  $("#sqr-1").val($("#slider-range").slider("values", 0));
  $("#sqr-2").val($("#slider-range").slider("values", 1))



});


// ----------------------------------menu

document.addEventListener('DOMContentLoaded', function () {

  let btnMenu = document.querySelector('.page-header__navigationBnt');
  let menu = document.querySelector('.page-header__navigationList');

  btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('page-header__navigationBnt-close');
    menu.classList.toggle('open-menu');
  })

})
