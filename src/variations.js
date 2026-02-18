import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import domReady from '@wordpress/dom-ready';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

domReady( () => {
	registerBlockVariation( 'core/button', {
		name: 'hm-popup-close',
		title: __( 'Close Popup', 'hm-popup' ),
		icon: 'exit',
		scope: [ 'block', 'inserter', 'transform' ],
		attributes: {
			url: '#close',
			metadata: { popup: 'close' },
		},
		isActive: ( blockAttributes ) =>
			blockAttributes.metadata?.popup === 'close',
	} );

	registerBlockVariation( 'core/button', {
		name: 'hm-popup-open',
		title: __( 'Open Popup', 'hm-popup' ),
		icon: 'exit',
		scope: [ 'block', 'inserter', 'transform' ],
		attributes: {
			metadata: { popup: 'open' },
		},
		isActive: ( blockAttributes ) =>
			blockAttributes.metadata?.popup === 'open',
	} );
} );

const withPopupControls = createHigherOrderComponent( ( BlockEdit ) => {
	return function PopupButtonEdit( props ) {
		const { name, attributes, setAttributes } = props;

		const popupOptions = useSelect(
			( select ) => {
				if ( name !== 'core/button' || ! attributes.metadata?.popup ) {
					return null;
				}

				const blockEditorSelect = select( 'core/block-editor' );
				return [
					{
						label: __( 'Select a popup\u2026', 'hm-popup' ),
						value: '',
					},
					...blockEditorSelect
						.getBlocksByName( 'hm/popup' )
						.map( ( id ) => blockEditorSelect.getBlock( id ) )
						.filter(
							( block ) =>
								block?.attributes.anchor &&
								block?.attributes.trigger === 'click'
						)
						.map( ( block ) => ( {
							label: block.attributes.anchor,
							value: `#${ block.attributes.anchor }`,
						} ) ),
				];
			},
			[ name, attributes.metadata?.popup ]
		);

		return (
			<>
				<BlockEdit { ...props } />
				{ popupOptions && (
					<InspectorControls>
						<PanelBody title={ __( 'Popup', 'hm-popup' ) }>
							<SelectControl
								label={ __( 'Open Popup', 'hm-popup' ) }
								value={ attributes.url || '' }
								options={ popupOptions }
								onChange={ ( url ) => setAttributes( { url } ) }
							/>
						</PanelBody>
					</InspectorControls>
				) }
			</>
		);
	};
}, 'withPopupControls' );

addFilter(
	'editor.BlockEdit',
	'hm-popup/with-popup-controls',
	withPopupControls
);
