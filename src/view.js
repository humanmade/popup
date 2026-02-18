const mouseEvent = ( e ) => {
	const shouldShowExitIntent =
		! e.toElement && ! e.relatedTarget && e.clientY < 10;

	if ( shouldShowExitIntent ) {
		document.removeEventListener( 'mouseout', mouseEvent );
		document.querySelector( 'html' ).classList.add( 'has-modal-open' );
		document
			.querySelector( '.wp-block-hm-popup[data-trigger="exit"]' )
			.showModal();
		window.localStorage.setItem( 'exitIntentShown', Date.now() );
	}
};

const openPopup = ( popup ) => {
	document.querySelector( 'html' ).classList.add( 'has-modal-open' );
	popup.showModal();
};

const isWithinExpiry = ( storageKey, expirationDays ) => {
	const lastShown = parseInt(
		window.localStorage.getItem( storageKey ) || 0,
		10
	);
	return lastShown >= Date.now() - expirationDays * 24 * 60 * 60 * 1000;
};

const bootstrap = () => {
	let exitIntentSetup = false;
	document.querySelectorAll( '.wp-block-hm-popup' ).forEach( ( popup ) => {
		const dismissOnSubmit = popup.dataset.dismissOnSubmit === 'true';

		// On close remove HTML class.
		popup.addEventListener( 'close', () => {
			document
				.querySelector( 'html' )
				.classList.remove( 'has-modal-open' );
		} );

		// Dismiss on form submit.
		if ( dismissOnSubmit ) {
			popup.querySelectorAll( 'form' ).forEach( ( form ) => {
				form.addEventListener( 'submit', () => {
					popup.close();
				} );
			} );
		}

		// Handle click trigger.
		if ( popup?.dataset.trigger === 'click' ) {
			document
				.querySelectorAll( `[href$="#${ popup.id || 'open-popup' }"]` )
				.forEach( ( trigger ) => {
					trigger.addEventListener( 'click', ( event ) => {
						event.preventDefault();
						openPopup( popup );
					} );
				} );
		}

		// Handle exit intent trigger.
		if ( popup?.dataset.trigger === 'exit' ) {
			// Get expiry setting on local storage value.
			const expirationDays = parseInt( popup?.dataset.expiry || 7, 10 );

			if (
				! isWithinExpiry( 'exitIntentShown', expirationDays ) &&
				! exitIntentSetup
			) {
				exitIntentSetup = true;
				setTimeout( () => {
					document.addEventListener( 'mouseout', mouseEvent );
				}, 2000 );
			}
		}

		// Handle page load trigger.
		if ( popup?.dataset.trigger === 'load' ) {
			const expirationDays = parseInt( popup?.dataset.expiry || 7, 10 );
			const storageKey = `loadPopupShown_${ popup.id || 'popup' }`;

			if ( ! isWithinExpiry( storageKey, expirationDays ) ) {
				openPopup( popup );
				window.localStorage.setItem( storageKey, Date.now() );
			}
		}
	} );

	// Bind close events.
	document
		.querySelectorAll(
			[
				'.wp-block-hm-popup__close',
				'.wp-block-hm-popup [href$="#close"]',
			].join( ',' )
		)
		.forEach( ( el ) => {
			el.addEventListener( 'click', ( event ) => {
				event.preventDefault();
				event.currentTarget.closest( '.wp-block-hm-popup' ).close();
			} );
		} );
};

// Handle async scripts.
if ( document.readyState !== 'loading' ) {
	bootstrap();
} else {
	document.addEventListener( 'DOMContentLoaded', bootstrap );
}
