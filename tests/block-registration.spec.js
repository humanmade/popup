/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Popup Block', () => {
	test( 'should be registered', async ( { admin, editor } ) => {
		await admin.createNewPost();

		// Open the block inserter and search for the popup block
		await editor.insertBlock( { name: 'hm/popup' } );

		// Verify the block is inserted
		const blocks = await editor.getBlocks();
		expect( blocks ).toHaveLength( 1 );
		expect( blocks[ 0 ].name ).toBe( 'hm/popup' );
	} );
} );
