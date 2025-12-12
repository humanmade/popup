import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * @param {Object} props
 * @param {Object} props.attributes
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
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
			data-use-css-anchoring={ attributes.useCssAnchoring || undefined }
			data-anchor-position={ attributes.useCssAnchoring ? ( attributes.anchorPosition || 'bottom' ) : undefined }
		>
			{ children }
		</dialog>
	);
}
