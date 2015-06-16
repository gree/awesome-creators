!function ($) {
  'use strict';

  var $_contents = $('.contents-wrapper');
  var $_html = $('html,body');
  var scrollPosition;

  $('[data-toggle="modal"]').on('click', function (e) {
    var $this = $(this);
    var $target = $($this.attr('data-target'));

    scrollPosition = $(window).scrollTop();


    // Show modal
    $target.removeClass('modal--hidden');
    $target.addClass('modal--show');

    // Creator
    var creator = $this.attr( "data-modal-creator");
    var $creatorImg = $("<img src='"+creator+"'>");
    $(".modal__creator", $target ).children().remove();
    $(".modal__creator", $target ).append( $creatorImg );

    // Product
    var product = $this.attr( "data-modal-product" );
    var $modalProduct = $(".modal__product", $target );
    $modalProduct.children().remove();
    // Not defined product Case
    if( product!=null && product!="" ){
      var $productImg = $("<img src='"+product+"'>");
      $modalProduct.append( $productImg );
      $modalProduct.show();
    }else{
      $modalProduct.hide();
    }


    // Name
    var nameText = $this.attr("data-modal-name");
    var nameEnText = $this.attr("data-modal-name-en");
    $(".modal__name", $target ).html( nameText+"<br>"+nameEnText );

    // Tag
    var tagName = $this.attr("data-modal-tag-name");
    $(".modal__tag", $target ).children().remove();
    $(".modal__tag", $target ).html( tagName );

    // Portfolio img
    var portfolio = $this.attr("data-modal-portfolio");
    var $portfolioImg = $("<img src='"+portfolio+"'>");
    $(".modal__body img", $target ).remove();
    $(".modal__body", $target ).append( $portfolioImg );

    // Wait for load complete img
    var intervalId = setInterval(function(){
      var modalH = $portfolioImg.height();
      if( !modalH ){
        return;
      }
      var modalBodyH = Math.max( window.innerHeight, modalH + 160 * 2 );
      $target.css({'height': modalBodyH + 'px'}).addClass('modal--show');
      clearInterval( intervalId );
    }, 200 );


    $_contents.css({
      'position': 'fixed',
      'top': '-' + scrollPosition + 'px',
      'left': 0,
      'right': 0
    });

    $_html.animate({scrollTop:0}, 0);

    return;
  });

  $('[data-dismiss="modal"]').on('click', function (e) {
    var $target = $( $(this).attr('data-target') );
    $target.removeClass('modal--show');
    $_contents.css({'position': 'static'});
    $_html.animate({scrollTop:scrollPosition + 'px'},0);

    return;
  });
}(jQuery);
