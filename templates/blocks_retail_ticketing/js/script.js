$(function(){
	app.main.init();
});


var app = {};


// ------------------------------------- //
// MAIN
// ------------------------------------- //

app.main = (function(){
	
	var _self = {};
	
	function init(){
		app.imageStretch.init();
		app.helper.init();
		app.adjustRatio.init();
		app.sizeToFit.init();
		app.swipeContent.init();
		app.marquee.init();
	} // init()
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();



// ------------------------------------- //
// IMAGE TREATMENT
// ------------------------------------- //

app.imageStretch = (function(){
	
	var _self = {};
	
	function init(){
		
		$('figure').each(function(){
			var _figure = $(this),
				_img    = _figure.children('img');
				
			if( _img.length === 1 ){
				_figure.css({
					backgroundImage : 'url('+_img.attr('src')+')'
				});
				_img.remove();
				
			}
		});
		
	} // init()
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();



// ------------------------------------- //
// WATCH WINDOW RATIO
// ------------------------------------- //

app.adjustRatio = (function(){
	
	var _self = {},
		_window,
		_windowWidth,
		_windowHeight,
		_windowRatio,
		_ratio = { min : 9/16, max: 16/9 },
		_fontSize = { min : 9, max: 24, span: 15 },
		_breakPoints = {min: 600, max: 1920, span: 1320 },
		_body,
		_container;


	
	function init(){
		_window    = $(window);
		_body      = $('body');
		_container = $('#container');
		
		updateDimensions();
		chooseOrientation();
		watchMinMaxRatio();
		adjustFontSize();
		bindEvents();
	} // init


	
	function bindEvents(){
		_window.on('resize', function(){
			updateDimensions();
			chooseOrientation();
			watchMinMaxRatio();
			adjustFontSize();
		});
	} // bindEvents



	function chooseOrientation(){
		var _oldOrientation = ( _body.hasClass('landscape')  ? 'landscape' : ( _body.hasClass('portrait') ? 'portrait' : 'not set')) ,
			_newOrientation;
			
		if( _windowRatio > 1 ){
			_body.removeClass('portrait').addClass('landscape');
			_newOrientation = 'landscape';
		}
		else {
			_body.removeClass('landscape').addClass('portrait');
			_newOrientation = 'portrait';
		}
		
		if( _oldOrientation != 'not set' && _oldOrientation !== _newOrientation ){
			// orientation has changed, trigger iscroll reset
		}
	}
	
	
	
	function watchMinMaxRatio(){
		var _css = {},
			_adjust = false;
		
		// R = W/H;
		// W = R*H;
		// H = W/R;
		
		if( _body.hasClass('blocks') ){
			return;
		}
		
		if( _windowRatio > _ratio.max ){
			_css = {
				width  : Math.round(_ratio.max*_windowHeight)+'px',
				height : '100%',
				top    : '0',
				left   : '0' //Math.round((_windowWidth-(_ratio.max*_windowHeight))/2)+'px'
			};
			_adjust = true;
		}
		else if( _windowRatio < _ratio.min ){
			_css = {
				width  : '100%',
				height : Math.round(_windowWidth/_ratio.min)+'px',
				top    : '0', //Math.round((_windowWidth-(_ratio.max*_windowHeight))/2)+'px',
				left   : '0'
			};
			_adjust = true;
		}
		
		if( _adjust ){
			_container.css(_css);
		}
		else {
			_container.removeAttr('style');
		}
	}
	

	
	function adjustFontSize(){
		var _setSize = _fontSize.min,
			_containerWidth = _container.width();
		
		if( _containerWidth <= _breakPoints.min ){
			
		}
		else if( _containerWidth > _breakPoints.max ){
			_setSize = _fontSize.max;
		}
		else {
			_setSize = _fontSize.min + ( (1-(_breakPoints.max-_containerWidth)/_breakPoints.span)*_fontSize.span );
		}
		
		_body.css({
			fontSize : _setSize+'px'
		});
	}



	function updateDimensions(){
		_windowWidth  = _window.width();
		_windowHeight = _window.height();
		_windowRatio  = _windowWidth/_windowHeight;
		
		// log(_windowWidth+'x'+_windowHeight+'('+_windowRatio+')');
	} // updateDimensions
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();


// ------------------------------------- //
// EXAMPLE
// ------------------------------------- //

app.sizeToFit = (function(){
	
	var _self = {},
		_elements,
		_timeout;
	
	
	
	function init(){
		_elements = $('.size_to_fit');
		setTimeout(fitAllElements,500);
		bindEvents();
	} // init()
	
	
	
	function bindEvents(){
		$(document).on('load', function(){
			fitAllElements();
		});
		
		$(window).on('resize', function(){
			// log('calling fit');
			_elements.hide();
			clearTimeout(_timeout);
			_timeout = setTimeout(fitAllElements,250);
		});
	}
	
	
	
	function fitAllElements(){
		// log('FITTING NOW!');
		_elements.show();
		_elements.each(function(){
			fitElement($(this));
		});
		
		if( $('html').hasClass('product_listing_page') || $('html').hasClass('price_list_text_only_page') ){
			equalFontSize('.textbox .size_to_fit');
		}
	}
	
	function equalFontSize(_selector){
		var _elements = $(_selector),
			_smallest = 0;
			
		if( _elements.length === 0 ){ return; }
		
		_elements.each(function(){
			var _fontSize = parseInt($(this).css('font-size'),10);
			// log('font size: '+_fontSize);

			if( _smallest === 0 || _fontSize < _smallest ){
				_smallest = _fontSize;
			}
		}).css({
			fontSize: _smallest+'px'
		});
	}
	
	
	function fitElement(_el){
		// log('fitting element');
		
		_el.hide();
		
		var _maxFontSize = 200,
			_parent    = _el.parent(),
			_maxWidth  = _parent.width(),
			_maxHeight = _parent.height();
			
		_el.show().css({
			opacity : 0
		});
		
		// log('Max dimensions are '+_maxWidth+'x'+_maxHeight);	
			
		for(var i = 10, incr = 10, c = 0, stop = false; i < _maxFontSize && !stop; i+=incr){
			_el.css('font-size',i+'px');
			var _elWidth  = _el.outerWidth(),
				_elHeight = _el.outerHeight();
			
			// log(''+_elWidth+'x'+_elHeight+' at '+i+'px');
			
			c++;
			
			if( incr === -1 && (_elWidth <= _maxWidth && _elHeight <= _maxHeight) ){
				stop = true;
			}
			if( _elWidth > _maxWidth || _elHeight > _maxHeight ){
				incr = -1;
			}
		}
		// log(c+' loops, setting to '+i);
		
		_el.css({
			fontSize : (i)+'px',
			opacity: 1
		});
	}
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();


// ------------------------------------- //
// iSCROLL INTEGRATION
// ------------------------------------- //

app.swipeContent = (function(){
	
	var _self = {},
		_contentWrap,
		_contentElements,
		_elCount = 0,
		_scrollObj;
	
	function init(){
		_contentWrap     = $('.content_wrap');
		_contentElements = _contentWrap.children();
		_elCount         = _contentElements.length;
		
		if( _elCount > 1 ){
			
			_contentWrap.addClass('float_children has_'+_elCount+'_children');
			_scrollObj = new iScroll(_contentWrap.parent()[0],{
				momentum   : false,
				snap       : true
			});
		}
	} // init()
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();




// ------------------------------------- //
// GENERAL HELPER METHODS
// ------------------------------------- //

app.helper = (function(){
	
	var _self = {};
	
	function init(){
		
		lr2br(); // replace line breaks with <br>
		price_list_text_only_page(); // template helper
		
	} // init()
	
	
	function lr2br(){
		$('.lr2br').each(function(){
			var _this = $(this),
				_text = $.trim(_this.html());

			_text = _text.replace(/\n/g, '<br />');
			_this.html(_text);
		});
	}
	
	
	function price_list_text_only_page(){
		if( $('html').hasClass('price_list_text_only_page') ){
			
			$('.list_item').each(function(){
				var _this = $(this),
					_h2   = $.trim(_this.find('h2').text());
					
				if( _h2.length === 0 ){
					_this.remove();
				}
			});
			
		}
	}
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();



// ------------------------------------- //
// MARQUEE
// ------------------------------------- //

app.marquee = (function(){
	
	var _self = {},
		_footer,
		_marquee,
		_speed = 50,
		_timeout;
	
	function init(){
		_footer = $('#container').children('footer').first();
		_marquee = $('.marquee').first();
		
		addSeparators();
		
		initMarquee();
		bindEvents();
	} // init()
	
	function addSeparators(){
		_marquee.children('span').first().siblings().before(' &bull; ');
	}
	
	function bindEvents(){
		$(window).on('resize', function(){
			_marquee.hide();
			clearTimeout(_timeout);
			_timeout = setTimeout(initMarquee,250);
		});
	}
	
	function initMarquee(){
		var _footerHeight = _footer.height(),
			_footerWidth  = _footer.width(),
			_marqueeWidth,
			_duration;
		
		_marquee
			.stop()
			.css({
				left: _footerWidth+'px',
				fontSize   : Math.round(_footerHeight*.6)+'px',
				lineHeight : Math.round(_footerHeight*1)+'px'
			})
			.show();
			
		_marqueeWidth = _marquee.width();
			
		_duration = Math.round((_marqueeWidth/_speed)*1000);
		// log('animation speed '+_duration+'ms')	
		_marquee
			.show()
			.animate({
				left : '-'+_marqueeWidth+'px'
			},_duration, 'linear', function(){
				initMarquee();
			});
		
	}
	
	_self = {
		init : init
	};
	
	return _self;
	
})();




// ------------------------------------- //
// EXAMPLE
// ------------------------------------- //

app.example = (function(){
	
	var _self = {};
	
	function init(){
		
	} // init()
	
	
	
	_self = {
		init : init
	};
	
	return _self;
	
})();