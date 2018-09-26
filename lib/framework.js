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

 
"use strict";

/* eslint-env browser */
/* global i18n, exact */


function iif( test, desc ) {
    return (test !== undefined && test !==false) ? desc : null;
}                
/**
 * The HTMLElement interface represents any HTML element.<br/>Some elements directly implement this interface, others implement it via an interface that inherits it.
 * @typedef HTMLElement
 */



/**
 * round a value to n decimals
 * @param  {Number} v    value to round
 * @param  {Number} ndec number of decimals
 * @return {Number}
 */

function roundTo( v, ndec ) {
	let mul = Math.pow(10, ndec);
	return Math.round(v*mul) / mul;
}

/**
 /**
 * test if a variable is a String
 * @param  {any} variable to test
 * @return {Boolean}
 */

function isString( a ) {
	return 	!!a && a.constructor===String;
}

/**
 * test if a variable is an Array
 * @param  {any} variable to test
 * @return {Boolean}
 */

function isArray( a ) {
	return 	!!a && a.constructor===Array;
}

/**
 * test if a variable is an object
 * @param  {any} variable to test
 * @return {Boolean}
 */

function isObject( a ) {
	return 	!!a && a.constructor===Object;
}

/**
 * test if a variable is a function
 * @param  {any} variable to test
 * @return {Boolean}
 */

function isFunction( a ) {
	return 	!!a && a.constructor===Function;	
}

/**
 * test is a value is numeric
 * @param {*} value - value to test
 * @return {boolean} false for strings, false for undefined
 */

function isNumeric( value ) {
    return typeof value === "number"
}


function hasTouch( ) {
    return ( 'ontouchstart' in window );
}

/**
 * execute some code as soon as possible
 * @param {function} fn callback to execute
 * @example 
 * asap( () => {
 *  // ... do something
 * });
 */

function asap( fn ) {
    setTimeout( fn, 0 );
}

/**
 * copy properties from config to object
 * @param {object|null} object - destination object to apply properties
 * @param {object} config - elements to copy to destination
 * @param {object|null} def - default values
 * @return new object with values copied
 */

function apply( object, config, def ) {
    
        if( def ) {
            apply( object, def );
        }
    
        if( isObject(config) ) {
            object = Object.assign( object || {}, config );
        }
    
        return object;
    }
    

/**
 * copy missing elements from an object to another
 * used to set default parameters
 * @param {object} obj destination object
 * @param {object} values  default values
 */

function setDefaults( obj, values ) {

    for( let p in values ) {
        if( values.hasOwnProperty(p) && !obj.hasOwnProperty(p) ) {
            obj[p] = values[p];
        }
    }
}


/**
 * The timer class is a wrap around timer creation / destruction.
 * @example 
 * let t = new Timer( {
 *  delay: 100,
 *  onTrigger: ( ) => {
 *   // .. do something
 *  }
 * } * );
 * t.start( );
 * t.stop( );
*/

class Timer {

    /**
     * 
     * @param {object} cfg configration
     * @param {boolean} cfg.autorepeat if true this timer is autorepeat
     * @param {Timer.triggerCB} cfg.onTrigger callback called when the time is over
     * @param {integer} cfg.delay delay between timer events
     */
    constructor( cfg ) {
        Object.assign( this, cfg );
    }

    /**
     * called when the timer is triggered
     * @callback Timer.triggerCB
     */

    /**
     * Start the timer
	 * @returns {void}
     */
    start( ) {
        this.stop( );
        this.timer = ( this.autorepeat ? setInterval : setTimeout )( this.onTrigger, this.delay );
    }

    /**
     * Stop the timer
	 * @returns {void}
     */
    stop( ) {
        ( this.auto_repeat ? clearInterval : clearTimeout )( this.timer );
        this.timer = 0;
    }

}

/**
 *  Loader class
 */

class Loader {

    _get_head( ) {
        let head = document.getElementsByTagName( "head" )[ 0 ];
        return head || document.body;
    }

    /**
     * load a javascript script file
     * @param {String|Array<String>} url 
     * @param {Funciton} handler 
     */

	loadScript( url, handler ) {

        if ( !isArray( url ) ) {
            url = [ url ];
        }

        let n_to_load = url.length;
        let n_loaded = 0;

        for ( let l = 0; l < n_to_load; l++ ) {

            let script = document.createElement( 'script' );
            script.src = url[ l ].toLowerCase( );

            console.log( 'loading script: ' + script.src );

			/*eslint no-loop-func: "off"*/   
            if ( handler ) {
				script.onload = ( ) => {

                    console.log( 'dynamic script loaded: ' + script.src );

                    script.onload = null;
                    n_loaded++;

                    if ( n_loaded == n_to_load ) {
                        handler( );
                    }
                }
            }

            this._get_head( ).appendChild( script );
        }
    }

    /**
     * load a CSS file
     * @param {String|Array<String>} url 
     */

    loadCSS( url ) {

        var style = document.createElement( 'link' );
        style.rel = 'stylesheet';
        style.type = 'text/css';
        style.href = url;

        this.get_head( ).appendChild( style );
    }

    /**
     * Add css rule     
     * @param {String} src full css rule
     */

    addCSS( src ) {

        var style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = src;

        var head = document.getElementsByTagName( "head" )[ 0 ];
        ( head || document.body ).appendChild( style );
    }
}



/**
 * Internationalisation (i18n) class
 */

class I18n {

    /**
     * load a language file     
     * @param {String|Array<String>} locales locales to load ie. "fr"
     * @param {Function} cb callback to call on loading done
	 * @returns {void}
     */
    load_lang( locales, cb ) {

        const base = './i18n/';
        let files = [ ];

        if ( !isArray( locales ) ) {
            locales = [ locales ];
        }

        for ( let i = 0; i < locales.length; i++ ) {
            files.push( base + locales[ i ] + '.js' );
        }

        exact.loader.loadScript( files, cb );
    }

    /**
     * switch to locale
     * @param {String} locale locale to switch to 
     * @description locale must have been loaded before cf. load_lang
     */

    switch_lang( locale ) {

        if( !exact.i18n[ locale ] ) {
            console.warn( 'unknown language : "' + locale + '", switch to "'+I18n.DEF_LOCALE+'"');
            locale = I18n.DEF_LOCALE;
        }

        this.locale = locale;
        window.i18n = Object.assign( {}, exact.i18n[ locale ].tr );
        host.setLocale( locale );
    }

    /**
     * 
     * @param {*} date 
     * @param {*} options 
     */

    formatDate( date, options ) {
        //let intl = new Intl.DateTimeFormat( this.locale, options );
        //return intl.format( date );
        return date.toLocaleDateString( this.locale, options );
	}
	
	format( str, ...args ) {
		
		return str.replace( /(%\d+)/gi, (e) => {
			let idx = parseInt( e.substr(1), 10 );
			return args[idx-1];
		});
	}
}

I18n.DEF_LOCALE = 'fr-FR';

/**
 * Settings handle persistance between sessions.<br/>
 * By default, setting values are serialized and stored to local storage.
 */

class Settings {

    /**
     * 
     * @param {string} prefix - prefix string to add to all setting names <code>x-</code> by default
     */

    constructor( prefix ) {
        this.prefix = prefix || 'x-';
    }

    /**
     * @private
     * @param {string} name name to normalize
	 * @returns {string} name normalized
     */
    _normalize_name( name ) {
        return (this.prefix+name).toLowerCase();
    }

    /**
     * load a setting
     * @param {String} name name of desired setting
     * @param {Any} def_value default value
     * @return {Any} setting
     */

    load( name, def_value ) {
        let settings = null;
        
        try {
            settings = JSON.parse( localStorage.getItem( this._normalize_name(name) ) );
        }
        catch( e ) {
            console.warn( e );
        }

        return settings || def_value;
    }

    /**
     * 
     * @param {String} name setting name
     * @param {Any} value setting value
     */

    save( name, value ) {
        localStorage.setItem( this._normalize_name(name), JSON.stringify( value ) );
    }

    /**
     * remove a setting
     * @param {String} name setting name to remove
     */

    remove( name ) {
        localStorage.removeItem( this._normalize_name(name) );
    }
}


/**
 * exact object
 * @var exact 
 * @property {I18n} i18n - internationalization instance
 * @property {Loader} loader - loader instance
 * @property {Settings} setting - settings instance
 */

window.exact = {
    i18n: new I18n( ),
    loader: new Loader( ),
    settings: new Settings( ),
    ui: {
        main: null,
        dialogs: []
    }
}

window.i18n = {};


// -----------------------------------------------------------------------------------------------------

let style_cache = {};

/**
 * get a rule style value
 * @param {string} style style name
 */

function getStyleRuleValue( style, value ) {

    let styles = style_cache[style];

    if( !styles ) {

        let dom = document.createElement( 'DIV' ),
            cls = style.split(' ');

        dom.classList.add( 'hidden' );
        cls.map( (n) => dom.classList.add( n ) );

        document.body.appendChild( dom );

        let temp = window.getComputedStyle( dom, null );
        styles = style_cache[style] = Object.assign( {}, temp );

        dom.remove( );
	}
	
	if( value!==undefined ) {
        return styles[value];
    }

    return styles;
}

// -------------------------------------------------------------------------------------------------------

var eventsTypes = {};

// this events must be defined on domNode (do not bubble)
const unbubbleEvents = {
    mouseleave: 1,
    mouseenter: 1,
    load: 1,
    unload: 1,
    scroll: 1,
    focus: 1,
    blur: 1,
    rowexit: 1,
    beforeunload: 1,
    stop: 1,
    dragdrop: 1,
    dragenter: 1,
    dragexit: 1,
    draggesture: 1,
    dragover: 1,
    contextmenu: 1
}

const   XMLNS = 'http://www.w3.org/2000/svg';

/**
 * Dom node encapsulation
 * @property {HTMLElement|null} dom - real DOM element 
 */

class DOMNode {

    static createNode( type , ns ) {
        if( type=='svg' || ns==XMLNS) {
            return document.createElementNS( XMLNS, type)
        }
        else {
            return document.createElement( type );
        }
    }

    static createEvents( domNode, events ) {

        //TODO: implements remove events for unbubble events on destroy

        var dom = domNode.dom,
            store = dom.event_store;

        if ( !store ) {
            store = dom.event_store = {};
        }

        for ( let e in events ) {
            if ( events.hasOwnProperty( e ) ) {

                if ( events[ e ] ) {
                    store[ e ] = events[ e ];

                    if( unbubbleEvents[e] === 1 ) {
                        domNode['on'+e] = DOMNode.dispatchUnbubbleEvent;
                    }
                    else if ( !eventsTypes[ e ] ) {
                        eventsTypes[ e ] = true; // todo count it
                        document.addEventListener( e, DOMNode.dispatchEvent, false );
                    }
                }
            }
        }
    }

    static dispatchEvent( ev ) {
        var target = ev.target,
            rc = undefined;

        while ( target ) {
            if ( target.event_store ) {
                var store = target.event_store[ ev.type ];
                if ( store ) {
                    rc = store( ev );
                    break;
                }
            }

            target = target.parentNode;
        }

        return rc;
    }

    static dispatchUnbubbleEvent(event) {
		var target = event.currentTarget || event.target,
            eventType = 'on' + event.type;
		//syntheticEvent = createSyntheticEvent(event);

        //syntheticEvent.currentTarget = target
        var 	eventStore = target.eventStore,
				listener = eventStore && eventStore[eventType];

		if (listener) {
            listener.call(target, event);	//todo: synthetic event ??
        }
	}

    /**
     * object constructor 
     * @param  {object} desc object properties
     */

    constructor( desc ) {
        this.dom = null;
        Object.assign( this, desc );
    }

    /**
     * return the object dom or create it if needed
     */

    getDom( ) {
        if ( !this.dom || !document.contains( this.dom ) ) {
            this.createDom( );
        }

        return this.dom;
    }

    /**
     * traverse the child tree
     * @param {DOMNode.traverseCB} fn function to call on each child
     */

    traverseChilds( fn ) {

        if ( this.dom ) {
            let el = this.dom.firstChild;

            while ( el ) {

                if ( el.el ) {
                    fn( el.el );
                    el.el.traverseChilds( fn )
                }

                el = el.nextSibling;
            }
        }
    }

    /**
     * traverseChilds callback
     * @callback DOMNode.traverseCB
     * @param {DOMNode} el - enumerated element 
     */

    /**
     * return an array of each childs
     */

    flattenChildren( ) {
        
        let all = [ ];
        this.traverseChilds( ( item ) => {
            all.push( item );
        } );

        return all;
    }

    /**
     * create the dom
     * @private
     */

    createDom( ) {

        var desc = Object.assign( {}, this );
		var patch = this.render( );
		
		if ( patch !== null ) {
            Object.assign( desc, patch );
		}
		
		if( desc.__dom_debug ) {
			debugger;
		}

        this.beforeCreation( desc );

        this.dom = desc.node ? desc.node : DOMNode.createNode( desc.tag || 'div', desc.namespace );
        this.dom.el = this;

        if ( desc.id ) {
			this.dom.id = desc.id;
		}

        if ( desc.cls ) {
			this.addClass( desc.cls );
		}

        var style = {};

        if ( desc.left !== undefined ) {
			style.left = desc.left;
		}

        if ( desc.top !== undefined ) {
			style.top = desc.top;
		}

        if ( desc.width !== undefined ) {
			style.width = desc.width;
		}

        if ( desc.height !== undefined ) {
			style.height = desc.height;
		}

        if ( desc.layout ) {

            var layout = desc.layout;
            if ( isString( layout ) ) {
				layout = { type: layout };
			}

            switch ( layout.type ) {
                case 'horizontal':
                    style.display = 'flex';
                    style.flexDirection = 'row';
					break;
				default:
                case 'vertical':
                    style.display = 'flex';
                    style.flexDirection = 'column';
                    break;
            }

            if( layout.reverse && style.flexDirection ) {
                style.flexDirection += '-reverse';
            }

            switch ( layout.align ) {
                case 'end':
                case 'center':
                case 'stretch':
                    style.alignItems = layout.align;
					break;
				default:
					break;
            }
        }

		//todo: see that
        switch ( desc.tag ) {
            case 'img':
                this.dom.src = desc.src;
                break;

            case 'input':
                this.dom.type = desc.type;
                this.dom.value = desc.value;
                break;
        }

        if ( isNumeric(desc.flex) ) {
            style.flexGrow = desc.flex;
            
            if( !style.height ) {
                //style.flexBasis = '10px';
            }
        }

        if ( desc.style ) {
			style = Object.assign( style, desc.style );
		}

        this.setStyle( style );

        if ( desc.attrs ) {
			this.setAttributes( desc.attrs );
		}

        if ( desc.events ) {
			DOMNode.createEvents( this, desc.events );
		}

        var content = desc.content;
        if ( content ) {
            if ( isFunction( content ) ) {
				content = content.call( this );
			}

            this.createChild( this.dom, content );
        }

        if ( desc.xref ) {
            desc.xref( this );
        }
        else if( desc.dref ) {
            asap( desc.dref );
        }

        this.afterCreation( );
    }

    /**
     * render the element,
     * must be implemented in derivations
     */
    render( ) {
        return null;
    }

    /**
     * called before the dom creation
     * @param {object} desc object descriptor
     * the descriptor can be changed here
     */
    beforeCreation( desc ) {

    }

    /**
     * called after the dom creation 
     */
    afterCreation( ) {

    }

    /**
     * create a child
     * @private
     * @param  {HTMLElement} rootDOM   parent element
     * @param  {Object|Array|String|DOMNode} content element's content
     */

    createChild( rootDOM, content, rootNS ) {

        var el;
        if ( isArray( content ) ) {

            el = document.createDocumentFragment( );
            for ( let c = 0; c < content.length; c++ ) {
                this.createChild( el, content[ c ], rootNS );
            }
        } 
        else if ( content instanceof DOMNode ) {
            el = content.getDom( );
        } 
        else if ( isString( content ) ) {
            if ( content[ 0 ] != '<' ) {
                el = document.createTextNode( content );
            } 
            else {
                el = DOMNode.createNode( 'div' );
                el.innerHTML = content;
            }
        }
        else if ( content ) {

            let cls = content.xtype ? content.xtype : DOMNode;
			var sub = new cls( content );
			if( !sub.namespace ) {
				sub.namespace = rootNS;
			}
            el = sub.getDom( );
        }

        if ( el ) {
            rootDOM.appendChild( el );
        }
    }

    /**
     * change the element style
     * @param {Object} styles - new styles to set
     * @example 
     * el.setStyle( {
     *  display: 'block',
     *  backgroundColor: '#ff0000'
     * });
     */
    setStyle( styles ) {
        for ( let s in styles ) {
            if ( styles.hasOwnProperty( s ) ) {
                this.setStyleValue( s, styles[ s ] );
            }
        }
    }

    /**
     * change a single style element
     * @param {string} name style name
     * @param {*} value new style value
     * @example 
     * el.setStyle( 'backgroundColor', '#ff0000' );
     */
    setStyleValue( name, value ) {
        this.dom.style[ name ] = value;
    }

    /**
     * change the element attributes
     * @see {@link DOMNode#getAttribute getAttribute}, {@link DOMNode#setAttribute setAttribute}, {@link DOMNode#removeAttribute removeAttribute}
     * @param {object} attrs - new attributes 
     * @example
     * el.setAttributes( {
     *  value: 9,
     *  'data-xx': 5
     * });
     */
    setAttributes( attrs ) {
        for ( let s in attrs ) {
            if ( attrs.hasOwnProperty( s ) ) {
                if ( attrs[ s ] === undefined ) {
                    this.removeAttribute( );
                }
                else {
                    this.setAttribute( s, attrs[ s ] );
                }
            }
        }
    }

    /**
     * change a single attribute
     * @param {string} name attribute name
     * @param {*} value attribute value
     * @see {@link DOMNode#getAttribute getAttribute}, {@link DOMNode#setAttributes setAttributes}, {@link DOMNode#removeAttribute removeAttribute}
     * @example
     * el.setAttribute( 'checked', true );
     */

    setAttribute( name, value ) {
        this.dom.setAttribute( name, value.toString( ) );
    }

    /**
     * get an attribute value
     * @param {string} name  attribute name
     * @return {string|null} attribute value
     * @see {@link DOMNode#setAttribute setAttribute}, {@link DOMNode#setAttributes setAttributes}, {@link DOMNode#removeAttribute removeAttribute}
     * @example
     * let chk = el.getAttribute( 'checked' );
     */
    getAttribute( name ) {
        return this.dom.getAttribute( name );
    }

    /**
     * remove an attribute
     * @param {string} name  attribute name
     * @see {@link DOMNode#setAttribute setAttribute}, {@link DOMNode#setAttributes setAttributes}, {@link DOMNode#getAttribute getAttribute}
     * @example
     * el.removeAttribute( 'checked' );
     * 
     */

    removeAttribute( name ) {
        this.dom.removeAttribute( name );
    }

    /**
     * check if the element has an attribute
     * @param {string} name attribute name
     * @return {boolean} true is attribute is present
     * @example 
     * if( el.hasAttribute('checked') ) {
     *    
     * }
     */

    hasAttribute( name ) {
        return this.dom.hasAttribute( name );
    }

    /**
     * add a class to the element
     * @param {string|array} cls - classes in string form can be space separated
     *
     * @example
     * el.addClass( 'myclass' );
     * el.addClass( 'myclass1 myclass2' );
     * el.addClass( ['myclass1','myclass2'] );
     */

    addClass( cls ) {
        if ( isString( cls ) ) {
            cls = cls.split( ' ' );
        }

        for ( let c = 0; c < cls.length; c++ ) {
            if ( cls[ c ] !== undefined && cls[ c ] !== null && cls[ c ] !== '' ) {
				this.dom.classList.add( cls[ c ] );
			}
        }
    }

    /**
     * Remove a class from the element
     * @param {string|array} cls - classes in string form can be space separated
     * 
     * @example
     * el.removeClass( 'myclass' );
     * el.removeClass( 'myclass1 myclass2' );
     * el.removeClass( ['myclass1','myclass2']);
     */

    removeClass( cls ) {
        if ( isString( cls ) ) {
            cls = cls.split( ' ' );
        }

        for ( let c = 0; c < cls.length; c++ ) {
			this.dom.classList.remove( cls[ c ] );
		}
    }

    /**
     * Toggle a class from the element (if present remove, if absent add)
     * @param {string|string[]} cls - classes in string form can be space separated
     * @example
     * el.toggleClass( 'myclass' );
     * el.toggleClass( 'myclass1 myclass2');
     * el.toggleClass( ['myclass1','myclass2']);
     */

    toggleClass( cls ) {
        if ( isString( cls ) ) {
            cls = cls.split( ' ' );
        }

        for ( let c = 0; c < cls.length; c++ ) {
			this.dom.classList.toggle( cls[ c ] );
		}
    }

    /**
     * Set or remove a class depending on a parameter<br/>
     * This function is a shortcut for:<br/>
     * ```javascript
     * if( condition ) el.addClass( ... );
     * else            el.removeClass( ... );
     * ```
     * @param {string|array} cls - classes in string form can be space separated
     * @param {boolean} add if set, add the class else remove
     * @example
     * el.setClass( 'myclass', condition );
     * el.setClass( 'myclass1 myclass2', condition );
     * el.setClass( ['myclass1','myclass2'], condition );
     */

    setClass( cls, add ) {
        if ( add ) {
            this.addClass( cls );
		} 
		else {
            this.removeClass( cls );
        }
	}
	
	/**
	 * check if the element has a class defined
	 * @param {string} cls - class name to check 
	 */

	hasClass( cls ) {
		return this.dom.classList.contains(cls);
	}

    /**
     * return an element by it's id
     * do not include the '#'
     * @param {string} id 
     * @return {DOMNode | null}
     * @example 
     * let node = owner.getEl('my_element_id');
     */

    getEl( id ) {
        var elDom = this.getDom( ).querySelector( '#' + id );
        return elDom ? elDom.el : null;
	}
	
	/**
     * remove all childs from an element
     */

    removeChilds( ) {
        if ( !this.dom ) {
            return;
        }

        let all = this.flattenChildren( );

        all.forEach( ( item ) => {
            let dom = item.clearDom( );
            if( dom ) {
                dom.remove( );
            }
        } );

        // remove all remaining elements (not DOMNodes)
        let node = this.dom;
        while ( node.lastChild ) {
            node.removeChild( node.lastChild );
        }
    }

    /**
     * remove the element from the dom
     * The element & it's descendants will no more be visibles & will be removed from the DOM.
     * beforeRemove will be called on each childs.
     * @see {@link DOMNode.beforeRemove beforeRemove}
     * @example
     * el.remove( );    
     */

    remove( ) {
        if ( !this.dom ) {
            return;
        }

        this.removeChilds( );

        let dom = this.clearDom( );
        dom.remove( );
    }

    /**
     * Automatically bind methods to the object<br>
     * When passing methods as a callback, the method is not binded to <code>this</code>, this is a javascript feature.<br/>
     * autobind convert the given methods to new one that are binded and replace it in the object.
     * @param {...function} args - functions to bind comma separated
     * @example
     * this.autoBind( this.myfunc1, this.myfunc2 );
     */

    autoBind( ...args ) {

        for ( let i = 0; i < args.length; i++ ) {

            let f = args[ i ];
            if ( f ) {
                let n = f.name;
                this[ n ] = f.bind( this );
			} 
			else {
                console.warn( 'bad autoBind descriptor.' );
            }
        }
    }

    /**
     * clear the dom element from the object<br/>
     * Always call {@link DOMNode#beforeRemove beforeRemove} before removing the element
     */
    
    clearDom( ) {
        this.beforeRemove( );

        let dom = this.dom;

        if ( dom ) {
            this.dom.el = null;
            this.dom = null;
        }

        return dom;
    }

    /**
     * Called before the destruction of the element<br/>
     * You can implement it in derivations.<br/>
     * This is usefull when you want to release timer for example.
     */

    beforeRemove( ) {
    }

    /**
     * 
     * @param {*} plugin 
     */

    addFeature( feature_class ) {
        this.features = this.features || [];
        this.features.push( new feature_class(this) );
    }
}

/**
 * base class for features
 * features are a way to add methods to a DOMNode (kind of dynamic mixins).
 */


class Feature {
    constructor( owner ) {
        this.owner = owner;
    }

    register( methods ) {
        for ( let name in methods ) {
            let f = methods[ name ];
            this.owner[ name ] = f.bind( this );
        }
    }
}

/**
 * positioning feature
 */

class PositioningFeature extends Feature {
    constructor( owner ) {
        super( owner );

        this.register( {
            getRect: this.getRect
         } );       
    }

    getRect( ) {
        let me = this.owner;
        return me.dom.getBoundingClientRect( );
    }
}



/**
 * Context2D class patch
 */

function strokeRoundRect( stroke, x, y, width, height, radius ) {
    
	if (typeof radius === 'number') {
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		};
	}
	else {
		var defaultRadius = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		};

		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}

	this.beginPath( );
	this.moveTo(x + radius.tl, y);
	this.lineTo(x + width - radius.tr, y);
	this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	this.lineTo(x + width, y + height - radius.br);
	this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	this.lineTo(x + radius.bl, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	this.lineTo(x, y + radius.tl);
	this.quadraticCurveTo(x, y, x + radius.tl, y);
	this.closePath();

	if( stroke ) {
		this.stroke();
	}
	else {
		this.fill( );
	}
}


function drawCircle( stroke, x, y, radius ) {

	this.beginPath( );
	this.arc( x, y, radius, 0, Math.PI*2 );
	if( stroke ) {
		this.stroke();
	}
	else {
		this.fill( );
	}
}

CanvasRenderingContext2D.prototype.strokeRoundRect	= function(...a) { 
	strokeRoundRect.call(this, true, ...a); 
}

CanvasRenderingContext2D.prototype.fillRoundRect	= function(...a) {
	strokeRoundRect.call(this, false, ...a); 
}

CanvasRenderingContext2D.prototype.strokeCircle		= function( ...a ) {
	drawCircle.call(this, true, ...a); 
}

CanvasRenderingContext2D.prototype.fillCircle		= function( ...a ) {
	drawCircle.call(this, false, ...a); 
}