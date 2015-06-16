$(window).on('load', function () {
  var href = location.pathname;
  if (href.indexOf('creators') === -1) return;
  if (href.indexOf('index.html') > -1 || href.substr( href.length -1 ) === '/') return;

  var container = document.querySelector('#panels');
  var msnry = new Masonry(container, {
    itemSelector: '.panel',
    columnWidth: 220,
    gutter: 20
  });
  var height;
  // Mini hack for fixing panel
  var timer = setInterval(function () {
    if (height === $('#panels').height()) clearInterval(timer);
    var container = document.querySelector('#panels');
    var msnry = new Masonry(container, {
      itemSelector: '.panel',
      columnWidth: 220,
      gutter: 20
    });
    height = $('#panels').height();
  }, 100);
});
