/* @version 2.0 jColor
 * @author Dennis Hernández - djhvscf
 * @webSite: 
 * jColor is a jQuery plugin that allow know and modify the color of DOM elements
 */

;(function ($) {
    'use strict'
    $.fn.jColor = function () {
		var base = this;
		base.backgroundColor = this.css("background-color");
		var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
		
		var methods = 
		{
			hexToR: function (h)
			{
				return parseInt((cutHex(h)).substring(0,2),16);
			},

			hexToG: function (h) 
			{
				return parseInt((cutHex(h)).substring(2,4),16);
			},

			 hexToB:function(h) 
			{
				return parseInt((cutHex(h)).substring(4,6),16);
			},

			 cutHex:function(h) 
			{
				return (h.charAt(0)=="#") ? h.substring(1,7):h;
			},
			
			RGBToHex: function (RGB) {
				RGB = methods.getRGBArray(RGB);
				return "#" + methods.hex(RGB[0]) + methods.hex(RGB[1]) + methods.hex(RGB[2]);
			},
			
			hex : function (x) {
			  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
			},
			
			getRGBArray : function(RGB){
				RGB = RGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				return [RGB[1], RGB[2], RGB[3]];
			},
			
			getHSVFromRGB : function(RGB) 
			{
				if($.isArray(RGB)){
					var r,g,b,h,s,v, min, max, delta;
					r= RGB[0];
					g= RGB[1];
					b= RGB[2];
					min = Math.min( r, g, b );
					max = Math.max( r, g, b );

					v = max;
					delta = max - min;
					if( max != 0 )
						s = delta / max;        // s
					else {
						// r = g = b = 0        // s = 0, v is undefined
						s = 0;
						h = -1;
						return [h, s, undefined];
					}
					if( r === max )
						h = ( g - b ) / delta;      // between yellow & magenta
					else if( g === max )
						h = 2 + ( b - r ) / delta;  // between cyan & yellow
					else
						h = 4 + ( r - g ) / delta;  // between magenta & cyan
					h *= 60;                // degrees
					if( h < 0 )
						h += 360;
					if ( isNaN(h) )
						h = 0;
					return [h,s,v];
				}
				else{
					$.error("RGB must be an Array!");
					return this;
				}
			},
			
			getRGBFromHSV : function(HSV) {
				
				if($.isArray(HSV)){
					var h,s,v,r,g,b,f,p,q,t,i;
					h= HSV[0];
					s= HSV[1];
					v= HSV[2];
					if(s === 0 ) {
						// achromatic (grey)
						r = g = b = v;
						return [r,g,b];
					}
					h /= 60;            // sector 0 to 5
					i = Math.floor( h );
					f = h - i;          // factorial part of h
					p = v * ( 1 - s );
					q = v * ( 1 - s * f );
					t = v * ( 1 - s * ( 1 - f ) );
					switch( i ) {
						case 0:
							r = v;
							g = t;
							b = p;
							break;
						case 1:
							r = q;
							g = v;
							b = p;
							break;
						case 2:
							r = p;
							g = v;
							b = t;
							break;
						case 3:
							r = p;
							g = q;
							b = v;
							break;
						case 4:
							r = t;
							g = p;
							b = v;
							break;
						default:        // case 5:
							r = v;
							g = p;
							b = q;
							break;
					}
					return [r,g,b];
				}else{
					$.error("HSV must be an Array!");
					return this;
				}
			}
		};
		
		base.saySomething = function(message){
			$(base).each(function(){
				$(this).html($.isArray(message) ? message.join() : message);
			});
				return base;
		};
			
		base.getHex = function(){
			return methods.RGBToHex(base.backgroundColor);
		};
		
		base.getRGBjoin = function(){
			return methods.getRGBArray(base.backgroundColor).join();
		};
		
		base.getRGB = function(){
			return methods.getRGBArray(base.backgroundColor);
		};
		
		base.setLuminance = function(luminance){
			luminance = luminance || 0;
			var hexColor = methods.RGBToHex(base.backgroundColor);
			
			hexColor = String(hexColor).replace(/[^0-9a-f]/gi, '');
			if (hexColor.length < 6) {
				hexColor = hexColor[0]+hexColor[0]+hexColor[1]+hexColor[1]+hexColor[2]+hexColor[2];
			}
			
			var rgb = "#", c;
			for (var i = 0; i < 3; i++) {
				c = parseInt(hexColor.substr(i * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + (c * luminance)), 255)).toString(16);
				rgb += ("00" + c).substr(c.length);
			}
			
			return rgb;
		};
		
		base.setColor = function(hex){
			this.css("background-color", hex);
			return this;
		};
		
		base.getHSVFromRGB = function(RGB){
			return methods.getHSVFromRGB(RGB);
		};
		
		base.getHSVFromHex = function(hex){
			return this.getHSVFromRGB(this.getRGB(hex));
		};
		
		/*Working on
		base.getRGBFromHSV = function(HSV){
			return methods.getRGBFromHSV(HSV);
		};
		*/
		return this;
    };
})(jQuery);