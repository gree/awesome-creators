// Carousel control JS require jQuery
//
// .active rotation on parent
// Interlock data-target in data-slide-to
//
// DOM example:
//
// [Indicator]
//  <div id="indicator">
//    <div class="active" data-target="#slide" data-slide-to="0">Carousel 1</div>
//    <div data-target="#slide" data-slide-to="1">Carousel 2</div>
//  </div>
//
// [Slide]
//  <div id="slide">
//    <div class="active">Slide 1</div>
//    <div>Slide 2</div>
//  </div>
//

!function($){


  //  jqobj.changeCarouselAt( index[, options] );
  //  index: Number
  //  options: Object
  //
  //  The Simply Carousel change function
  //
  //  Example
  //
  //  1. Change Carousel at Index
  //    $("#indicator").changeCarouselAt( 0 );
  //    $("#indicator").changeCarouselAt( 2 );
  //
  //  2. Use Options
  //    $("#indicator").changeCarouselAt( 1, {
  //      fadeInDuration: 2000,
  //      fadeOutDuration: 4000,
  //      onChange: function(){
  //        alert("COMP!");
  //      }
  //    });
  //
  $.fn.changeCarouselAt = function( index, options ){

    var self = this;

    // default setttings
    var settings = {
      fadeInDuration:400,
      fadeOutDuration:400,
      onChange:null
    };
    if( options != null && typeof(options)==="object" ){
      $.extend( settings, options );
    }

    // If carousel animation progress force end
    if( self.data("carouselProgress") ){
      // Break function
      return this;
    }


    // 1,
    // Unactivate indicator
    var beforeIndicator = $( ".active", self );
    beforeIndicator.removeClass("active");

    // 2,
    // Activate Next active indicator
    var afterIndicator = $(self.children().get(index));
    afterIndicator.addClass("active");

    // 3,
    // Get Attributes with a active Carousel
    var targetStr = afterIndicator.attr("data-target");
    var target = $(targetStr);
    var slideToStr = afterIndicator.attr("data-slide-to");
    var slideTo;

    if( target[0] ){
      slideTo = $(target.children().get( slideToStr ));

      var fadeInNextSlide = function(){
        if( slideTo[0] ){
          slideTo.addClass("active");
          slideTo.hide().fadeIn( settings.fadeInDuration, function(){
            self.data("carouselProgress", false );
            // Call to onChange handler
            if( typeof(settings.onChange) === "function" ) settings.onChange();
          });
          self.data("carouselProgress", true );
        }
      }

      // 4,
      // Currentry active slide will be fadeout
      var prevSlide = $( ".active", $(target) );
      if( prevSlide[0] ){
        prevSlide.fadeOut( settings.fadeOutDuration, function(){
          self.data( "carouselProgress", false );
          $(this).removeClass("active");
          // 5, Fadein Next slide
          fadeInNextSlide();
        });
        self.data( "carouselProgress", true );
      }else{
        // Safety If notiong .active then Quickly next
        fadeInNextSlide();
      }
    }
    return this;
  };

  // $jqobj.carousel( order[, options] );
  //
  // Many functionaly Carousel control by order
  //
  // order: String or Number
  // options: Object
  //
  //
  //  1. Choose of Number
  //    $("#indicator").carousel( 0 );
  //    $("#indicator").carousel( 3 );
  //    $("#indicator").carousel( 1000 );
  //
  //  2. Change Carousel order from String
  //    Move to Next Carousel, if active carousel is last then move to first
  //    $("#indicator").carousel( "next" );
  //
  //    Move to Previous Carousel, if active carousel is first then move to last
  //    $("#indicator").carousel( "prev" );
  //
  //    Move to First Carousel
  //    $("#indicator").carousel( "first" );
  //
  //    Move to Last Carousel
  //    $("#indicator").carousel( "last" );
  //
  //  3. Auto play Carouse
  //    Start
  //    $("#indicator").carousel( "play" );
  //
  //    Stop
  //    $("#indicator").carousel( "stop" );
  //
  //    Toggle play, If carousel is play then stop else play
  //    $("#indicator").carousel( "toggle-play" )
  //
  //
  // 4. Use options
  //
  //  $("#indicator").carousel( "last", {
  //    faseInDuration:2000,
  //    fadeOutDuration:3000,
  //    onChange:function(){
  //      alert("CHANGED!");
  //    }
  //  });
  //
  //  Set Auto play delay
  //  $("#indicator").carousel("play", {
  //    delay:2000,
  //    onChange:function(){
  //      console.log("CHANGED!");
  //    }
  //  });
  //
  $.fn.carousel = function( order, options ){

    var self = this;

    // start auto play
    var play = function( delay ){
      if( self.data("isPlay") ){
        // Break function
        return this;
      }
      self.data("isPlay", true );
      var intervalId = setInterval(function(){
        self.carousel("next");
      }, delay);
      self.data( "playIntervalId", intervalId );
    };
    // toggle auto play
    var togglePlay = function(){
      if( self.data("isPlay") ) stop();
      else play( settings.delay );
    };
    // stop auto play
    var stop = function(){
      if( !self.data("isPlay") ){
        return this;
      }
      clearInterval( self.data("playIntervalId") );
      self.data("isPlay", false );
      // clear variables
      self.removeData( "playIntervalId" );
    };


    // default settings
    var settings = {
      delay:6000
    };
    // Override default settings from arguments 2
    if( options != null && typeof(options) === "object" ){
      // settings <= options
      $.extend( settings, options );
    }


    var range = $(this).children().length - 1;
    var index;

    // Order is a Number
    if( !isNaN(order) ){
      index = Math.max( 0, Math.min(range, order) );
      self.changeCarouselAt( index, settings );
      return self;
    }
    // Order from String
    else if( typeof(order) === "string" ){
      // Get currentry Index for Absolute order
      var currentIndex = this.children().index($($(".active",this)[0]));
      // Normalize a command word
      // toggle-play togglePlay toggle_play -> TOGGLEPLAY
      // play Play -> PLAY
      switch( order.replace(/[\-\_]/g, "").toUpperCase() ){
        case "NEXT":
          index = currentIndex + 1;
          if( index > range ) index = 0;
          self.changeCarouselAt( index, settings );
          break;
        case "PREV":
          index = currentIndex - 1;
          if( index < 0 ) index = range;
          self.changeCarouselAt( index, settings );
          break;
        case "FIRST":
          self.changeCarouselAt( 0, settings );
          break;
        case "LAST":
          self.changeCarouselAt( range, settings );
          break;
        case "PLAY":
          play( settings.delay );
          break;
        case "TOGGLEPLAY":
          togglePlay();
          break;
        case "STOP":
          stop();
          break;
        default:
          return this;
      }
    }
    // Order is not string or number
    else{
      return this;
    }

    return this;
  }
}(jQuery);
