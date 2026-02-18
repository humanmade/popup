/**
 * Block deprecations
 */
import v1 from './v1';

export default [
	{
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
		save: v1.save,
	},
];
