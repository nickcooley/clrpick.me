/*  HSL Color Wheel js  
	Sass pickr
	sassclrwhl


	leverages https://github.com/brehaut/color-js color library

*/

var Color = net.brehaut.Color;

$(function(){
	
	$(window).bind('wheelsup', function(){
		$('html').removeClass('sass');
		
		pageUtilities.init();
		
		var pi = new PickrInterface();
		pi.init();	
		formUtilities.init(pi);
		
	});


	pageUtilities.pageSetup();

});

function Pickr(){
	//this.origColor = color;
}

Pickr.prototype = {
	init: function(){
		this.wheelItems = 360;
		this.stripItems = 10;
		
		this.origColor = Color($('div.wheel > ul li:eq(0)').css('background-color')).toCSS();
		this._changeOrigColor(this.origColor);

	},
	_changeOrigColor: function(color){
		//TODO: when clicking on a color in the wheel, create some sort of animation to show people the color is changing
		this.origColor = Color(color);
		this._generateHueVals();
		this._generateSatVals();
		this._generateLightVals();
		this._generateRelationships();
	},
	_generateHueVals: function(){
		var newColors = [],
			DOMWheel = $('div.wheel > ul li'),
			$currentColor = $('div.currentColor');

		for(i = 0; i < this.wheelItems + 1; i++){
			var newHue = this.origColor.shiftHue(i).toCSS();
			$(DOMWheel[i]).css('background-color', newHue );

			messaging.changeMessage(DOMWheel[i], '<h5>Color Info</h5><p>' + i+ ' &deg;</p><p>' + newHue +'</p>' );
		}
		$currentColor
			.find('li.swatchColor').html(this.origColor.toCSS()).css('color', this.origColor.toCSS()).end()
			.find('li.swatch').css('background-color', this.origColor.toCSS()).end()
			.find('li.hue i').html(Math.round(this.origColor.getHue())).end()
			.find('li.sat i').html((Math.round(this.origColor.getSaturation()* 100))+ '%').end()
			.find('li.light i').html(Math.round(this.origColor.getLightness()* 100) + '%');		
	
	},
	_generateSatVals: function(){
		var sat = $('div.sat li'), 
			lightestSat = this.origColor.setSaturation(0), 
			DOMsat = $('div.strip.sat li');

		for(i = 0; i < this.stripItems + 1; i++){
			var factor = i * .1,
				newSat = lightestSat.setSaturation(factor).toCSS();
			$(DOMsat[i]).css('background-color', newSat);

			messaging.changeMessage(DOMsat[i], '<h5>Color Info</h5><p>Saturation: ' + newSat + ' </p><p>' + Math.round(factor * 100) +'%</p>' );
		}

	},
	_generateLightVals: function(){
		var light = $('div.sat li'), 
			lightest = this.origColor.setLightness(0), 			
			DOMlight = $('div.light.light li');

		for(i = 0; i < this.stripItems + 1; i++){
			var factor = (i * .1),
				newLight = lightest.setLightness(factor).toCSS();
			$(DOMlight[i]).css('background-color', newLight);

			messaging.changeMessage(DOMlight[i], '<h5>Color Info</h5><p>Lightness: ' + newLight + ' </p><p>' + Math.round(factor * 100) +'%</p>' );
		}
	},
	_generateRelationships: function(){
		var DOMrel = $('nav.relationships'),
			complements = this.origColor.complementaryScheme();
			
			$('body').css('background-color',Color(complements[1]).setLightness(.9).toCSS());
			DOMrel.find('li.complement').css('background-color', Color(complements[1]).toCSS() )
			//console.log(complements[1].toCSS());
	}
}

function PickrInterface(){

}
PickrInterface.prototype = {
	init: function(){
		this.pickr = new Pickr();
		this.pickr.init();
		this.bindColors();
		this.bindScheme();
	},
	changeOrigColor: function(color){
		this.pickr._changeOrigColor(color);
	},
	bindColors: function(){
		var that = this;
		
		$('div.wheel li, div.strip li').live('click',function(e){
			e.preventDefault();
			var newColor = Color($(this).css('background-color'));
					
			that.changeOrigColor(newColor);

		});
	},
	bindScheme: function(){
		var 	$form 		= $('form.schemes'), 
				$swatches 	= $('div.wheel > ul > li'), 
				that		= this;
		
		
		for(el in schemes){
			var key 	= el,
				value 	= schemes[el];
			
			$('form')
				.find('input[value=' + key + ']')
				.change(function(k, v){
					//$swatches.parent().find('li.scheme').removeClass('scheme');
					
					return function(e){
						that.resetScheme();
						for(i=0; i < v.length; i++){
							$swatches.parent().find('#swatch'+v[i])
								.addClass('scheme')
								.find('span')
								.prepend('<h4>' + removeUScore(k) + '</h4>');							
						}
					}
				}(key, value));
			
			function removeUScore(val){
				val = val.split('_');
				return val.join(' ');
			}			
		}		 
	}, 
	resetScheme: function(){
			var $swatches 	= $('div.wheel > ul > li');
			$swatches.parent()
				.find('li.scheme')
				.find('span > h4').remove()
				.end()
				.removeClass('scheme');
				
		}

}


var formUtilities = {
	init: function(pi){
		//TODO: find regex for colors
		var that = this, 
			$form = $('form'),
			$newColor = $form.find('fieldset.newColor');
			this.pick = pi;
		$form.bind('submit', function(e){
			e.preventDefault();			
		})
		$newColor.find('button').bind('click',function(e){
			e.preventDefault();
			that.pick.changeOrigColor($newColor.find('input[type=text]').val());



		})
	},

	newColor: function(){}
}

var pageUtilities = {
	init: function(){
		//this.pageSetup();
		this.bindNavLinks();
	},
	pageSetup: function(){
		var increments = 360, 
              degIncrem = 360/increments;
             //simply using jquery to inject the necessary number of elements onto the page.
              

          for(i=0; i< 10 + 1; i++){
            $('<li><span></span></li>').appendTo('div.sat > ul');
          }
          for(i=0; i< 10 + 1; i++){
            $('<li><span></span></li>').appendTo('div.light > ul');
          }

          //simply using jquery to inject the necessary number of elements onto the page
          for(i=0; i< increments + 1; i++){
            $('<li id="swatch' + i*degIncrem + '"><span></span></li>').appendTo('div.wheel > ul');            
          }

          $(window).trigger('wheelsup')


	},
	bindNavLinks: function(){
		var $links = $('header nav a'),
			$pages = $('section.flyout'),
			$linksa = $('a'),
			 rndm  = 0;

			$linksa.each(function(){
				rndm++;
				$(this).attr('target', 'win' + rndm);

			})

			$('<div class="close"></div>').appendTo($pages);

			$links.click(function(e){
				e.preventDefault();
				var h = $(this).attr('href'),
					h = h.substr(1, h.length);

				$pages.filter('section.expanded').trigger('close');
				$pages.filter('section:has(a[name=' + h + '])').trigger('open')

			});



			$pages.bind('open', function(e){				
				$(this).slideDown(500, function(){
					$(this).addClass('expanded');
				});
			}).bind('close', function(e){
				$(this).slideUp('500', function(){
					$(this).removeClass('expanded');
				})
			}).find('div.close').click(function(e){
				$(this).parent().trigger('close');
			})


	}
}

var schemes = {
	"none": [],
	"complementary": [180],
	"triad": [120, 240],
	"analogous": [30, 330],
	"split_complementary": [150,210],
	"rectangle": [120, 180, 300],
	"square": [90, 180, 270]
}

var messaging = {
	changeMessage: function(dom, msg){
		var $dom = $(dom);

		if(!$dom.is('span')){
			$dom = $dom.find('span');
		}

		$dom.html(msg);
	}
}
