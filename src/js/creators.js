$(window).on('load', function () {
  var href = location.pathname;
  if (href.indexOf('creators') === -1) return;
  if (href.indexOf('index.html') === -1 && href.substr( href.length -1 ) !== '/') return;

  $("#carousel-main").carousel("play", {delay:5000} );

});
