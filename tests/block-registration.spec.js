/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Popup Block', () => {
	test( 'should be registered', async ( { admin, editor, page } ) => {
		await admin.createNewPost();
		await editor.setPreferences( 'core/edit-post', {
			welcomeGuide: false,
		} );

		// Close welcome guide if it appears
		const welcomeGuideVisible = await page
			.locator(
				'.edit-site-welcome-guide, .edit-post-welcome-guide'
			)
			.isVisible( { timeout: 2000 } )
			.catch( () => false );

		if ( welcomeGuideVisible ) {
			const closeButton = page.locator(
				'button[aria-label="Close"]'
			);
			const isCloseButtonVisible = await closeButton
				.isVisible( { timeout: 1000 } )
				.catch( () => false );
			if ( isCloseButtonVisible ) {
				await closeButton.click();
				await page.waitForTimeout( 500 );
			}
		}

		// Open the block inserter and search for the popup block
		await editor.insertBlock( { name: 'hm/popup' } );

		// Verify the block is inserted
		const blocks = await editor.getBlocks();
		expect( blocks ).toHaveLength( 1 );
		expect( blocks[ 0 ].name ).toBe( 'hm/popup' );
	} );
} );
