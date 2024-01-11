import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';

import { PanelBody, RangeControl } from '@wordpress/components';

import './editor.scss';

/**
 * @param {Object}   props
 * @param {Object}   props.attributes
 * @param {Function} props.setAttributes
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { ...blockProps } = useBlockProps();
	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		template: [ [ 'core/group', {}, [ [ 'core/paragraph' ] ] ] ],
	} );

	const backdropClassNames = [ 'wp-block-hm-exit-popup__backdrop' ];
	if ( attributes.backgroundColor ) {
		backdropClassNames.push(
			`has-${ attributes.backgroundColor }-background-color`
		);
	}

	const styles = {
		opacity: attributes.opacity / 100,
	};

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls group="styles">
				<PanelBody>
					<RangeControl
						label={ __( 'Background opacity', 'exit-popup' ) }
						value={ attributes.opacity }
						onChange={ ( opacity ) => setAttributes( { opacity } ) }
						min={ 0 }
						max={ 100 }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				<PanelBody>
					<p>
						{ __(
							'The popup will be invisible until someone moves their mouse cursor up and out of the window or tab.',
							'exit-popup'
						) }
					</p>
					<p>
						{ __(
							'Clicking the background or pressing escape will close the popup.',
							'exit-popup'
						) }
					</p>
					<p>
						{ __(
							'A link or button with the URL "#close" anywhere within the popup will also close it.',
							'exit-popup'
						) }
					</p>
				</PanelBody>
				<PanelBody>
					<RangeControl
						label={ __( 'Cookie expiration', 'exit-popup' ) }
						help={ __(
							'Number of days before exit popup can be shown again to the current visitor',
							'exit-popup'
						) }
						value={ attributes.cookieExpiration }
						onChange={ ( cookieExpiration ) =>
							setAttributes( { cookieExpiration } )
						}
						min={ 0 }
						max={ 30 }
					/>
				</PanelBody>
			</InspectorControls>
			{ children }
			<div
				className={ backdropClassNames.join( ' ' ) }
				style={ styles }
			></div>
		</div>
	);
}
