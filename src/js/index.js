!function($){

  var href = location.pathname;
  if (href.indexOf('/creators/') > -1) return;
  if (href.indexOf('/categories/') > -1) return;
  if (href.indexOf('index.html') === -1 && href.substr( href.length -1 ) !== '/') return;


  // window ready
  $(function(){

    var panelsBody = $('#panels .panels__body');
    var panels = $('.panel', panelsBody );

    var panel;
    var lazyImg;
    for(var i=0,len=panels.length;i<len;i++){

      // random choice
      panel = $(panels.splice( Math.floor(Math.random()*panels.length), 1 )[0]);
      // move a panel to .panels__body
      panel.appendTo( panelsBody );

      // Top 4 panels
      if( i<4 ){
        panel.css( {
          top:0,
          left:i*240+'px',
          visibility:'visible'
        });
        lazyImg = $( 'img.js__lazy', panel);
        lazyImg.lazyload();
        lazyImg.removeClass('js__lazy');
      }else{
        panel.css({
          visibility:'hidden'
        });
      }
    }
  });


  // window load
  $(window).on('load', function () {

    var container = document.querySelector('#panels');

    var options = {
      itemSelector: '.panel',
      columnWidth: 220,
      gutter: 20,
      transitionDuration: 0
    };

    var msnry = new Masonry( container, options );

    $("#carousel-main").carousel("play", {delay:5000} );
    $("img.js__lazy").lazyload({
      appear: function () {
        msnry.layout();
      },
      load : function(elements_left, settings) {
        $(this).parents('.panel').css({
          visibility: 'visible',
          display: 'none'
        }).fadeIn('fast',function(){
          msnry.layout();
        });
      }
    });
  });
}(jQuery);
