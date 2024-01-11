const exit = ( e ) => {
	const shouldExit =
		e.currentTarget.classList.contains(
			'wp-block-hm-exit-popup__backdrop'
		) || // user clicks on mask
		e.currentTarget.classList.contains( 'wp-block-hm-exit-popup__close' ) || // user clicks on the close icon
		e.currentTarget.href.endsWith( '#close' ) || // user clicks custom close link / button
		e.keyCode === 27; // user hits escape

	if ( shouldExit ) {
		e.preventDefault();
		document.querySelector( 'html' ).classList.remove( 'has-modal-open' );
		document
			.querySelector( '.wp-block-hm-exit-popup' )
			.classList.remove( 'wp-block-hm-exit-popup--show' );
	}
};

const mouseEvent = ( e ) => {
	const shouldShowExitIntent =
		! e.toElement && ! e.relatedTarget && e.clientY < 10;

	if ( shouldShowExitIntent ) {
		document.removeEventListener( 'mouseout', mouseEvent );
		document
			.querySelector( '.wp-block-hm-exit-popup' )
			.classList.add( 'wp-block-hm-exit-popup--show' );
		document.querySelector( 'html' ).classList.add( 'has-modal-open' );

		window.localStorage.setItem( 'exitIntentShown', Date.now() );
	}
};

const bootstrap = () => {
	// Get expiry setting on local storage value.
	const expirationDays = parseInt(
		document.querySelector( '.wp-block-hm-exit-popup' )?.dataset.expiry ||
			7,
		10
	);

	if (
		parseInt( window.localStorage.getItem( 'exitIntentShown' ) || 0, 10 ) <
		Date.now() - expirationDays * 24 * 60 * 60 * 1000
	) {
		setTimeout( () => {
			document.addEventListener( 'mouseout', mouseEvent );
			document.addEventListener( 'keydown', exit );
			document
				.querySelectorAll(
					[
						'.wp-block-hm-exit-popup__backdrop',
						'.wp-block-hm-exit-popup__close',
						'.wp-block-hm-exit-popup [href="#close"]',
					].join( ',' )
				)
				.forEach( ( el ) => {
					el.addEventListener( 'click', exit );
				} );
		}, 3000 );
	}
};

// Handle async scripts.
if ( document.readyState !== 'loading' ) {
	bootstrap();
} else {
	document.addEventListener( 'DOMContentLoaded', bootstrap );
}
