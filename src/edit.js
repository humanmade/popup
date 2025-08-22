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
} from '@wordpress/components';

import './editor.scss';

const TRIGGERS = [
	{ value: 'click', label: __( 'On click', 'hm-popup' ) },
	{ value: 'exit', label: __( 'On exit intent', 'hm-popup' ) },
];

/**
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { ...blockProps } = useBlockProps();
	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		template: [
			[
				'core/group',
				{ lock: { remove: false } },
				[ [ 'core/paragraph' ] ],
			],
		],
		allowedBlocks: [ 'core/group' ],
		templateLock: "insert"
	} );

	const [ hasCopied, setHasCopied ] = useState( false );

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls>
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
									<p>
										{ __(
											'You can set any button or link url to the following value to trigger this popup:',
											'hm-popup'
										) }
									</p>
									<p>
										<code>#{ attributes.anchor }</code>
										<ClipboardButton
											variant="secondary"
											text={ `#${ attributes.anchor }` }
											onCopy={ () =>
												setHasCopied( true )
											}
											onFinishCopy={ () =>
												setHasCopied( false )
											}
										>
											{ hasCopied
												? 'Copied!'
												: 'Copy Text' }
										</ClipboardButton>
									</p>
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
			{ children }
		</div>
	);
}
