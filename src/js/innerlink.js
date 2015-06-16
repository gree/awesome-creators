!function ($) {
  'use strict';

  $('a[href^=#]').on('click', function(){
      var speed = 300;
      var target = $( $(this).attr('href') );

      if( target.size() < 1 ) return false;

      var targetY = target.offset().top;
      $('html, body').animate({ scrollTop : targetY }, speed);
      return false;
  });

}(jQuery);
