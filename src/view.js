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

	// Set the position-anchor on the popup.
	popup.style.positionAnchor = anchorName;

	// Store position as a data attribute for use in stylesheet.
	popup.dataset.anchorPositionActive = position;
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
		const expirationDays = parseInt( popup?.dataset.expiry ?? 7, 10 );

		// On clicking the dialog but not its content, close.
		if ( popup.closedBy === 'any' ) {
			popup.addEventListener( 'click', ( event ) => {
				if ( event.currentTarget === popup ) {
					popup.close();
				}
			} );
		}

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
			const isAnchored = popup.classList.contains( 'is-style-anchored' );

			document
				.querySelectorAll( `[href$="#${ popup.id || 'open-popup' }"]` )
				.forEach( ( trigger ) => {
					trigger.addEventListener( 'click', ( event ) => {
						event.preventDefault();

						// Apply CSS anchor positioning if anchored style is active.
						if ( isAnchored ) {
							applyCssAnchorPositioning( popup, trigger );
						}

						openPopup( popup );
					} );
				} );
		}

		// Handle exit intent trigger.
		if ( popup?.dataset.trigger === 'exit' ) {
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
