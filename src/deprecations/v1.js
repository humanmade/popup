/**
 * Deprecated save function (v1): Uses data-dismissible attribute instead of native closedby.
 */
const save = ( { attributes } ) => {
	return (
		<dialog
			className="wp-block-hm-popup"
			data-trigger={ attributes.trigger || 'click' }
			data-expiry={ attributes.cookieExpiration }
			data-backdrop-opacity={ ( attributes.opacity || 1 ) / 100 }
			data-backdrop-color={ attributes.backgroundColor }
			data-dismissible={ attributes.dismissible !== false ? 'true' : 'false' }
			data-dismiss-on-submit={ attributes.dismissOnSubmit ? 'true' : 'false' }
		/>
	);
};

export default {
	save,
};
