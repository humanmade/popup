const exit = ( e ) => {
    const shouldExit =
        [ ...e.target.classList ].includes( 'wp-block-hm-exit-popup' ) || // user clicks on mask
        e.target.classList.includes( 'wp-block-hm-exit-popup__close' ) || // user clicks on the close icon
        e.keyCode === 27; // user hits escape

    if ( shouldExit ) {
		document.querySelector( 'html' ).classList.remove( 'has-modal-open' );
        document.querySelector( '.wp-block-hm-exit-popup' ).classList.remove( 'wp-block-hm-exit-popup--show' );
    }
};

const mouseEvent = ( e ) => {
    const shouldShowExitIntent =
        ! e.toElement &&
        ! e.relatedTarget &&
        e.clientY < 10;

    if ( shouldShowExitIntent ) {
        document.removeEventListener( 'mouseout', mouseEvent );
        document.querySelector( '.wp-block-hm-exit-popup' ).classList.add( 'wp-block-hm-exit-popup--show' );
		document.querySelector( 'html' ).classList.add( 'has-modal-open' );

        window.localStorage.setItem( 'exitIntentShown', Date.now() );
    }
};

// 7 day expiry on local storage value.
if ( parseInt( window.localStorage.getItem( 'exitIntentShown' ) || 0, 10 ) < Date.now() - ( 7 * 24 * 60 * 60 * 1000 ) ) {
    setTimeout( () => {
        document.addEventListener( 'mouseout', mouseEvent );
        document.addEventListener( 'keydown', exit );
        document.querySelector( '.wp-block-hm-exit-popup' ).addEventListener( 'click', exit );
    }, 3000 );
}
