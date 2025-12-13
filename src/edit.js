import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ClipboardButton,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	Button,
	BaseControl,
} from '@wordpress/components';

import './editor.scss';

const TRIGGERS = [
	{ value: 'click', label: __( 'On click', 'hm-popup' ) },
	{ value: 'exit', label: __( 'On exit intent', 'hm-popup' ) },
];

/**
 * SVG icon component for anchor position visualization.
 * Shows a button (square) and popup (rectangle) in the specified position.
 *
 * @param {Object} props
 * @param {string} props.position - The anchor position value.
 * @return {Element} SVG element.
 */
const AnchorPositionIcon = ( { position } ) => {
	// Button position (center of the grid)
	const buttonX = 12;
	const buttonY = 12;
	const buttonSize = 8;

	// Calculate popup position based on anchor position
	const popupWidth = 10;
	const popupHeight = 6;
	let popupX, popupY;

	switch ( position ) {
		case 'top':
			popupX = buttonX + buttonSize / 2 - popupWidth / 2;
			popupY = buttonY - popupHeight - 1;
			break;
		case 'top-start':
			popupX = buttonX;
			popupY = buttonY - popupHeight - 1;
			break;
		case 'top-end':
			popupX = buttonX + buttonSize - popupWidth;
			popupY = buttonY - popupHeight - 1;
			break;
		case 'bottom':
			popupX = buttonX + buttonSize / 2 - popupWidth / 2;
			popupY = buttonY + buttonSize + 1;
			break;
		case 'bottom-start':
			popupX = buttonX;
			popupY = buttonY + buttonSize + 1;
			break;
		case 'bottom-end':
			popupX = buttonX + buttonSize - popupWidth;
			popupY = buttonY + buttonSize + 1;
			break;
		case 'left':
			popupX = buttonX - popupWidth - 1;
			popupY = buttonY + buttonSize / 2 - popupHeight / 2;
			break;
		case 'left-start':
			popupX = buttonX - popupWidth - 1;
			popupY = buttonY;
			break;
		case 'left-end':
			popupX = buttonX - popupWidth - 1;
			popupY = buttonY + buttonSize - popupHeight;
			break;
		case 'right':
			popupX = buttonX + buttonSize + 1;
			popupY = buttonY + buttonSize / 2 - popupHeight / 2;
			break;
		case 'right-start':
			popupX = buttonX + buttonSize + 1;
			popupY = buttonY;
			break;
		case 'right-end':
			popupX = buttonX + buttonSize + 1;
			popupY = buttonY + buttonSize - popupHeight;
			break;
		default:
			popupX = buttonX + buttonSize / 2 - popupWidth / 2;
			popupY = buttonY + buttonSize + 1;
	}

	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ /* Button (trigger) */ }
			<rect
				x={ buttonX }
				y={ buttonY }
				width={ buttonSize }
				height={ buttonSize }
				rx="1"
				fill="currentColor"
				opacity="0.6"
			/>
			{ /* Popup */ }
			<rect
				x={ popupX }
				y={ popupY }
				width={ popupWidth }
				height={ popupHeight }
				rx="1"
				fill="currentColor"
			/>
		</svg>
	);
};

/**
 * Visual anchor position picker component.
 *
 * @param {Object}   props
 * @param {string}   props.value    - Current anchor position value.
 * @param {Function} props.onChange - Callback when position changes.
 * @return {Element} Component element.
 */
const AnchorPositionControl = ( { value, onChange } ) => {
	const positions = [
		[ 'top-start', 'top', 'top-end' ],
		[ 'left-start', null, 'right-start' ],
		[ 'left', null, 'right' ],
		[ 'left-end', null, 'right-end' ],
		[ 'bottom-start', 'bottom', 'bottom-end' ],
	];

	return (
		<BaseControl
			label={ __( 'Anchor Position', 'hm-popup' ) }
			help={ __(
				'Choose where the popup appears relative to the trigger button.',
				'hm-popup'
			) }
			__nextHasNoMarginBottom
		>
			<div className="hm-popup-anchor-position-grid">
				{ positions.map( ( row, rowIndex ) => (
					<div
						key={ rowIndex }
						className="hm-popup-anchor-position-row"
					>
						{ row.map( ( position, colIndex ) =>
							position ? (
								<Button
									key={ position }
									className={ `hm-popup-anchor-position-button ${
										value === position ? 'is-selected' : ''
									}` }
									onClick={ () => onChange( position ) }
									label={ position
										.split( '-' )
										.map(
											( word ) =>
												word.charAt( 0 ).toUpperCase() +
												word.slice( 1 )
										)
										.join( ' ' ) }
								>
									<AnchorPositionIcon position={ position } />
								</Button>
							) : (
								<div
									key={ `empty-${ rowIndex }-${ colIndex }` }
									className="hm-popup-anchor-position-center"
								>
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
										fill="none"
									>
										<rect
											x="12"
											y="12"
											width="8"
											height="8"
											rx="1"
											fill="currentColor"
											opacity="0.3"
										/>
									</svg>
								</div>
							)
						) }
					</div>
				) ) }
			</div>
		</BaseControl>
	);
};

/**
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @param {string}   props.clientId
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	// Manually handle background classes and styles because we're skipping automatic serialisation.
	const { opacity, backgroundColor, style, layout } = attributes;
	const opacityVal = Number( ( opacity || 0 ) / 100 ).toFixed( 2 );
	const backgrounds = [];
	const styles = {
		backgroundSize: style?.background?.backgroundSize || 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		backgroundImage: '',
	};

	if ( backgroundColor ) {
		styles.backgroundColor = `color(from var(--wp--preset--color--${ backgroundColor }) srgb r g b / ${ opacityVal }) !important`;
	}

	if ( style?.color?.gradient ) {
		backgrounds.push( style.color.gradient );
	} else {
		// Default placeholder
		backgrounds.push(
			`repeating-linear-gradient( 45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2) 10px, rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.2) 20px)`
		);
	}

	styles.backgroundImage = `${ backgrounds.join( ', ' ) } !important`;

	const needsWidth = attributes.className?.includes( 'is-style-anchored' )
		|| attributes.className?.includes( 'is-style-side--left' )
		|| attributes.className?.includes( 'is-style-side--right' );

	// When anchored style is applied, set default contentSize
	useEffect( () => {
		if ( needsWidth && ! layout?.contentSize ) {
			setAttributes( {
				layout: {
					...( layout || {} ),
					type: 'constrained',
					contentSize: '360px',
				},
			} );
		}
	}, [ needsWidth, layout, setAttributes ] );

	const { ...blockProps } = useBlockProps( {
		style: styles,
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		template: [
			[
				'core/group',
				{
					lock: {
						move: true,
						remove: true,
					},
					backgroundColor: 'white',
					style: {
						spacing: {
							padding: {
								top: 'var:preset|spacing|40',
								bottom: 'var:preset|spacing|40',
								left: 'var:preset|spacing|40',
								right: 'var:preset|spacing|40',
							},
						},
					},
				},
				[ [ 'core/paragraph' ] ],
			],
		],
		allowedBlocks: [ 'core/group' ],
		renderAppender: false,
	} );

	const [ hasCopied, setHasCopied ] = useState( false );

	return (
		<div { ...innerBlocksProps }>
			<style>
				{ `#block-${ clientId } {
					background-color: ${ styles.backgroundColor };
					&::before {
						content: '';
						position: absolute;
						left: 0; right: 0;
						top: 0; bottom: 0;
						z-index: 1;
						background-image: ${ styles.backgroundImage };
						background-repeat: ${ styles.backgroundRepeat };
						background-size: ${ styles.backgroundSize };
						background-position: ${ styles.backgroundPosition };
						opacity: ${ opacityVal };
					}
				` }
			</style>
			<InspectorControls group="default">
				<PanelBody>
					{ attributes.trigger === 'exit' && (
						<p>
							{ __(
								'The popup will be invisible until the user moves their mouse cursor up and out of the window or tab.',
								'hm-popup'
							) }
						</p>
					) }
					<p>
						{ __(
							'Clicking the background or pressing escape will close the popup.',
							'hm-popup'
						) }
					</p>
					<p>
						{ __(
							'A link or button with the URL "#close" anywhere within the popup will also close it.',
							'hm-popup'
						) }
					</p>
				</PanelBody>
				<PanelBody>
					<SelectControl
						label={ __( 'Popup Trigger', 'hm-popup' ) }
						options={ TRIGGERS }
						value={ attributes.trigger }
						onChange={ ( trigger ) => setAttributes( { trigger } ) }
					/>
					{ attributes.trigger === 'click' && (
						<TextControl
							label={ __( 'Anchor / ID', 'hm-popup' ) }
							help={
								<>
									{ __(
										'You can set any button or link url to the following value to trigger this popup:',
										'hm-popup'
									) }
									<br />
									<code>#{ attributes.anchor }</code>
									<ClipboardButton
										variant="secondary"
										text={ `#${ attributes.anchor }` }
										onCopy={ () => setHasCopied( true ) }
										onFinishCopy={ () =>
											setHasCopied( false )
										}
									>
										{ hasCopied ? 'Copied!' : 'Copy Text' }
									</ClipboardButton>
								</>
							}
							value={ attributes.anchor || '' }
							onChange={ ( anchor ) =>
								setAttributes( { anchor } )
							}
						/>
					) }
					{ attributes.trigger === 'exit' && (
						<RangeControl
							label={ __( 'Cookie expiration', 'hm-popup' ) }
							help={ __(
								'Number of days before exit popup can be shown again to the current visitor',
								'hm-popup'
							) }
							value={ attributes.cookieExpiration }
							onChange={ ( cookieExpiration ) =>
								setAttributes( { cookieExpiration } )
							}
							min={ 0 }
							max={ 30 }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody>
					<RangeControl
						label={ __( 'Backdrop opacity', 'hm-popup' ) }
						value={ attributes.opacity }
						onChange={ ( opacity ) => setAttributes( { opacity } ) }
						min={ 0 }
						max={ 100 }
						step={ 1 }
					/>
				</PanelBody>
				{ isAnchored && (
					<PanelBody>
						<AnchorPositionControl
							value={ attributes.anchorPosition || 'bottom' }
							onChange={ ( anchorPosition ) =>
								setAttributes( { anchorPosition } )
							}
						/>
					</PanelBody>
				) }
			</InspectorControls>
			{ children }
		</div>
	);
}
