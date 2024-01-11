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
		<div
			{ ...innerBlocksProps }
			data-expiry={ attributes.cookieExpiration }
		>
			{ children }
			<div
				className={ backdropClassNames.join( ' ' ) }
				style={ styles }
			></div>
		</div>
	);
}
