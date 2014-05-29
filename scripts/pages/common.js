/* Preload */

$(window).load(function () {
  $('.spinner').fadeOut();
  $('#preloader').delay(350).fadeOut('slow');
  $('body').delay(350).css({
    'overflow': 'visible'
  });
})


/* Sidr */

$('.menu-trigger').sidr({
  name: 'menu-trigger',
  source: '#main-menu'
});