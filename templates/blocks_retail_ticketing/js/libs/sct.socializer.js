/*******************************************************************************
	SCT Socializer jQuery Plugin
	www.sct.com.au
	version 1.1.1

	If you make any changes, please re-compress and replace
	old version in plugin.js

	Inspired by Heise's socialSharePrivacy plugin
	(http://www.heise.de/extras/socialshareprivacy/)

	Usage:

	$('#element').sct_socializer({
		facebook: true,
		twitter : true,
		googleplus: true,
		linkedin: true,
		facebookActive: false,
		twitterActive : false,
		googleplusActive: false,
		linkedinActive: false
	});

	Changes:

	1.1.1
	Removed label 'share' from generated html
	User can click on placeholder as well

	1.1
	HTML is injected by the plug-in
	All shown networks are controlled by the arguments passed to the plug-in
	Initialisation flow moved inside the plug-in

*******************************************************************************/


(function($) {

	$.sct_socializer = function(element, options) {

		var defaults = {
			facebook 					: true,
			twitter 					: true,
			googleplus 				: true,
			linkedIn 					: true,
			email 						: true,
			all 							: false,
			facebookActive		: false,
			twitterActive			: false,
			googleplusActive	: false,
			linkedInActive 		: false,
			allActive					: false,
			like_uri					: document.location.href,
			tweetText					: 'Visit '
		}

		var settings = {};

		var $element = $(element),
				element = element;

		function init() {
			settings = $.extend({}, defaults, options);
			settings.like_uri = cleanLikeUri(settings.like_uri);
			insertHtml();
			activateServices();
			bindToggle();
		}

		function insertHtml(){
			var html = getHtml();
			$element.append(html);
		}

		function getHtml(){

			function getServiceHtml(service, label){
				var s = "";

				s +=	'<div class="network '+service+'">';
				s +=	'	<div class="toggle"></div>';
				s +=	'	<div class="placeholder"><span>'+label+'</span></div>';
				s +=	'	<div class="service"></div>';
				s +=	'	<div class="clearfix"></div>';
				s +=	'</div>';

				return s;
			}

			var html = "";
			
			html += '<div class="social_sharing_inner">';

			if(settings.facebook) html +=	getServiceHtml('facebook', 'Facebook');
			if(settings.twitter) html +=	getServiceHtml('twitter', 'Twitter');
			if(settings.googleplus) html +=	getServiceHtml('googleplus', 'Google Plus');
			if(settings.linkedin) html +=	getServiceHtml('linkedin', 'LinkedIn');	

			if(settings.email){ 
				html +=	'<div class="network email">';
				html +=	'	<div class="placeholder">';
				html +=	'		<a href="mailto:info@sct.com.au">Email</a>';
				html +=	'	</div>';
				html +=	'</div>';
			}
			
			html +=	'</div> <!-- eo .social_sharing -->';

			return html;
		}

		function cleanLikeUri(like_uri) {
			like_uri = ( like_uri.indexOf('?') >= 0 ) ? like_uri.split('?')[0]  : like_uri ;
			return encodeURIComponent(like_uri);
		}

		function activateServices(){
			if(settings.allActive || settings.facebookActive) activateFacebook();
			if(settings.allActive || settings.twitterActive) activateTwitter();
			if(settings.allActive || settings.googleplusActive) activateGooglePlus();
			if(settings.allActive || settings.linkedinActive) activateLinkedIn();
		}

		function bindToggle(){
			$element.delegate('.toggle, .placeholder', 'click', function(){
				var $toggle = $(this),
						$network = $toggle.parent(),
						network = getNetworkName($network);

				if( $network.hasClass('active') ){
					// turn off
					deactivateNetwork(network);
				}else{
					activateNetwork(network);
				}
			});
		}

		function getNetworkName($ele){
			if( $ele.hasClass('facebook') ) return 'facebook';
			if( $ele.hasClass('twitter') ) return 'twitter';
			if( $ele.hasClass('googleplus') ) return 'googleplus';
			if( $ele.hasClass('linkedin') ) return 'linkedin';
		}

		function activateNetwork(network){
			if(network==='facebook') activateFacebook();
			if(network==='twitter') activateTwitter();
			if(network==='googleplus') activateGooglePlus();
			if(network==='linkedin') activateLinkedIn();
		}

		function activateFacebook() {
			var $network = $element.find('.facebook'),
				facebookIframeCode = '<iframe src="http://www.facebook.com/plugins/like.php?locale=en_EN&amp;href=' + settings.like_uri + '&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action=recommend&amp;colorscheme=light&amp;font&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:145px; height:21px;" allowTransparency="true"></iframe>';

			$network.children('.service').append(facebookIframeCode);

			swapDOMActiveState($network, true);
		};

		function activateTwitter() {
			var $network = $element.find('.twitter'),
				twitterIframeCode = '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url=' + settings.like_uri + '&amp;counturl=' + settings.like_uri + '&amp;text=' + settings.tweetText + '&amp;count=horizontal&amp;lang=en" style="width:130px; height:25px;"></iframe>';

			$network.children('.service').append(twitterIframeCode);

			swapDOMActiveState($network, true);
		};

		function activateGooglePlus() {
			var $network = $element.find('.googleplus'),
				googlePlusCode = '<g:plusone href="'+settings.like_uri+'" size="medium"></g:plusone>';

			function addGoogleScript() {
				var po   = document.createElement('script');
				po.type  = 'text/javascript';
				po.async = true;
				po.src   = 'https://apis.google.com/js/plusone.js';

				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(po, s);
			}

			$network.children('.service').append(googlePlusCode);

			swapDOMActiveState($network, true);

			addGoogleScript();
		};
		
		function activateLinkedIn(){
			var $network = $element.find('.linkedin'),
				linkedInCode = '<script src="http://platform.linkedin.com/in.js" type="text/javascript"></script><script type="IN/Share" data-url="'+settings.like_uri+'" data-counter="right"></script>';
				
			$network.children('.service').append(linkedInCode);

			swapDOMActiveState($network);
		};

		function swapDOMActiveState($network, state){
			if(state){
				$network.addClass('active').children('.toggle').addClass('active');
			}else{
				$network.removeClass('active').children('.toggle').removeClass('active');
			}
		}

		// REMOVING A SERVICE AGAIN

		function deactivateNetwork(network) {
			var $network = $element.find('.'+network);

			$network.children('.service').html('');

			swapDOMActiveState($network, false);

			// GooglePlus uses additional script, remove when service is deactivated
			if( network==='googleplus' ) {
				$('script').each(function(){
					var _script = $(this),
						_src = _script.attr('src');

					if( _src && _src.indexOf('plus.google.com') ){
						_script.remove();
						return;
					}
				});
			}
		};

		//expose public functions
		this.activateGooglePlus = activateGooglePlus;
		this.activateLinkedIn = activateLinkedIn;
		this.activateTwitter = activateTwitter;
		this.deactivateNetwork = deactivateNetwork;

		// INIT
		init();

		function log(msg){
			console.log(msg);
		}

	}//$.sct_socializer

	// add the plugin to the jQuery.fn object
	$.fn.sct_socializer = function(options) {
		return this.each(function() {
			var _socialWrap = $(this);
			if (undefined == _socialWrap.data('sct_socializer')) {
				var plugin = new $.sct_socializer(this, options);
				_socialWrap.data('sct_socializer', plugin);
			}
		});//this each
	}//add to jquery prototype

})(jQuery);

