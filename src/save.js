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

	const isAnchored = attributes.className?.includes( 'is-style-anchored' );

	return (
		<dialog
			{ ...innerBlocksProps }
			data-trigger={ attributes.trigger || 'click' }
			data-expiry={ attributes.cookieExpiration }
			data-anchor-position={
				isAnchored ? attributes.anchorPosition || 'bottom' : undefined
			}
		>
			{ children }
		</dialog>
	);
}
