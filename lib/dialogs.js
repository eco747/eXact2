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

 
function nc( test, desc ) {
    return test !== undefined ? desc : null;
}

/**
 * base Dialog box 
 */

class Dialog extends DOMNode {

    constructor( d ) {
        super( d );

        if ( !this.cls ) {
            this.cls = '';
        }
    }

    render( ) {

        let title = this.getTitle( );

        return {
            cls: 'dialog ' + this.cls,
            layout: 'vertical',
            style: {
                position: 'absolute',
                left: -5000,
                top: -5000,
            },

            content: [
                {
                    cls: 'dlg-title',
                    layout: 'horizontal',

                    content: [
						nc( this.icon, {
                            xtype: Icon,
                            icon: this.icon
                        } ),
						nc( this.title, {
                            tag: 'p',
                            flex: 1,
                            content: this.title
                        } )
					]
				},
                {
                    cls: 'dlg-body',
                    flex: 1,
                    layout: 'vertical',
                    content: this.content || this.renderContent( ),
				}
			]

        };
    }

    getTitle( ) {
        return this.title;
    }

    renderContent( ) {
        return null;
    }

    _center( ) {

        let w = this.dom.clientWidth,
            h = this.dom.clientHeight,
            ww = document.body.clientWidth,
            wh = document.body.clientHeight,
            rb = document.body.getBoundingClientRect( );

        this.dom.style.left = ( ww - w ) / 2 - rb.left;
        this.dom.style.top = ( wh - h ) / 2  - rb.top;
    }

    show( ) {

        // if we already get some dialogs shown, we mask them else main
        let top = exact.ui.dialogs.length ? exact.ui.dialogs[0] : exact.ui.main;
        top.addClass( 'masked' );

        let dom = this.getDom( );
        if ( !this.dom.parentNode ) {
            document.body.appendChild( dom );
        }

        this._center( );

        exact.ui.dialogs.unshift( this );
    }

    close( ) {
        exact.ui.dialogs.shift( );

        // if we already get some dialogs shown, we mask them else main
        let top = exact.ui.dialogs.length ? exact.ui.dialogs[0] : exact.ui.main;
        top.removeClass( 'masked' );

        this.remove( );
    }
}

/**
 * Standard Error message dialog box
 * @see {@link errorMsg}
 */

class ErrorMsg extends Dialog {

    constructor( cfg ) {
        super( cfg );

        this.cls = 'error';
    }

    renderContent( ) {

        let buttons;

        if( this.btnType==ErrorMsg.YES_NO ) {
            buttons = [
                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.yes, onClick: ( ) => this._click( 'yes' ) },
                { width: 10 },
                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.no, onClick: ( ) => this._click( 'no' ) },
            ];
        } 
        else if( this.btnType==ErrorMsg.OK ) {
            buttons = { xtype: Button, cls: 'flat', width: 100, title: i18n.global.ok, onClick: ( ) => this._click( 'ok' ) };
        } 
        else if( this.btnType!=ErrorMsg.NONE ) {
            buttons = [
                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.ok, onClick: ( ) => this._click( 'ok' ) },
                { width: 10 },
                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.cancel, onClick: ( ) => this._click( 'cancel' ) },
            ];
        }
        
        return {
            layout: 'vertical',
            content: [
                {
                    layout: 'horizontal',
                    style: {
                        alignItems: 'center',
                    },
                    content: [
                        {
                            xtype: Icon,
                            icon: this.icon || 'error',
						},
                        {
                            tag: 'p',
                            cls: 'text',
                            content: this.message
						}
					]
				},
                { height: 16 },
                {
                    xtype: RowLayout,
                    content: [
                        { flex: 1 },
                        buttons,
					]
				}
			]
        }
    }

    _click( bt ) {
        this.close( );
        this.onClick( bt );
    }

    onClick( btId ) {}
}

ErrorMsg.NONE = 0;
ErrorMsg.OK_CANCEL = 1;
ErrorMsg.YES_NO = 2;
ErrorMsg.OK = 3;

    

/**
 * standard input dialog box
 * cf. inputDialog( )
 */

class InputDialog extends Dialog {
    constructor( d ) {
        super( d );
    }

    renderContent( ) {

        return {
            layout: 'vertical',
            events: {
                keydown: (e) => this.onKeyDown( e )
            },
            content: [
                {
                    layout: 'horizontal',
                    style: {
                        alignItems: 'center',
                    },
                    content: {
                        xtype: Edit,
                        label: this.label,
                        text: this.value,
                        xref: ( e ) => this.input = e,
                        autofocus: true,
                    }
				},
                { height: 16 },
                {
                    xtype: RowLayout,
                    content: [
                        { flex: 1 },
                        { xtype: Button, cls: 'flat', width: 100, title: i18n.global.ok, onClick: ( ) => this._click( 'ok' ) },
                        { width: 5 },
                        { xtype: Button, cls: 'flat', width: 100, title: i18n.global.cancel, onClick: ( ) => this._click( 'cancel' ) },
					]
				}
			]
        }
    }
    
    _click( bt ) {
        let value = this.input.getValue( );
        this.close( );

        this.onClick( bt, value );
    }

    onKeyDown( e ) {
        if( e.key=='Enter' ) {
            this._click( 'ok' );
        }
        else if( e.key=='Escape' ) {
            this._click( 'cancel' );
        }
    }

    onClick( bt, value ) {}
}

/**
 * standard date picker
 * cf. datePicker( )
 */

class   DatePicker extends Dialog
{
    constructor( cfg ) {
        super( cfg );

        setDefaults( this, {
            curDate: new Date( ),
            locale: i18n.def_locale,
        });

        this.cls = 'date-picker';
        this.mode = 0;
        
        this.dayColor = Color.fromStyle( 'date-picker-day' );
        this.outdayColor = Color.fromStyle( 'date-picker-outday' );
        this.curdayColor = Color.fromStyle( 'date-picker-curday' );
        this.curdayBackColor = Color.fromStyle( 'date-picker-curday-back' );
    }

    renderContent( ) {
        return {
            layout: 'horizontal',
            content: [
                {
                    layout: 'vertical',
                    cls: 'left-pane',
                    content: [
                        {
                            xtype: Label,
                            id: 'year',
                            text: this.curDate.toLocaleDateString(this.locale, { year: 'numeric' } ),
                            xref: (e) => this.cur_year = e
                        },
                        {
                            xtype: Label,
                            id: 'day',
                            text: this.curDate.toLocaleDateString(this.locale, { weekday: 'long' } ),
                            xref: (e) => this.cur_day = e
                        },
                        {
                            xtype: Label,
                            id: 'date',
                            text: this.curDate.toLocaleDateString(this.locale, { month: 'long', day: 'numeric' } ),
                            xref: (e) => this.cur_date = e
                        },
                    ]
                },
                {
                    layout: 'vertical',
                    cls: 'right-pane',
                    content: [
                        {
                            layout: 'horizontal',
                            cls: 'date-title',
                            content: [
                                {
                                    xtype: Icon,
                                    icon: 'prev',
                                    width: 32,
                                    events: {
                                        click: (e) => this.prevDates( )
                                    }
                                },
                                {
                                    xtype: Label,
                                    id: 'month-title',
                                    text: this.curDate.toLocaleDateString(this.locale, { year: 'numeric', month: 'long' } ),
                                    xref: (e) => this.cur_month = e,
                                    flex: 1,
                                    events: {
                                        click: (e) => this.modeUp( )
                                    }
                                },
                                {
                                    xtype: Icon,
                                    icon: 'next',
                                    width: 32,
                                    events: {
                                        click: (e) => this.nextDates( )
                                    }
                                }
                            ]
                        },
                        {
                            xtype: Canvas,
                            flex: 1,
                            autoClear: true,
                            xref: (e) => this.days = e,
                            onPaint: (ctx) => this.renderElements( ctx ),
                            events: {
                                click: (e) => this.jumpToDay(e),
                                touchdown: (e) => this.jumpToDay(e)
                            }
                        },
                        { height: 16 },
                        {
                            xtype: RowLayout,
                            cls: 'bottom-tools',
                            content: [
                                { flex: 1 },
                                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.ok, onClick: ( ) => this._click( 'ok' ) },
                                { width: 5 },
                                { xtype: Button, cls: 'flat', width: 100, title: i18n.global.cancel, onClick: ( ) => this._click( 'cancel' ) },
                            ]
                        }

                    ]
                }
            ]


        }
    }

    _click( bt ) {
        this.close( );
        this.onClick( bt, this.curDate );
    }

    onClick( bt, value ) {

    }

    jumpToDay( e ) {

        if( e.type=='touchdown' ) {
            e = e.touches[0];
        }

        let px = e.offsetX,
            py = e.offsetY;

        for( let i=0; i<this.hotRects.length; i++ ) {
            
            let rc = this.hotRects[i];
            if( rc.left<px && px<rc.right &&
                rc.top<py && py<rc.bottom ) {

                if( this.mode==0 ) {
                    this.curDate = rc.date;
                }
                else if( this.mode==1 ) {
                    this.curDate.setMonth( rc.date.getMonth() );
                    this.mode--;
                }
                else if( this.mode==2 )  {
                    this.curDate.setYear( rc.date.getFullYear() );
                    this.mode--;
                }

                this.dateChanged( );
                break;
            }
        }
    }

    prevDates( ) {

        if( this.mode==0 ) {
            this.curDate.setMonth( this.curDate.getMonth()-1 );
        }
        else if( this.mode==1 ) {
            this.curDate.setYear( this.curDate.getFullYear()-1 );
        }
        else if( this.mode==2 ) {
            this.curDate.setYear( this.curDate.getFullYear()-10 );
        }

        this.dateChanged( );
    }

    nextDates( ) {
        if( this.mode==0 ) {
            this.curDate.setMonth( this.curDate.getMonth()+1 );
        }
        else if( this.mode==1 ) {
            this.curDate.setYear( this.curDate.getFullYear()+1 );
        }
        else if( this.mode==2 ) {
            this.curDate.setYear( this.curDate.getFullYear()+10 );
        }

        this.dateChanged( );
    }

    dateChanged( ) {
        this.cur_year.setText( this.curDate.toLocaleDateString(this.locale, { year: 'numeric' } ) );
        this.cur_day.setText( this.curDate.toLocaleDateString(this.locale, { weekday: 'long' } ) );
        this.cur_date.setText( this.curDate.toLocaleDateString(this.locale, { month: 'long', day: 'numeric' } ) );

        if( this.mode==0 ) {
            this.cur_month.setText( this.curDate.toLocaleDateString(this.locale, { year: 'numeric', month: 'long' } ) );
        }
        else if( this.mode==1 ) {
            this.cur_month.setText( this.curDate.toLocaleDateString(this.locale, { year: 'numeric' } ) );
        }
        else {
            let cur_y = this.curDate.getFullYear( ),
                start = Math.floor( cur_y/10 ) * 10,
                end = start + 10;

            this.cur_month.setText( start + ' - ' + end );
        }

        this.days.refresh( );                            
    }

    modeUp( ) {
        if( this.mode<2 ) {
            this.mode++;
            this.dateChanged( );
        }
    }

    modeDown( ) {
        if( this.mode>0 ) {
            this.mode--;
            this.dateChanged( );
        }
    }

    renderElements( ctx ) {
        switch( this.mode ) {
            default:
            case 0:
                this.renderDates( ctx ); 
                break;

            case 1:
                this.renderMonths( ctx ); 
                break;

            case 2:
                this.renderYears( ctx ); 
                break;
        }
    }

    renderMonths( ctx ) {
        //  5 x 4

        let     ch = Math.floor(ctx.height / 5),
                cw = Math.floor(ctx.width / 4),
                cx = 0,
                cy = 0,
                cur_y = this.curDate.getFullYear( ),
                cur_m = this.curDate.getMonth( ),
                wd = new Date( cur_y, 0, 1 );
                
        ctx.font = 'normal 16px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.hotRects = [];

        // back 4 months
        wd.setMonth( -4 );

        for( let w=0; w<5; w++ ) {
            
            cx = 0;
            for( let d=0; d<4; d++ ) {
                
                let txt = wd.toLocaleDateString( this.locale, {month:'short'} );

                if( wd.getMonth()==cur_m && wd.getFullYear()==cur_y ) {
                    
                    ctx.beginPath( );
                    ctx.arc( cx + cw/2, cy+ch/2, Math.min(cw,ch)/2, 0, Math.PI*2 );
                    ctx.fillStyle =  this.curdayBackColor;
                    ctx.fill( );

                    ctx.fillStyle =  this.curdayColor;
                }
                else {
                    ctx.fillStyle =  (wd.getFullYear()==cur_y) ? this.dayColor : this.outdayColor;
                }

                ctx.fillText( txt, cx + cw/2, cy+ch/2 );

                this.hotRects.push( {
                    left: cx,
                    top: cy,
                    right: cx + cw,
                    bottom: cy + ch,
                    date: new Date( wd.getFullYear(), wd.getMonth(), 1 )
                });

                cx += cw;
                wd.setMonth( wd.getMonth()+1 );
            }

            cy += ch;
        }
    }

    renderYears( ctx ) {
        //  5 x 4

        let     ch = Math.floor(ctx.height / 5),
                cw = Math.floor(ctx.width / 4),
                cx = 0,
                cy = 0,
                cur_y = this.curDate.getFullYear( ),
                start = Math.floor( cur_y/10 ) * 10,
                end = start + 10,
                wd = new Date( start-4, 0, 1 );
                
        ctx.font = 'normal 16px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.hotRects = [];

        for( let w=0; w<5; w++ ) {
            
            cx = 0;
            for( let d=0; d<4; d++ ) {
                
                let txt = wd.toLocaleDateString( this.locale, {year:'numeric'} );

                if( wd.getFullYear()==cur_y ) {
                    
                    ctx.beginPath( );
                    ctx.arc( cx + cw/2, cy+ch/2, Math.min(cw,ch)/2, 0, Math.PI*2 );
                    ctx.fillStyle =  this.curdayBackColor;
                    ctx.fill( );

                    ctx.fillStyle =  this.curdayColor;
                }
                else {
                    let y = wd.getFullYear();
                    ctx.fillStyle =  (y>=start && y<=end) ? this.dayColor : this.outdayColor;
                }

                ctx.fillText( txt, cx + cw/2, cy+ch/2 );

                this.hotRects.push( {
                    left: cx,
                    top: cy,
                    right: cx + cw,
                    bottom: cy + ch,
                    date: new Date( wd.getFullYear(), wd.getMonth(), 1 )
                });

                cx += cw;
                wd.setYear( wd.getFullYear()+1 );
            }

            cy += ch;
        }
    }

    renderDates( ctx ) {

        //  7 x 6
        let     ch = Math.floor(ctx.height / 7),
                cw = Math.floor(ctx.width / 7),
                cx = 0,
                cy = 0,
                cur_m = this.curDate.getMonth(),
                cur_d = this.curDate.getDate(),
                fd = new Date( this.curDate.getFullYear(), cur_m, 1 ),
                wd;
                

        //  rewind to previous sunday
        fd.setDate( fd.getDate()-fd.getDay() );

        //  depending of locales, for the 1 day of the week
        let wfd = 1;    // 1 for monday, 0 for sunday
        fd.setDate( fd.getDate()+wfd );

        //  if first day of calendar, rewind 1 week before
        if( fd.getDay()==wfd && fd.getMonth()==cur_m ) {
            fd.setDate( fd.getDate()-7 );
        }
        
        fd.setHours( 12 );  // bug: time zone before 1970
        wd = new Date( fd.getTime() );
        
        ctx.font = 'normal 16px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        //  titles
        cx = 0;
        for( let d=0; d<7; d++ ) {
            let txt = wd.toLocaleDateString( this.locale, {weekday:'short'} );

            ctx.fillText( txt, cx + cw/2, cy+ch/2 );

            cx += cw;
            wd.setDate( wd.getDate()+1 );
        }

        //  dates
        wd = new Date( fd.getTime() );
        
        this.hotRects = [];

        cy  += ch;
        for( let w=0; w<6; w++ ) {
            
            cx = 0;
            for( let d=0; d<7; d++ ) {
                let txt = wd.toLocaleDateString( this.locale, {day:'numeric'} );

                if( wd.getDate()==cur_d && wd.getMonth()==cur_m ) {
                    
                    ctx.beginPath( );
                    ctx.arc( cx + cw/2, cy+ch/2, Math.min(cw,ch)/2, 0, Math.PI*2 );
                    ctx.fillStyle =  this.curdayBackColor;
                    ctx.fill( );

                    ctx.fillStyle =  this.curdayColor;
                }
                else {
                    ctx.fillStyle =  (wd.getMonth()==cur_m) ? this.dayColor : this.outdayColor;
                }

                ctx.fillText( txt, cx + cw/2, cy+ch/2 );

                this.hotRects.push( {
                    left: cx,
                    top: cy,
                    right: cx + cw,
                    bottom: cy + ch,
                    date: new Date( wd.getFullYear(), wd.getMonth(), wd.getDate() ) //wd.getTime() )
                });

                cx += cw;
                wd.setDate( wd.getDate()+1 );
            }

            cy += ch;
        }
    }
}























/**
 * 
 */

function errorMsg( cfg ) {
    let msg = new ErrorMsg( cfg );
    msg.show( );
    return msg;
}

function inputDialog( cfg ) {
    let input = new InputDialog( cfg );
    input.show( );
    return input;
}

function datePicker( cfg ) {
    let dialog = new DatePicker( cfg );
    dialog.show( );
    return dialog;
}