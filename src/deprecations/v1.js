import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Deprecated save function (v1): Uses data-dismissible attribute instead of native closedby.
 */
const save = ( { attributes } ) => {
	const blockProps = useBlockProps.save();
	const { children, ...innerBlocksProps } =
		useInnerBlocksProps.save( blockProps );

	return (
		<dialog
			{ ...innerBlocksProps }
			data-trigger={ attributes.trigger || 'click' }
			data-expiry={ attributes.cookieExpiration }
			data-backdrop-opacity={ ( attributes.opacity || 1 ) / 100 }
			data-backdrop-color={ attributes.backgroundColor }
			data-dismissible={
				attributes.dismissible !== false ? 'true' : 'false'
			}
			data-dismiss-on-submit={
				attributes.dismissOnSubmit ? 'true' : 'false'
			}
		>
			{ children }
		</dialog>
	);
};

export default {
	attributes: {
		opacity: {
			type: 'number',
			default: 75,
		},
		trigger: {
			type: 'string',
			default: 'click',
			enum: [ 'click', 'exit', 'load' ],
		},
		cookieExpiration: {
			type: 'number',
			default: 7,
		},
		dismissible: {
			type: 'boolean',
			default: true,
		},
		dismissOnSubmit: {
			type: 'boolean',
			default: false,
		},
	},
	save,
};
