import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	ClipboardButton,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import './editor.scss';

const TRIGGERS = [
	{ value: 'click', label: __( 'On click', 'hm-popup' ) },
	{ value: 'exit', label: __( 'On exit intent', 'hm-popup' ) },
	{ value: 'load', label: __( 'On page load', 'hm-popup' ) },
];

/**
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	// Manually handle background classes and styles because we're skipping automatic serialisation.
	const { backgroundColor, style } = attributes;
	const classNames = [];
	const styles = {};
	if ( backgroundColor ) {
		classNames.push(
			`has-background-color has-${ backgroundColor }-background-color`
		);
	}
	if ( style?.background ) {
		style.backgroundImage = `url(${ style.background?.url })`;
		style.backgroundSize = style.background?.backgroundSize || 'cover';
	}

	const { ...blockProps } = useBlockProps( {
		className: classNames.join( ' ' ),
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
					{ attributes.trigger === 'load' && (
						<p>
							{ __(
								'The popup will appear immediately when the page loads.',
								'hm-popup'
							) }
						</p>
					) }
					{ attributes.dismissible ? (
						<p>
							{ __(
								'Clicking the background or pressing escape will close the popup.',
								'hm-popup'
							) }
						</p>
					) : (
						<p>
							{ __(
								'The popup cannot be closed by clicking the background or pressing escape.',
								'hm-popup'
							) }
						</p>
					) }
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
					{ ( attributes.trigger === 'exit' ||
						attributes.trigger === 'load' ) && (
						<RangeControl
							label={ __( 'Cookie expiration', 'hm-popup' ) }
							help={ __(
								'Number of days before popup can be shown again to the current visitor',
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
					<ToggleControl
						label={ __( 'Dismissible', 'hm-popup' ) }
						help={ __(
							'Allow the popup to be closed by clicking the backdrop or pressing Escape.',
							'hm-popup'
						) }
						checked={ attributes.dismissible !== false }
						onChange={ ( dismissible ) =>
							setAttributes( { dismissible } )
						}
					/>
					<ToggleControl
						label={ __( 'Dismiss on form submit', 'hm-popup' ) }
						help={ __(
							'Automatically close the popup when a form inside it is submitted.',
							'hm-popup'
						) }
						checked={ !! attributes.dismissOnSubmit }
						onChange={ ( dismissOnSubmit ) =>
							setAttributes( { dismissOnSubmit } )
						}
					/>
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
			</InspectorControls>
			{ children }
		</div>
	);
}
