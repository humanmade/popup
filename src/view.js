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

/**
 * Apply CSS anchor positioning styles to popup and trigger.
 *
 * @param {HTMLElement} popup   The popup dialog element.
 * @param {HTMLElement} trigger The trigger element that opens the popup.
 */
const applyCssAnchorPositioning = ( popup, trigger ) => {
	const position = popup.dataset.anchorPosition || 'bottom';
	const anchorName = `--popup-anchor-${ popup.id || 'default' }`;

	// Set the anchor-name on the trigger element.
	trigger.style.anchorName = anchorName;

	// Add anchored class to popup.
	popup.classList.add( 'is-anchored' );

	// Set the position-anchor on the popup.
	popup.style.positionAnchor = anchorName;

	// Store position as a CSS custom property for use in stylesheet.
	popup.dataset.anchorPositionActive = position;
};

const bootstrap = () => {
	let exitIntentSetup = false;
	document.querySelectorAll( '.wp-block-hm-popup' ).forEach( ( popup ) => {
		// Block selectors API doesn't work so we need to

		// On close remove HTML class.
		popup.addEventListener( 'close', () => {
			document
				.querySelector( 'html' )
				.classList.remove( 'has-modal-open' );
		} );

		// On backdrop click, close modal.
		popup.addEventListener( 'mousedown', ( event ) => {
			if ( event.target === event.currentTarget ) {
				event.currentTarget.close();
			}
		} );

		// Handle click trigger.
		if ( popup?.dataset.trigger === 'click' ) {
			const useCssAnchoring = popup.dataset.useCssAnchoring === 'true';

			document
				.querySelectorAll( `[href$="#${ popup.id || 'open-popup' }"]` )
				.forEach( ( trigger ) => {
					trigger.addEventListener( 'click', ( event ) => {
						event.preventDefault();
						document
							.querySelector( 'html' )
							.classList.add( 'has-modal-open' );

						// Apply CSS anchor positioning if enabled.
						if ( useCssAnchoring ) {
							applyCssAnchorPositioning( popup, trigger );
						}

						popup.showModal();
					} );
				} );
		}

		// Handle exit intent trigger.
		if ( popup?.dataset.trigger === 'exit' ) {
			// Get expiry setting on local storage value.
			const expirationDays = parseInt( popup?.dataset.expiry || 7, 10 );

			if (
				parseInt(
					window.localStorage.getItem( 'exitIntentShown' ) || 0,
					10
				) <
					Date.now() - expirationDays * 24 * 60 * 60 * 1000 &&
				! exitIntentSetup
			) {
				exitIntentSetup = true;
				setTimeout( () => {
					document.addEventListener( 'mouseout', mouseEvent );
				}, 2000 );
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
