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

/**
 * SideBar class
 * 
 */

class SideBar extends DOMNode {

    /**
     * 
     * @param {object} desc configuration
     * @config {string} title bar title
     */
    constructor( desc ) {
        super( desc );
    }

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'sidebar',
            content: [
				this.title ? { xtype: HeaderBar, title: this.title } : null,
				this.items
			]
        };

    }
}

/**
 * SideBarItem class<br/>
 * cf. {@link SideBar}
 * @extends DOMNode
 */

class SideBarItem extends DOMNode {

    /**
     * 
     * @param {object} cfg configuration
     * @config {string} icon icon name
     * @config {string|function} text text to display or function to call to get text
     * @config {function} onClick function to call when clicked
     */
    constructor( cfg ) {
        super( cfg );
    }

    /**
     * @private
     */
    render( ) {

        var cls = [ 'item' ],
            icon = null;

        if ( this.icon ) {
            icon = {
                xtype: Icon,
                icon: this.icon
            };
        }

        let text;
        if ( isFunction( this.text ) ) {
            text = this.text( );
        }
        else {
            text = this.text;
        }

        return {
            tag: 'a',
            cls: cls,
            content: [
				icon,
                {
                    tag: 'p',
                    content: text,
				}
			],
            events: {
                click: this.onClick
            }
        }
    }

    /**
     * called when the item is clicked
     * @callback SideBarItem#onClick
     */

    onClick( ) {

    }
}

/**
 * @private 
 */
const RE_url = /url\(([^)]*)\)/;



/**
 * Icon class
 */

class Icon extends DOMNode {
    constructor( desc ) {
        super( desc );
    }

    /**
     * @private
     */
    render( ) {
        if ( RE_url.test( this.icon ) ) {
            var url = this.icon.match( RE_url ),
                w = this.width || 32;

            return {
                tag: 'img',
                cls: 'icon icon-img',
                src: url[ 1 ],
                width: w,
            }
        }
        else {
            return {
                tag: 'p',
                cls: 'icon icon-text ' + this.icon + ' ' + ( this.cls || '' ),
                style: {
                    fontSize: this.width
                }
            }
        }
    }
}

/**
 * Button class
 * @extends DOMNode
 * 
 * @example
 * let el = new Button( {
 *  title: 'Hello world',
 *  onClick: () => { alert( 'click' ); }
 * });
 */

class Button extends DOMNode {

    /**
     * 
     * @param {object} cfg configuration
     * @param {string} cfg.icon icon to use<br/>
     * if icon is in the form <code>url( ... )</code>, then the image is loaded instead of using named icon<br/>
     * ```
     * icon: "css_icon_name"
     * icon: "url(path/to/image/file.png)"
     * ```
     * @param {string} cfg.title button text
     * @param {Button#onClick} cfg.onClick function to call when clicked
     */
    constructor( cfg ) {
        super( cfg );
    }

    /**
     * @private
     */
    render( ) {

        var cls = 'button ' + (this.cls ? this.cls : '');
        if ( this.disabled ) {
            cls += ' disabled ';
        }

        var events = {
            click: ( ) => {
				if( !this.hasClass('disabled') ) {
					this.onClick( this )
				}
			}
		};
		
		var layout = {
			type: 'horizontal',
			align: 'center',
		};

        if ( this.icon && this.title ) {
            return {
				cls: cls,
				layout: layout,
                content: this.title,
                events: events
            }
        }
        else if ( this.icon ) {
            // todo: find a way to use icon
            if ( RE_url.test( this.icon ) ) {
                var url = this.icon.match( RE_url ),
                    w = this.width || 32;

                return {
                    tag: 'img',
                    cls: 'icon icon-img ' + this.cls,
                    src: url[ 1 ],
                    width: w,
                    events: events
                }
            }
            else {
                return {
					layout: layout,
					tag: 'p',
                    cls: 'icon icon-text ' + this.icon + ' ' + ( this.cls || '' ),
                    style: {
                        fontSize: this.width
                    },
                    events: events
                }
            }
        }
        else if ( this.title ) {
            return {
				layout: layout,
                cls: cls,
                content: {
					tag: 'span',
					content: this.title
				},
                events: events
            }
        }
        else {
            return null;
        }
	}
	
	/**
	 * 
	 * @param {boolean} ena  - enable or disable the button
	 */
	enable( ena ) {
		if( this.disabled!=(!ena) ) {
			this.disabled = !ena;
			this.setClass( "disabled", this.disabled );
		}
	}

    /**
     * Called when the button is clicked
     * @callback Button#onClick
     */

    onClick( ) {

    }
}

/**
 * List class
 * @extends DOMNode
 */

class List extends DOMNode {

    //	onRenderItem: function ( item )
    //	onSelChanged: function ( item, node )
    //	onDblClick:
    //	emptySText: string

    /**
     * @param {object} cfg - configuration
     * @param {object[]} cfg.items - item list
     * @param {any} cfg.selection - default selected item
     * @param {string} cfg.emptyText - default empty text 
     * @param {List.onRenderItem} cfg.onRenderItem - callback to call to render items
     * @param {List.onSelChanged} cfg.onSelChanged - callback to call when selection change
     * @param {List.onDblClk} cfg.onDblClk - callback to call on double click
     */

    constructor( cfg ) {
        super( cfg );

        this.items = cfg.items;
        this.active_node = null;
        this.active_item = null;
    }

    /**
     * called after real DOM creation
     */

    afterCreation( ) {
        if ( this.selection ) {
            this.selectItemById( this.selection );
            this.selection = null;
        }
    }

    /**
     * @private
     */
    render( ) {

        var items = this._fill( this.items || [ ] ),
            empty = null;

        if ( this.emptyText ) {
            empty = {
                id: 'empty-mark',
                content: [
                    {
                        xtype: Icon,
                        icon: 'empty',
                        width: 28
					},
                    {
                        tag: 'p',
                        content: this.emptyText
					}
				]
            }
        }

        return {
            cls: 'list ' + ( items.length == 0 ? 'empty' : '' ) + ' ' + ( this.cls ? this.cls : '' ),
            layout: 'column',
            content: [
                {
                    cls: 'view',
                    xref: ( e ) => this.view = e,
                    content: items
				},
				empty
			]
        }
    }

    /**
     * @private
     * @param {Object[]} els - array of elements
     */
    _fill( els ) {
        var items = [ ],
            odd = true;

        for ( let i = 0; i < els.length; i++ ) {

            let id = els[ i ].id === undefined ? i : els[ i ].id;

            let row = new DOMNode( {
                cls: 'row ' + ( odd ? 'odd' : 'even' ),
                content: this.onRenderItem( els[ i ] ),
                attrs: {
                    tabIndex: 1,
                    'data-id': id
                },
                events: {
                    dblclick: ( ev ) => { this.onDblClick( els[ i ], row ); },
                    click: ( ev ) => { this.onClick( els[ i ], row ); }
                }
            } );

            items.push( row );
            odd = !odd;
        }

        return items;
    }

    /**
     * fill the list with the given items
     * @param {Object[]} items - items definition
     */

    setItems( items ) {
        this.items = items;

        if ( !this.dom ) {
            return;
        }

        var els = this._fill( items );

        this.view.removeChilds( );
        this.createChild( this.view.dom, els );

        this.setClass( 'empty', els.length == 0 );
    }

    /**
     * called when the list needs to render an item
     * @callback List.onRenderItem
     * @param {DOMNode} el - item to render
     */
    onRenderItem( el ) {
        return {
            content: el.text
        }
    }

    /**
     * select an item by it's id
     * @param {String} id - id to select
     * @return true if the items had been found
     */

    selectItemById( id ) {

        let items = this.items,
            citem = -1;

        for ( let i = 0; i < items.length; i++ ) {
            if ( items[ i ].id === id ) {
                citem = i;
                break;
            }
        }

        if ( citem == -1 ) {
            return false;
        }

        let el = this.view.dom.firstChild,
            cdom = null;
        do {
            if ( el.getAttribute( 'data-id' ) == id ) {
                cdom = el;
                break;
            }

        } while ( ( el = el.nextSibling ) !== null );

        if ( !cdom ) {
            return false;
        }

        this.selectItem( items[ citem ], cdom.el );
        return true;
    }

    /**
     * select an item
     * @protected
     * @param {DOMNode} item 
     * @param {DOMElement} domNode 
     */

    selectItem( item, domNode ) {

        let chg = domNode !== this.active_node;

        if ( this.active_node ) {
            this.active_node.removeClass( 'selected' );
        }

        this.active_node = domNode;
        this.active_item = item;

        if ( domNode ) {
            domNode.dom.focus( );
            domNode.addClass( 'selected' );
        }

        if ( chg ) {
            this.onSelChanged( item, domNode );
        }

        if ( hasTouch( ) && domNode ) {
            this.onDblClick( item, domNode );
        }
    }

    /**
     * called when an item is clicked
     * @callback List.onClick
     * @param {object} item - new selected item
     * @param {DOMNode} dom - item dom
     */

    onClick( item, domNode ) {
        this.selectItem( item, domNode );
    }

    /**
     * called when the selection change
     * @callback List.onSelChanged
     * @param {object} item - new selected item
     * @param {DOMNode} dom - item dom
     */

    onSelChanged( item ) {}

    /**
     * called when the user dbl click on an item
     * @callback List.onDblClk
     * @param {object} item - new selected item
     * @param {DOMNode} dom - item dom
     */
    onDblClick( item, domNode ) {}

    /**
     * return the currently selected item (if any)
     * @return {DOMNode|null} 
     */
    getCurItem( ) {
        return this.active_item;
    }
}






/**
 * Panel class
 * @extends DOMNode
 */

class Panel extends DOMNode {

    /**
     * @param {object} cfg - configuration
     */

    constructor( cfg ) {
        super( cfg );
    }

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'panel',
            layout: 'vertical',
            content: [
                {
                    tag: 'p',
                    cls: 'title',
                    content: this.title
				},
                {
                    cls: 'body',
                    flex: 1,
                    layout: 'vertical',
                    content: this.content
				}
			]
        }
    }
}

/**
 * RowLayout class
 * @extends DOMNode
 */

class RowLayout extends DOMNode {
    constructor( d ) {
        super( d );

        if ( !this.hasOwnProperty( 'padding' ) ) {
            this.padding = 4;
        }
    }

    /**
     * @private
     */

    render( ) {

        var style;

        if ( isString( this.padding ) ) {
            style = {
                margin: this.padding,
                minHeight: 'min-content',
            }
        }
        else {
            style = {
                marginTop: this.padding,
                marginBottom: this.padding,
                minHeight: 'min-content',
            }
        }

        return {
            cls: 'row-layout ' + ( this.cls || '' ),
            layout: 'horizontal',
            content: this.content,
            style: style
        }
    }
}

/**
 * ColLayout class
 * @extends DOMNode
 */

class ColLayout extends DOMNode {

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'col-layout',
            layout: 'vertical',
            content: this.content
        }
    }
}

/**
 * PageView class
 * PageView is a stacked page viewer
 * @extends DOMNode
 */

class PageView extends DOMNode {
    constructor( desc ) {
        super( desc );

        this.curView = null;
        this.stack = [ ];
    }

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'page-view',
            content: this.pages || [ ]
        }
    }

    pushPage( page ) {

        if ( this.curView ) {
            this.curView.afterDeactivation( );
            this.curView.addClass( 'hidden' );
        }

        this.curView = page;
        this.stack.push( page );

        if ( this.curView ) {
            if ( !this.curView.dom ) {
                this.curView.getDom( );
            }

            this.dom.appendChild( this.curView.dom );
            this.curView.removeClass( 'hidden' );
            this.curView.afterActivation( );
        }

        if ( this.onPageChange ) {
            this.onPageChange( this.curView );
        }
    }

    popPage( ) {
        if ( this.stack.length ) {
            this.stack.pop( );
            let top = this.stack.pop( );
            this.pushPage( top );
        }
    }
    
    popAll( ) {
        while ( this.stack.length > 1 ) {
            this.popPage( );
        }
    }

    count( ) {
        return this.stack.length;
    }

    topView( ) {
        return this.curView;
    }

    refreshAllPages( ) {

        this.removeChilds( );

        let stk = this.stack;

        this.stack = [ ];
        this.curView = null;

        for ( let p = 0; p < stk.length; p++ ) {
            this.pushPage( stk[ p ] );
        }
    }
}

/**
 * StdView class
 * @extends DOMNode
 */

class StdView extends DOMNode {
    beforeCreation( desc ) {
        desc.cls += ' std-view hidden';
    }

    updateHeader( header ) {
		header.setTitle( this.getTitle( ) );
        header.getEl( 'back' ).setClass( 'hidden', this.no_close );
    }

    afterActivation( ) {}

    afterDeactivation( ) {}

    close( ) {
        exact.ui.pageView.popPage( );
    }
}

/**
 * HeaderBar class
 * @extends DOMNode
 */

class HeaderBar extends DOMNode {

    /**
     * @private
     */

    render( ) {

        var decorators = this.decorators || {};

        var items = [
			decorators.before,
            {
                id: 'title',
                tag: 'p',
                cls: 'text',
                flex: 1,
                content: this.title,
                xref: ( c ) => this.elTitle = c,
                events: {
                    click: ( ) => this.onTitleClick( )
                }
			},
			decorators.after,
		];

        return {
            cls: 'header',
            layout: 'horizontal',
            content: items
        };
    }

    onTitleClick( ) {
    }

    setTitle( title ) {
        this.elTitle.dom.innerText = title;
    }
}

/**
 * Label class
 * @extends DOMNode
 */

class Label extends DOMNode {

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'label ' + ( this.cls || '' ),
            content: this.text
        };
    }

    setText( text ) {
        this.text = text;
        if ( this.dom ) {
			this.dom.innerText = text;
		}
    }
}

/**
 * Switch class
 * @extends DOMNode
 */

class Switch extends DOMNode {

    /**
     * constructor
     * @param {object} desc config object
     * 	@config {boolean} checked default checked value
     * 	@config {function} onChange called when the value change
     */

    constructor( desc ) {
        super( desc );
    }

    afterCreation( ) {
        // force the onChange event
        asap( ( ) => this._changed( ) );
    }

    /**
     * @private
     */

    render( ) {

        let attrs = null;
        if ( this.checked ) {
            attrs = {
                checked: ''
            };
        }

        return {
            cls: 'switch',
            content: [
                {
                    cls: 'toggle' + ( this.checked ? ' checked' : '' ),
                    xref: ( e ) => this.check = e,
                    attrs: { tabIndex: 1 },
                    content: [
                        {
                            tag: 'input',
                            type: 'checkbox',
                            xref: ( e ) => this.input = e,
                            cls: 'check',
                            style: {
                                display: 'none'
                            },
                            events: {
                                change: ( ) => this._changed( )
                            },
                            attrs
						},
                        {
                            tag: 'b',
                            cls: 'b iswitch'
						}
					]
				},
                {
                    xtype: Label,
                    cls: 'toggler',
                    text: this.label,
				}
			],
            events: { click: ( ) => { this._toggle( ); } }
        };
    }

    _toggle( ) {
        this.check.toggleClass( 'checked' );
        this.setCheck( !this.isChecked( ) );
        this._changed( );
    }

    _changed( ) {
        this.onChange( this.isChecked( ) );
    }

    /**
     * value changed
     * @param {boolean} ck new check value
     */
    onChange( ck ) {}

    /**
     * @return the checked value
     */
    isChecked( ) {
        return this.input.hasAttribute( 'checked' );
    }

    /**
     * change the checked value
     * @param {boolean} ck new checked value	
     */
    setCheck( ck ) {
        if ( ck ) {
            this.input.setAttribute( 'checked', '' );
            this.check.addClass( 'checked' );
        }
        else {
            this.input.removeAttribute( 'checked' );
            this.check.removeClass( 'checked' );
        }
    }
}

/**
 * Edit is a single line editor, it can have a label and an error descriptor.
 * @extends DOMNode
 */

class Edit extends DOMNode {

    /**
     * constructor
     * @param {object} cfg configuration
     * @param {string} cfg.text initial value
     * @param {function} cfg.onChange called when the value change
     * @param {function} cfg.onBlur called when the edit loose focus
     * @param {string} cfg.label label text to prepend before the edit
     * @param {integer} cfg.labelWidth the fixed label width in pixels
     * @param {integer} cfg.editWidth the fixed edit width in pixels
     * @param {string} cfg.placeHolder place holder text (text displayed when the edit is empty)
     * @param {boolean} cfg.errorTip if true add a space for error tip
     * @param {boolean} cfg.autofocus if true set the focus on the element at start
	 * @param {boolean} cfg.readOnly if true set the editor as readonly
     */

    constructor( cfg ) {
        super( cfg );

        this.onError = false;
    }

    /**
     * @private
     */

    render( ) {

		// predefined events
		var events = {
			change: ( e ) => this.onChange( this.getValue( ), this ),
			focusout: ( e ) => this.onBlur( this.getValue( ), this ),
		};

		//	patched by soft
		if( this.events ) {
			Object.assign( events, this.events );
		}

        if ( !this.label ) {
            this.input = this;
            return {
                cls: 'edit',
                tag: 'input',
                value: this.text || '',
                attrs: {
                    'data-type': this.type || 'text',
                    type: 'text',
                    placeHolder: this.placeHolder || undefined,
					autofocus: this.autofocus,
					readonly: this.readOnly,
                },
                events: events
            };
        }
        else {
            return {
                layout: 'vertical',
                content: [
                    {
                        xtype: RowLayout,
                        content: [
                            {
                                xtype: Label,
                                text: this.label,
                                width: this.labelWidth,
							},
                            {
                                cls: 'edit',
                                tag: 'input',
                                value: this.text || '',
                                width: this.editWidth,
                                xref: ( e ) => this.input = e,
                                attrs: {
                                    'data-type': this.type || 'text',
                                    type: 'text',
                                    placeHolder: this.placeHolder || undefined,
									autofocus: this.autofocus,
									readonly: this.readOnly,
                                },
                                events: events
							}
						]
					},
					nc( this.errorTip, {
                        xtype: Label,
                        cls: 'error-tip hidden',
                        xref: ( e ) => this.labelError = e
                    } )
				]
            };
        }
    }

    /**
     * 
     * @param {*} newValue 
     * @param {*} edit 
     */

    onChange( newValue, edit ) {}

    /**
     * 
     * @param {*} value 
     * @param {*} edit 
     */
    onBlur( value, edit ) {
        this.onValidate( value, edit );
    }

    /**
     * Validate the editor content
     * @callback Edit.onValidate
     * @param {String} value - current value to check
     * @param {DOMNode} edit - editor 
     * @return {Boolean} true to validate the entry
     */

    onValidate( value, edit ) {
        return true;
    }

    /**
     * @private
     */
    validate( ) {
        return this.onValidate( this.getValue( ), this );
    }

    /**
     * 
     * @param {String} text - error text to show<br/>
     *                          cfg.errorTip must have been set to true.
     */
    showError( text ) {
        if ( this.labelError ) {
            this.labelError.setText( text );
            this.labelError.removeClass( 'hidden' );
        }

        this.onError = true;
    }

    /**
     * Clear the last shown error
     */

    clearError( ) {
        this.labelError.addClass( 'hidden' );
        this.onError = false;
    }

    /**
     * return the current editor value
     * @return {String} 
     */

    getValue( ) {
        return this.input.dom.value;
    }

    /**
     * Change the editor value
     * @param {String} value - new value to set
     */
    setValue( value ) {
        this.input.dom.value = value;
    }
}

/**
 * 
 */

class Canvas extends DOMNode {

    /**
     * 
     * @param {object} cfg - configuration
     * @param {Canvas.onPaint} onPaint - callback to call to render on the context
     * @param {boolean} cfg.autoClear - if true, the context is clread before calling onPaint
     * @param {boolean} cfg.directDraw - if true, the element is painted without delay
     * @param {boolean} cfg.noHDPIAddjust - if false, the element will not be ok for high dpi screens (printer)
     */

    constructor( desc ) {
        super( desc );

        this.iw = 0;
        this.ih = 0;
        this.bRefresh = true;

        if( !this.directDraw ) {
            this.timer = new Timer( {
                autorepeat:true,
                delay:100,
                onTrigger:() => this._update() 
            });
        }
    }

    /**
     * @callback Canvas.onPaint
     * @param {Context} ctx - drawing context
     */

    afterCreation( ) {
        if( this.directDraw ) {
            asap( () => this._update( ) );
        }
    }

    /**
     * @private
     */
    beforeRemove( ) {
        if( this.timer ) {
            this.timer.stop( );
        }
    }

    /**
     * @private
     */

    render( ) {
        return {
            content: {
                tag: 'canvas',
                style: {
                    width: 0,
                    height: 0,
                    position: 'absolute'
                },
                xref: ( c ) => {
                    this.canvas = c;
                    if( this.timer ) {
                        this.timer.start( );
                    }
                }
            }
        };
    }

    /**
     * repaint the element 
     */

    refresh( ) {
        this.bRefresh = true;
        if( this.directDraw ) {
            this._update( );
        }
    }

    /**
     * @private
     */
    _update( ) {

        var dom = this.getDom( ),
            w = dom.clientWidth,
            h = dom.clientHeight;

        if ( w != this.iw || h != this.ih /*|| this.bRefresh*/ ) {
            this.ctx = this.canvas.dom.getContext( '2d' );

            // adjustment for HDPI
            let devicePixelRatio = window.devicePixelRatio || 1;
            let backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                                    this.ctx.mozBackingStorePixelRatio ||
                                    this.ctx.msBackingStorePixelRatio ||
                                    this.ctx.oBackingStorePixelRatio ||
                                    this.ctx.backingStorePixelRatio || 1;
        
            let ratio = devicePixelRatio / backingStoreRatio;
            if (devicePixelRatio !== backingStoreRatio )
            {
                this.canvas.setAttributes( {width:w*ratio, height: h*ratio} );
                this.canvas.setStyle( { width: w, height: h } );
                this.ctx.scale(ratio,ratio);
            }    
            else {
                this.canvas.setAttributes( {width:w, height: h} );
                this.canvas.setStyle( { width: w, height: h } );
            }

            // bug QT 5.7.0 , no antialias without these 3 lines
            this.ctx.save( );
            this.ctx.clearRect( 0, 0, w, h );
            this.ctx.restore( );

            this.iw = w;
            this.ih = h;
            this.bRefresh = true;
        }
 
        if ( w && h && this.bRefresh && this.onPaint ) {

            if( this.autoClear ) {
                this.ctx.clearRect( 0, 0, w, h );
            }

            this.ctx.width = w;
            this.ctx.height = h;

            this.ctx.save( );
            //this.ctx.translate( 0.5, 0.5 );
            this.bRefresh = this.onPaint( this.ctx );
            this.ctx.restore( );
        }
        else {
            this.bRefresh = false;
        }
    }

    clear( ) {
        if( this.ctx ) {
            let dom = this.dom,
                w = dom.clientWidth,
                h = dom.clientHeight;
            this.ctx.clearRect( 0, 0, w, h );
        }
    }
}

/**
 * 
 */

class InfoBar extends DOMNode {

    /**
     * @private
     */

    render( ) {
        return {
            cls: 'info-bar',
            layout: {
                type: 'horizontal',
                align: 'center',
                reverse: true,
            },
            content: [
				//{ 
				//	xtype: Icon,
				//	icon: 'bat-full',
				//	width: 16,
				//},
                {
                    xtype: Icon,
                    icon: 'wifi-off',
                    width: 16,
				}
			]
        }
    }
}

/**
 * 
 */

class Console extends DOMNode {
    constructor( cfg ) {
        super( cfg );
    }

    append( tag, text, cls ) {
        this.dom.innerHTML += `<${tag} ${cls ? 'class='+cls : ''}>${text}</${tag}>`;
    }

    clear( ) {
        this.removeChilds( );
    }

    set( html ) {
        this.removeChilds( );
        this.dom.innerHTML += html;
    }
}

/**
 * 
 */

class Slider extends DOMNode {
    constructor( cfg ) {
        super( cfg );

        if( !this.min ) {
            this.min = 0;
        }

        if( !this.max ) {
            this.max = 100;
        }
    }

    afterCreation( ) {
        // force the onChange event
        asap( ( ) => this._update( ) );
    }

    /**
     * @private
     */
    
    render( ) {

        return {
            cls: 'slider',
            layout: 'horizontal',
            content: [
                {
                    xtype: Label,
                    text: this.label
                },
                {
                    cls: 'slide',
                    flex: 1,
                    xref: (e) => this.slide = e,
                    events: {
                        mousedown: (e) => this.mouseDown( e ),
                        touchmove: (e) => this.touchMove( e ),
                    },
                    content: [
                        {
                            cls: 'line',
                            content: [
                                {
                                    cls: 'filled',
                                    xref: (e) => this.filled = e
                                },
                                {
                                    cls: 'dot',
                                    xref: (e) => this.dot = e
                                },
                            ]        
                        },
                        {
                            tag: 'input',
                            type: 'range',
                            cls: 'hidden',
                            value: this.value,
                            attrs: {
                                min: this.min,
                                max: this.max,
                            },
                            xref: (e) => this.input = e
                        }
                    ]
                }
            ]
        }
    }

    touchMove( e ) {
        if( e.target==this.dot.dom ) {
            this.delta_mouse = 0; 
            let ev = e.changedTouches[0];
            this.updatePos( ev.clientX );
        }

        e.stopPropagation( );
        e.preventDefault( );
    }
    
    mouseDown( e ) {
        if( e.target==this.dot.dom ) {
            document.onmousemove = (ev) => this.mouseMove( ev );
            document.onmouseup = (ev) => this.mouseUp( ev );
            let rc = this.dot.dom.getBoundingClientRect( );
            this.delta_mouse = e.clientX - rc.left; 
        }
    }

    mouseMove( e ) {
        this.updatePos( e.clientX );
        e.stopPropagation( );
    }

    mouseUp( e ) {
        document.onmousemove = null;
        document.onmouseup = null;
        console.log( 'up' );
    }

    updatePos( x ) {

        let     rc = this.slide.dom.getBoundingClientRect( ),
                w = rc.width,
                p = x - rc.left - this.dot.dom.clientWidth/2 + 12 - this.delta_mouse,
                r = this.max - this.min,
                v = ( p * r) / w + this.min;

        if( v>this.max ) {
            v = this.max;
        }
        else if( v<this.min ) {
            v = this.min;
        }

        this.setValue( v );
    }

    getValue( ) {
        return parseInt(this.input.dom.value,10);
    }

    setValue( v ) {
        v = Math.floor( v );
        if( this.input.dom.value != v ) {
            this.input.dom.value = v;
            this._update( );        
            this.onChange( v );
        }
    }
    
    onChange( value ) {
    }
    
    _update( ) {
        let     p = this.getValue( ) - this.min,
                r = this.max - this.min;

        this.dot.setStyleValue( 'left', ((p * 100) / r) + '%' );
        this.filled.setStyleValue( 'width', ((p * 100) / r) + '%' );
    }
}


/**
 * 
 */

class  CircularSlider extends Canvas {

    constructor( d ) {
        super( d );

        this.on = false;
        this.min = 0;
        this.max = 100;
        this.pos = 50;
        this.step = 5;

        this.watchMove = false;

        this.backColor = Color.fromStyle( 'circular-back' );
        this.borderColor = Color.fromStyle( 'circular-border' );
        this.lineColor = Color.fromStyle( 'circular-line' );
        this.percColor = Color.fromStyle( 'circular-perc' );

        this.curPos = {
            x: 0,
            y: 0
        };

        this.events = {
            touchstart: (e) => this.onTouchStart( e ),
            touchmove: (e) => this.onTouchMove( e ),
            touchend: (e) => this.onTouchEnd( e ),
            mousedown: (e) => this.onMouseDown( e ),
            mousemove: (e) => this.onMouseMove( e ),
            mouseup: (e) => this.onMouseUp( e ),
        }
    }


    onTouchStart( e ) {
        let p = e.touches[0];

        switch( this.checkTouchPoint(p) ) {
            case -1:
            case 1:
                break;

            case 2:
                this.watchMove = true;
                break;
        }
    }

    onMouseDown( e ) {
        switch( this.checkTouchPoint(e) ) {
            case -1:
            case 1:
                break;

            case 2:
                this.watchMove = true;
                break;
        }
    }

    onTouchEnd( e ) {
        this.watchMove = false;
    }

    onMouseUp( e ) {
        this.watchMove = false;
    }

    checkTouchPoint( p ) {
        
        let rc = this.dom.getBoundingClientRect( ),
            dx = (p.clientX-rc.left) - this.curPos.x,
            dy = (p.clientY-rc.top) - this.curPos.y,
            d = Math.sqrt( (dx*dx)+(dy*dy) );

        if( d<10 ) {
            return  2;
        }
        else if( (p.clientX-rc.left) < rc.width / 2 ) {
            return  -1;
        }
        else {
            return  1;
        }

    }

    onTouchMove( e ) {
                
        if( this.watchMove ) {
            let p = e.touches[0];
            this.handleCircularMove( p );
        }
    }

    onMouseMove( e ) {
        if( this.watchMove ) {
            this.handleCircularMove( e );
        }
    }

    handleCircularMove( p ) {
        let rc = this.dom.getBoundingClientRect( ),
            p0 = {x:p.clientX-rc.left,y:p.clientY-rc.top},
            c  = {x:rc.width/2,y:rc.height/2},
            dx = p0.x-c.x,
            dy = p0.y-c.y;

        let d = Math.sqrt( dx*dx + dy*dy );
        
        let a1 = Math.acos( dy / d );
        let a2 = Math.asin( dx / d );
        let angle = (a2>0 ? 2*Math.PI-a1 : a1);

        let start = Math.PI/8,
            end = Math.PI*2 - Math.PI/8;

        if( angle<start ) {
            angle = start;
        }
        else if( angle > end ) {
            angle = end;
        }
            
        this.pos = this.min + ( (angle-start) / (Math.PI*2-Math.PI/8-Math.PI/8) ) * (this.max-this.min);

        if( this.step ) {
            this.pos = Math.round( this.pos / this.step ) * this.step;
        }

        this.refresh( );
    }

    onPaint( ctx ) {

        let     rc = {
            left: 10,
            top: 10,
            width: ctx.width-20,
            height: ctx.height-20
        };

        let     r  = Math.min(rc.width,rc.height) / 2,
                mx = rc.left + rc.width / 2,
                my = rc.top + rc.height / 2;

        // circle
        ctx.beginPath( );
        ctx.arc( mx, my, r, 2*Math.PI, 0 );
        
        ctx.fillStyle = this.backColor;
        ctx.fill( );

        ctx.strokeStyle = this.borderColor;
        ctx.stroke( );
        
        // background line

        r -= 14;

        let start = Math.PI/2+Math.PI/8,
            end = Math.PI/2-Math.PI/8;
                
        ctx.beginPath( );
        ctx.arc( mx, my, r, start, end );
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.stroke( );

        // percent line
        let angle = start+((this.pos-this.min) / (this.max-this.min)) * (2*Math.PI-Math.PI/8-Math.PI/8);

        ctx.beginPath( );
        ctx.arc( mx, my, r, start, angle );
        ctx.strokeStyle = this.percColor;
        ctx.stroke( );

        //  circle
        ctx.beginPath( );


        this.startPos = {
            x: mx + (r) * Math.cos(start),
            y: my + (r) * Math.sin(start)
        };
        
        this.curPos = {
            x: mx + (r) * Math.cos(angle),
            y: my + (r) * Math.sin(angle)
        };

        ctx.arc(  this.curPos.x, this.curPos.y, 8, 2*Math.PI, 0 );

        ctx.fillStyle = this.percColor;
        ctx.fill( );

        //  text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = Math.round(rc.height/3)+'px Roboto';
        ctx.fillText( roundTo(this.pos,0), mx, my );
    }
}

class   SVGCanvas extends DOMNode
{
    constructor( cfg ) {
        super( cfg );
    }

    update( ) {
        if( !this.dom ) {
            return;
        }

        this.removeChilds( );
        
        this.els = [];
        this.state = 0;
        this.cpath = '';

        let rc = this.dom.getBoundingClientRect( );
        this.onPaint( this, rc );
        this.endPath( );
                
        this.createChild( this.dom, this.els, this.dom.namespaceURI );
    }

    render( ) {

        return {
            tag: 'svg',
            attrs: iif( this.viewBox, {
                viewBox: this.viewBox,
            })
        }
    }

    afterCreation( ) {
        this.update( );
    }

    onPaint( ) {
    }

    moveTo( x, y ) {
        this.beginPath( );
        this.cpath += 'M'+roundTo(x,4)+' '+roundTo(y,4);
    }

    lineTo( x, y ) {
        this.beginPath( );
        this.cpath += 'L'+roundTo(x,4)+' '+roundTo(y,4);
    }

    line( x1, y1, x2, y2 ) {
        this.endPath( );
        this.addEl( 'line', {
            x1: roundTo(x1,4),
            y1: roundTo(y1,4),
            x2: roundTo(x2,4),
            y2: roundTo(y2,4)
        });
    }

    rect( x, y, w, h, extra ) {
        this.endPath( );
        this.addEl( 'rect', {
            x: roundTo(x,4),
            y: roundTo(y,4),
            width: roundTo(w,4),
            height: roundTo(h,4),
        }, undefined, extra );
    }

    roundRect( x, y, w, h, borderRadius, extra ) {
        this.endPath( );
        this.addEl( 'rect', {
            x: roundTo(x,4),
            y: roundTo(y,4),
            width: roundTo(w,4),
            height: roundTo(h,4),
            rx: borderRadius,
            ry: borderRadius
        }, undefined, extra );
    }

    circle( x, y, r ) {
        this.endPath( );
        this.addEl( 'circle', {
            cx: roundTo(x,4),
            cy: roundTo(y,4),
            r: r
        });
    }

    drawText( x, y, text, extra ) {
        this.endPath( );
        this.addEl( 'text', {
            x: roundTo(x,4),
            y: roundTo(y,4),
            'font-family': this.cfont.family,
            'font-size': this.cfont.size,
            stroke: ''
        }, text, extra );
    }

    fontStyle( family, size ) {
        this.cfont = {
            family: family,
            size: size
        }
    }

    strokeStyle( width, color ) {
        this.cstroke = {
            'stroke-width': width,
            stroke: color
        }
    }

    clearStroke( ) {
        this.cstroke = {
            'stroke-width': 0,
            stroke: 'transparent'
        }
    }

    fillStyle( color ) {
        this.cfill = {
            fill: color,
        };
    }

    clearFill( ) {
        this.cfill = {
            fill: 'transparent'
        };
    }

    beginPath( ) {
        if( this.state==0 ) {
            this.state = 1;
            this.cpath = '';
        }
    }

    endPath( ) {
        if( this.state ) {

            if( this.cpath.length>0 ) {
                this.addEl( 'path', {
                    d: this.cpath,
                });
            }

            this.state = 0;
        }
    }

    addEl( type, attrs, content, extra_attrs ) {

        let el = {
            tag: type,
            attrs: {},
            content: content===undefined ? undefined : content+''
        };

        Object.assign( el.attrs, extra_attrs );
        if( this.cstroke ) {
			Object.assign( el.attrs, this.cstroke );
		}

        if( this.cfill ) {
			Object.assign( el.attrs, this.cfill ); 
		}

        Object.assign( el.attrs, attrs );

        this.els.push( el );
    }
}

class Checkbox extends DOMNode {

    constructor( cfg ) {
        super( cfg );
    }

    render( ) {

		var cls = 'checkbox ' + (this.cls ? this.cls : '');
		if( this.disabled ) {
			cls += 'disabled';
		}

        return {
			cls: cls,
            layout: {
                type: 'horizontal',
                align: 'center',
            },
            attrs: iif( !this.disabled, {
				tabindex: 0
			}),
			content: [
                {
                    tag: 'input',
                    xref: ( e ) => this.input = e,
                    style: {
                        visibility: 'hidden',
                    },
                    attrs: {
                        type: 'checkbox',
                        name: this.name,
                        checked: this.checked ? '' : undefined,
                    },
                    events: {
                        change: ( e ) => this.onChange( this.getValue( ), this ),
                        focusout: ( e ) => this.onBlur( this.getValue( ), this ),
                    }
                },
                {
                    tag: 'label',
                    content: this.label,
                    width: this.labelWidth==='flex' ? undefined : this.labelWidth,
                    flex: this.labelWidth==='flex' ? 1 : undefined
                },
                {
                    xtype: SVGCanvas,
                    cls: 'mark',
                    viewBox: '0 0 24 24',
                    xref: (e) => this.check = e,
                    onPaint: (e,rc) => this.onPaint(e,rc)
                },
                
                
            ],
            events: { 
                click: ( ) => this._onclick(),
                keypress: ( e ) => { this.onKeyPress(e); }
            }
        };
	}
	
	_onclick( ) {
		if( !this.hasClass('disabled') ) {
			if( this.onClick(this) ) {
				this._toggle( );
			}
		}
	}

	onClick( e ) {
		return true;
	}
    
    _toggle( ) {
		if( !this.hasClass('disabled') ) {
			this.setCheck( !this.isChecked( ) );
			this._changed( );
		}
    }

    _changed( ) {
        this.onChange( this.isChecked( ) );
    }

    onPaint( e, rc ) {
        if( this.isChecked() ) {
            let color = getStyleRuleValue( 'x-checkbox color checked', 'color' );

            e.strokeStyle( 1.5, color );
            e.fillStyle(color);
            e.rect( 3, 3, 18, 18, 1 );

            e.strokeStyle( 3, 'white' );
            const off = 7;
            e.moveTo( off, off );
            e.lineTo( 24-off, 24-off );
            e.moveTo( off, 24-off );
            e.lineTo( 24-off, off );
        }
        else {
            e.strokeStyle( 1.5, getStyleRuleValue( 'x-checkbox color', 'color' ) );
            e.fillStyle('transparent');
            e.rect( 3, 3, 17, 17, 1 );
        }
    }

    onKeyPress( e ) {
        if( e.key=='Enter' || e.key==' ' ) {
            this._toggle( );
        }
    }

    /**
     * value changed
     * @param {boolean} ck new check value
     */
    onChange( ck ) {}

    /**
     * @return the checked value
     */
    isChecked( ) {
        return this.input.hasAttribute( 'checked' );
    }

    /**
     * change the checked value
     * @param {boolean} ck new checked value	
     */
    setCheck( ck ) {
        if ( ck ) {
            //this.addClass( 'checked' );
            this.input.setAttribute( 'checked', '' );
            this.check.update( );
        }
        else {
            //this.removeClass( 'checked' );
            this.input.removeAttribute( 'checked' );
            this.check.update( );
        }
	}
	
	/**
	 * 
	 * @param {boolean} ena  - enable or disable the button
	 */
	enable( ena ) {
		if( this.disabled!=(!ena) ) {
			this.disabled = !ena;
			this.setClass( "disabled", this.disabled );
			if( this.disabled ) {
				this.removeAttribute( "tabindex" );
			}
			else {
				this.setAttribute( 'tabindex', 0 ); 
			}
		}
	}    
}

class Radio extends DOMNode {
    constructor( cfg ) {
        super( cfg );
    }

    render( ) {

		var cls = 'radio ' + (this.cls ? this.cls : '');
		if( this.disabled ) {
			cls += 'disabled';
		}

        return {
			cls: cls,
            layout: {
                type: 'horizontal',
                align: 'center',
            },
            attrs: iif( !this.disabled, {tabindex:0} ),
            content: [
                {
                    tag: 'input',
                    xref: ( e ) => this.input = e,
                    style: {
                        visibility: 'hidden',
                    },
                    attrs: {
                        type: 'radio',
                        name: this.group,
                        value: this.value,
                    },
                    events: {
                        change: ( e ) => this.onChange( this.getValue( ), this ),
                        focusout: ( e ) => this.onBlur( this.getValue( ), this ),
                    }
                },
                {
                    tag: 'label',
                    content: this.label,
                    width: this.labelWidth==='flex' ? undefined : this.labelWidth,
                    flex: this.labelWidth==='flex' ? 1 : undefined
                },
                {
                    xtype: SVGCanvas,
                    cls: 'mark',
                    viewBox: '0 0 24 24',
                    xref: (e) => this.check = e,
                    onPaint: (e,rc) => this.onPaint(e,rc)
                },
            ],
            events: {
                click: ( ) => { this._onclick(this); } ,
                keypress: ( e ) => { this.onKeyPress(e); }
            }
        };
    }

    _changed( ) {
        this.onChange( this, this.isChecked( ) );
	}
	
	_onclick( ) {
		if( this.onClick(this) ) {
			if( this.hasClass('disabled') ) {
				return;
			}
	
			this.setCheck( );
		}
	}

	onClick( e ) {
		return true;
	}

    onKeyPress( e ) {
        if( e.key=='Enter' || e.key==' ' ) {
            this._onclick( );
        }
    }

    /**
     * value changed
     * @param {boolean} ck new check value
     */
    onChange( ck ) {}

    onPaint( e, rc ) {
        if( this.isChecked() ) {
            let color = getStyleRuleValue( 'x-radio color checked', 'color' );

            e.strokeStyle( 2, color );
            e.fillStyle('transparent');
            e.circle( 12, 12, 9 );
            e.fillStyle(color);
            e.circle( 12, 12, 4 );
        }
        else {
            e.strokeStyle( 2, getStyleRuleValue( 'x-radio color', 'color' ) );
            e.fillStyle('transparent');
            e.circle( 12, 12, 9 );
        }
    }

    /**
     * @return the checked value
     */
    isChecked( ) {
        return this.input.dom.checked;
    }

    /**
     * change the checked value
     * @param {boolean} ck new checked value	
     */
    setCheck(  ) {
        let update = [ this ];        
        
        // get list of other checked radios (before me)
        let els = document.querySelectorAll( '[name="'+this.group+'"]:checked' );

        for( let e=0; e<els.length; e++ ) {
            let el = els[e];
            if( el.parentNode && el.parentNode.el instanceof Radio ) {
				el.parentNode.el.removeClass('checked');
                update.push( el.parentNode.el);
            }
        }

		this.addClass('checked');
		this.input.dom.checked = true;
		this._changed( );

        update.map( (el) => el.check.update( ) );
	}

	clearCheck( ) {
		let update = [ this ];        
        
        // get list of other checked radios (before me)
        let els = document.querySelectorAll( '[name="'+this.group+'"]:checked' );

        for( let e=0; e<els.length; e++ ) {
            let el = els[e];
            if( el.parentNode && el.parentNode.el instanceof Radio ) {
                update.push( el.parentNode.el);
            }
        }

        update.map( (el) => {
			el.input.dom.checked = false;
			el.check.update( );
		} );
	}
	
	/**
	 * 
	 * @param {boolean} ena  - enable or disable the button
	 */
	enable( ena ) {
		if( this.disabled!=(!ena) ) {
			this.disabled = !ena;
			this.setClass( "disabled", this.disabled );
			if( this.disabled ) {
				this.removeAttribute( "tabindex" );
			}
			else {
				this.setAttribute( 'tabindex', 0 ); 
			}
		}
	}    
}