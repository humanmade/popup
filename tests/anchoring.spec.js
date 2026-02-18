/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Popup Block Anchoring', () => {
	test.beforeEach( async ( { admin, editor, page } ) => {
		await admin.createNewPost();
		await editor.setPreferences( 'core/edit-post', {
			welcomeGuide: false,
		} );
		// Close welcome guide if it appears
		const welcomeGuideVisible = await page
			.locator( '.edit-site-welcome-guide, .edit-post-welcome-guide' )
			.isVisible( { timeout: 2000 } )
			.catch( () => false );

		if ( welcomeGuideVisible ) {
			const closeButton = page.locator( 'button[aria-label="Close"]' );
			const isCloseButtonVisible = await closeButton
				.isVisible( { timeout: 1000 } )
				.catch( () => false );
			if ( isCloseButtonVisible ) {
				await closeButton.click();
				await page.waitForTimeout( 500 );
			}
		}
	} );

	test( 'should anchor popup to trigger button on frontend', async ( {
		editor,
		page,
	} ) => {
		// Insert a buttons block first (as the trigger)
		await editor.insertBlock( {
			name: 'core/buttons',
			innerBlocks: [
				{
					name: 'core/button',
					attributes: {
						text: 'Open Popup',
						url: '#test-anchored-popup',
					},
				},
			],
		} );

		// Insert a popup block with anchored style
		await editor.insertBlock( {
			name: 'hm/popup',
			attributes: {
				anchor: 'test-anchored-popup',
				trigger: 'click',
				className: 'is-style-anchored',
				anchorPosition: 'bottom',
			},
		} );

		// Click on the popup block to select it and add content
		await page.locator('iframe[name="editor-canvas"]').contentFrame()
			.getByRole('document', { name: 'Empty block; start writing or' })
			.click();

		// Type some content
		await page.keyboard.type( 'Anchored popup content' );

		// Publish the post
		const postId = await editor.publishPost();

		// Get the post URL and visit the frontend
		await page.goto( `/?p=${ postId }` );

		// Verify the popup is initially hidden (not open)
		const dialog = page.locator( 'dialog.wp-block-hm-popup' );
		await expect( dialog ).not.toHaveAttribute( 'open' );

		// Get the trigger button position before clicking
		const triggerButton = page.locator( 'a:has-text("Open Popup")' );
		const buttonBox = await triggerButton.boundingBox();

		// Click the trigger button
		await triggerButton.click();

		// Verify the popup is now open
		await expect( dialog ).toHaveAttribute( 'open' );

		// Verify the popup has anchored style class
		await expect( dialog ).toHaveClass( /is-style-anchored/ );
		await expect( dialog ).toHaveAttribute(
			'data-anchor-position-active',
			'bottom'
		);

		// Get the popup position
		const popupBox = await dialog.boundingBox();

		// Verify the popup is positioned below the button (bottom anchoring)
		// The popup's top should be at or below the button's bottom
		expect( popupBox.y ).toBeGreaterThanOrEqual(
			buttonBox.y + buttonBox.height - 5
		);

		// Verify horizontal centering - popup center should be near button center
		const buttonCenterX = buttonBox.x + buttonBox.width / 2;
		const popupCenterX = popupBox.x + popupBox.width / 2;
		expect( Math.abs( popupCenterX - buttonCenterX ) ).toBeLessThan( 50 );
	} );

	test( 'should position popup at different anchor positions', async ( {
		editor,
		page,
	} ) => {
		// Insert a buttons block (as the trigger)
		await editor.insertBlock( {
			name: 'core/buttons',
			innerBlocks: [
				{
					name: 'core/button',
					attributes: {
						text: 'Open Right Popup',
						url: '#test-right-popup',
					},
				},
			],
		} );

		// Insert a popup block with right anchoring
		await editor.insertBlock( {
			name: 'hm/popup',
			attributes: {
				anchor: 'test-right-popup',
				trigger: 'click',
				className: 'is-style-anchored',
				anchorPosition: 'right',
			},
		} );

		// Add content to popup
		await page.locator('iframe[name="editor-canvas"]').contentFrame()
			.getByRole('document', { name: 'Empty block; start writing or' })
			.click();
		await page.keyboard.type( 'Right anchored popup' );


		// Publish the post
		const postId = await editor.publishPost();

		// Get the post URL and visit the frontend
		await page.goto( `/?p=${ postId }` );

		// Get button position and click
		const triggerButton = page.locator( 'a:has-text("Open Right Popup")' );
		const buttonBox = await triggerButton.boundingBox();
		await triggerButton.click();

		// Verify popup is open and has right anchor position
		const dialog = page.locator( 'dialog.wp-block-hm-popup' );
		await expect( dialog ).toHaveAttribute( 'open' );
		await expect( dialog ).toHaveAttribute(
			'data-anchor-position-active',
			'right'
		);

		// Verify the popup is positioned to the right of the button
		const popupBox = await dialog.boundingBox();
		expect( popupBox.x ).toBeGreaterThanOrEqual(
			buttonBox.x + buttonBox.width - 5
		);
	} );
} );
