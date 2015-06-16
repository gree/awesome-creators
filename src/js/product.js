if (location.href.indexOf('products') !== -1) {
  $(window).on('load', function() {
    var container = document.querySelector('#panels');
    var msnry = new Masonry( container, {
      itemSelector: '.panel',
      columnWidth: 220,
      gutter: 20
    });
  });
}
