/**
 * The MIT License (MIT)
 * Copyright (c) 2018, Etienne Cochard
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 **/

 
/**
 * basic Color class
 *
 * 	Color(red,green,blue,alpha=1)
 * 	Color('#fff')
 * 	Color('#ffffff')
 * 	Color('rgb(255,255,255)')
 * 	Color('rgba(255,255,255,1)')
 */

class Color
{
    constructor( r, g, b, a ) {

        this._cache = null;

        if( isString(r) ) {
            this._parse(r);
        }
        else if( isObject(r) ) {
            this.r = r.r || 0;
            this.g = r.g || 0;
            this.b = r.b || 0;
            this.a = r.a || 1;
        }
        else {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
            this.a = a || 1;
        }
    }

    static fromStyle( name ) {
        return new Color( getStyleRuleValue( name ).color );
    }

    /**
     * @internal parse the string
     */
    
    _parse( s ) {
        let c;
        
        // #fff
        if( s.length===4 ) {
            this.r = parseInt(s[1]+s[1],16);
            this.g = parseInt(s[2]+s[2],16);
            this.b = parseInt(s[3]+s[3],16);
            this.a = 1;
        }
        // #ffffff
        else if( s.length===7 ) {
            this.r = parseInt(s.substr(1,2),16);
            this.g = parseInt(s.substr(3,2),16);
            this.b = parseInt(s.substr(5,2),16);
            this.a = 1;
        }
        // #ffffff40 (color with alpha)
        else if( s.length===9 ) {
            this.r = parseInt(s.substr(1,2),16);
            this.g = parseInt(s.substr(3,2),16);
            this.b = parseInt(s.substr(5,2),16);
            this.a = parseInt(s.substr(7,2),16) / 255;
        }
        //	rgb(r,g,b)
        else if( (c=Color.re_rgb.exec(s))!==null ) {
            this.r = c[1];
            this.g = c[2];
            this.b = c[3];
            this.a = 1;
        }
        //	rgba(r,g,b,a)
        else if( (c=Color.re_rgba.exec(s))!==null ) {
            this.r = parseInt( c[1], 10 );
            this.g = parseInt( c[2], 10 );
            this.b = parseInt( c[3], 10 );
            this.a = parseFloat( c[4], 10 );
        }
        // wtf ?
        else {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.b = 1;
        }
    }

    /**
     * convert the color to string
     */
    
    toString( ) {
        if( !this._cache ) {
            if( this.a===1 ) {
                this._cache = 'rgb('+this.r+','+this.g+','+this.b+')';
            }
            else {
                this._cache = 'rgba('+this.r+','+this.g+','+this.b+','+roundTo(this.a,4)+')';	
            }
        }

        return this._cache;
    }

    /**
     * return a new Color with this alpha
     * @param  {Float} a - alpha
     * @return {Color}
     */
    
    alpha( a ) {
        if( a<0.0 ) { 
			a = 0; 
		}
		else if( a>1.0 ) {
			a = 1;
		}

        return new Color(this.r,this.g,this.b,a);
    }

    /**
     * return a new color lightened by v (range -100 to 100)
     * @param  {Float} v - value to apply
     * @return {Color}
     */
    
    lighten( v ) {
        if( v<-100 ) {
			v = -100; 
		}
        else if( v>100 ) {
			v = 100; 
		}
        
        let {h,l,s} = this._rgbToHls( this.r, this.g, this.b );
        l += (v/100) * 255;
        let {r,g,b} = this._hlsToRgb( h, l, s );

        return new Color( Math.round(r), Math.round(g), Math.round(b), this.a );
    }

    /**
     * return a new color darkened by v (range -100 to 100)
     * @param  {Float} v - value to apply
     * @return {Color}
     */
    
    darken( v ) {
        return this.lighten( -v );
    }

    /**
     * convert rgb to hls
     */
    
    _rgbToHls( r, g, b ) {
                
        let max = Math.max(r, g, b), 
            min = Math.min(r, g, b);        

        let l = (max + min) / 2,
            h, s;
        
        if( max==min ) {	// achromatic
            h = s = 0; 
        } 
        else {
            let d = max - min;

            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch( max ) {
				default:
                case r: {
					h = (g - b) / d + (g < b ? 6 : 0); 
					break;
				}

                case g: {
					h = (b - r) / d + 2;
					break;
				}

                case b: {
					h = (r - g) / d + 4; 
					break;
				}
            }
            
            h /= 6;
        }

        return {h,l,s};
    }

    /**
     * convert hls to rgb
     */
    
    _hlsToRgb( h, l, s ) {
        
        function hue2rgb( p, q, t ) {
            if(t < 0) {
				t += 1;
			}

            if(t > 1) {
				t -= 1;
			}

            if(t < 1/6) {
				return p + (q - p) * 6 * t;
			}

            if(t < 1/2) {
				return q;
			}

            if(t < 2/3) {
				return p + (q - p) * (2/3 - t) * 6;
			}

            return p;
        }

        let r, g, b;

        if( s==0 ) {	// achromatic
            r = g = b = l; 
        } 
        else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {r,g,b};
    }
}

Color.re_rgb = /^\s*rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/;
Color.re_rgba = /^\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)\s*\)\s*$/;

Color.WHITE = new Color(255,255,255);
Color.BLACK = new Color(0,0,0);
