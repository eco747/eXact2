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



var     kb_def = {
    'fr-FR': {
        lines: {
            lower: [
                "1 2 3 4 5 6 7 8 9 0",
                "a z e r t y u i o p {2}",
                "q s d f g h j k l m {3}",
                "{4} w x c v b n , . {4}",
                "{5} {6} ' {7}"
            ],
            upper: [
                "! @ # $ % ^ & * ( ) _ +",
                "A Z E R T Y U I O P {2}",
                "Q S D F G H J K L M {3}",
                "{4} W X C V B N ? : {4}",
                "{5} {6} ' {7}",
            ],
            number: [
				"1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 . {3} {9}"
            ]
        }
    },
    'en-GB': {
        lines: {
            lower: [
                "1 2 3 4 5 6 7 8 9 0",
                "a z e r t y u i o p {2}",
                "q s d f g h j k l m {3}",
                "{4} w x c v b n , . {4}",
                "{5} {6} ' {7}"
            ],
            upper: [
                "! @ # $ % ^ & * ( ) _ +",
                "A Z E R T Y U I O P {2}",
                "Q S D F G H J K L M {3}",
                "{4} W X C V B N ? : {4}",
                "{5} {6} ' {7}",
            ],
            number: [
                "1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 . {3} {9}"
            ]
        }
    },
    'en-US': 'en-GB'
}




class Keyboard extends DOMNode
{
    constructor( desc )  {
        super( desc );

        this.mode   = 'lower';
        this.locale = 'fr-FR';

        this.RE_sel = /text|password|search|tel|url/i;
        this.visTimer = new Timer( {
            onTrigger: ( ) => this._updateVis( ),
            delay: 200
        } );
        
        document.addEventListener( 'focusin', (e) => this.handleFocus(e,true), false );
        document.addEventListener( 'focusout', (e) => this.handleFocus(e,false), false );
    }

    handleKey( e ) {
        
        var target = e.target,
            key;

        while( target!==this.dom ) {
            if( target.hasAttribute('data-key') ) {
                key = parseInt(target.getAttribute('data-key'), 10);
                break;
            }

            target = target.parentNode;
        }

        switch( key ) {
            // bk space
            case 2: {
                this.fireKey( 0, this._backspace );
                break;
            }

            // return
            case 3: {
                this._focusNext( );
                break;
            }

            // shift
            case 4: {
                if( this.mode=='lower' ) {
                    this.mode = 'upper';
                }
                else {
                    this.mode = 'lower';
                }

                this._redraw( );
                break;                
            }

            // num + sym
            case 5: {
                this._switchNum( );
                break;                
            }

            // space
            case 6: {
                this.fireKey( 32, this._insertChar );
                break;
            }

            // hide
            case 7: {
                this.addClass( 'hidden' );
                break;
            }

            case 8: {
                this._switchAlpha( );
                break;
            }

            default: {
                this.fireKey( key, this._insertChar );
                break;
            }
        }
    }

    _focusNext( ) {
        let inputs = Array.prototype.slice.call(document.querySelectorAll( 'input' ));
        let index = (inputs.indexOf(this.input) + 1) % inputs.length;
        const input = inputs[index];
        input.focus();
        //input.select();
    }

    _switchNum( ) {
        this.mode = 'number';
        this._redraw( );
    }

    _switchAlpha( ) {
        this.mode = 'lower';
        this._redraw( );
    }

    _redraw( ) {
        this.keyboard.removeChilds( );
        this.keyboard.removeClass( 'lower upper number' );
        this.keyboard.addClass( this.mode );
		this.createChild( this.keyboard.dom, this._createContent( ) );
    }

    _scrollIntoView( el ) {
        
        var parent = el.parentNode;

        while( parent!=document.body ) {
            
            if( parent.style.overflowY!=='' ) {
                var targ  = el.getBoundingClientRect( );
                var bound = parent.getBoundingClientRect( );

                if( targ.top<bound.top ) {
                    el.scrollIntoView( true );
                }
                else if( targ.bottom>bound.bottom ) {
                    el.scrollIntoView( false );
                }
                break;
            }

            parent = parent.parentNode;
        }
        
        //el.scrollIntoView( false );
    }

    _updateVis( ) {
        
        if( this.visible ) {
            if( this.input ) {
                this.removeClass( 'hidden' );
                this._scrollIntoView( this.input );

                if( this.input.type==='number' || this.input.getAttribute('data-type')==='number' ) {
                    this._switchNum( )
                }
                else {
                    this._switchAlpha( );
                }
            }
        }
        else {
            this.addClass( 'hidden' );
            this.input = null;
        }
	}
	
	showOn( el ) {
		this.handleFocus( {target: el.dom}, true );
	}

    handleFocus( e, enter ) {
        
        if( enter ) {
            if( e.target.tagName=='INPUT' && !e.target.readOnly ) {
                this.input = e.target;
                this.visible = true;
				this.visTimer.start( );
				return;
            }
		}
		
        this.visible = false;
        clearTimeout( this.visTimer );
        this.visTimer.start( );
    }

    _insertChar(caret, text, ch) {
        text = text.substr(0, caret.start) + ch.toString() + text.substr(caret.end);
        caret.start += ch.length;
        caret.end = caret.start;
        return text;
    }

    _backspace(caret, text) {
        text = text.substring(0, caret.start - 1) + text.substring(caret.start);
        caret.start -= 1;
        caret.end = caret.start;
        return text;
    }
    
    _getCaret( ) {
        
        if( this.RE_sel.test(this.input.type) ) { 
            let pos = {
                start: this.input.selectionStart || 0,
                end: this.input.selectionEnd || 0
            };

            if (pos.end < pos.start) {
				pos.end = pos.start;
			}

            return pos;
        }
        else {
            let length = this.input.value.length;
            return  {
                start: length,
                end: length
            };
        }
    }

    _restoreCaretPos( caret ) {
        if( this.RE_sel.test(this.input.type) ) {
            this.input.selectionStart = caret.start;
            this.input.selectionEnd = caret.end;
        }
    }

    fireKey( key, cb ) {
        let caret = this._getCaret( );
        let text  = this.input.value;
        text = cb.call( this, caret, text, String.fromCharCode(key) );
        this.input.value = text;
        this._restoreCaretPos(caret);
    }

    _createContent( ) {
        var     lines = kb_def[this.locale].lines[this.mode];
        var     result = [];
        var     line;
        
        for( var j=0; j<lines.length; j++ ) {
        
            line = lines[j].split(' ');
            
            var tl = [];

            for( var i=0; i<line.length; i++ ) {

                var cls = 'tch c'+i;
                var content = line[i];
                var key;

                if( content.length>2 && content[0]=='{' && content[content.length-1]=='}') {
                    
                    let c = parseInt(content.substring(1, content.length - 1), 10 );
                    switch( c ) {
						default:
						case 0: 
						{
							content = '';       
							cls += ' hidden';
							break;
						}

						case 1: 
						{
							content = '';       
							break;
						}

						case 2:
						{
							content = '';       
							cls += ' cdel'; 
							break;
						}

						case 3:
						{
							content = i18n.keyboard.next;       
							cls += ' cret';
							break;
						}

						case 4:
						{
							content = '';       
							cls += ' cshift';
							break;
						}

						case 5:
						{
							content = i18n.keyboard.numeric;    
							cls += ' cnum';
							break;
						}

						case 6: 
						{
							content = '';       
							cls += ' cspace';
							break;
						}

						case 7:
						{
							content = '';       
							cls += ' chide'; 
							break;
						}

						case 8: 
						{
							content = i18n.keyboard.alpha;    
							cls += ' calpha'; 
							break;
						}

						case 9: 
						{
							content = '';       
							cls += ' cplace'; 
							break;
						}
                    }

                    key = c;
                }
                else {
                    key = line[i].charCodeAt(0);
                }

                var el = {
                    content: {content: content},
                    attrs:   {'data-key': key},
                    cls:     cls,
                };

                tl.push( el );
            }

            result.push( {
                xtype: RowLayout,
                cls: 'line',
                content: tl
            } );
        }

        return result;
    }

    render( ) {

        var content = this._createContent( );

        return {
            id: 'v-keyboard',
            layout: 'horizontal',
            cls: 'hidden',

            events: {
                click: (e) => { 
                    console.log( 'click' );
                    this.handleKey( e ); 

                    e.preventDefault( );
                    e.stopPropagation( );
                },
                
                /*
                contextmenu: (e) => {
                    console.log( 'context menu' );
                    if( this.input ) {
                        this.input.focus( );
                    }
                },

                touchstart: (e) => {
                    console.log( 'touch start' );
                    //e.preventDefault( );
                    e.stopPropagation( );
                    
                    this.last_ev = e;
                    clearInterval( this.autorepeat );
                    this.autorepeat = setInterval( () => {
                        this.handleKey( this.last_ev );
                    }, 250 );
                },
                touchend: ( e ) => {
                    console.log( 'touch end' );
                    clearInterval( this.autorepeat );
                    this.last_ev = null;
                },
                */

                mousedown: (e) => {
                    console.log( 'mouse down' );
                    e.preventDefault( );
                    e.stopPropagation( );
                }
            },

            content: [
                {
                    flex: 1,
                },
                {
                    layout: 'vertical',
                    width: '80%',
                    cls: this.mode,
                    xref: (e) => this.keyboard = e,
                    content: content
                },
                {
                    flex: 1,
                }
            ]
        }


    }
}