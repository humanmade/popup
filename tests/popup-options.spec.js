/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Popup Block Options', () => {
	test.beforeEach( async ( { admin, editor } ) => {
		await admin.createNewPost();
		await editor.setPreferences( 'core/edit-post', {
			welcomeGuide: false,
		} );
		await editor.insertBlock( { name: 'hm/popup' } );
	} );

	test.describe( 'Trigger options', () => {
		test( 'defaults to "click" trigger', async ( { editor } ) => {
			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.trigger ).toBe( 'click' );
		} );

		test( 'can set trigger to "On page load"', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'load' );

			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.trigger ).toBe( 'load' );
		} );

		test( 'can set trigger to "On exit intent"', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'exit' );

			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.trigger ).toBe( 'exit' );
		} );

		test( 'shows cookie expiration control for "load" trigger', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'load' );

			await expect( page.getByText( 'Cookie expiration' ) ).toBeVisible();
		} );

		test( 'shows cookie expiration control for "exit" trigger', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'exit' );

			await expect( page.getByText( 'Cookie expiration' ) ).toBeVisible();
		} );

		test( 'hides cookie expiration control for "click" trigger', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			// Ensure click is selected
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'click' );

			await expect(
				page.getByText( 'Cookie expiration' )
			).not.toBeVisible();
		} );
	} );

	test.describe( 'Dismissible option', () => {
		test( 'defaults to dismissible', async ( { editor } ) => {
			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.dismissible ).not.toBe( false );
		} );

		test( 'can disable dismissible', async ( { editor, page } ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'checkbox', { name: 'Dismissible' } )
				.uncheck();

			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.dismissible ).toBe( false );
		} );

		test( 'updates description when made undismissible', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();

			await expect(
				page.getByText(
					'Clicking the background or pressing escape will close the popup.'
				)
			).toBeVisible();

			await page
				.getByRole( 'checkbox', { name: 'Dismissible' } )
				.uncheck();

			await expect(
				page.getByText(
					'The popup cannot be closed by clicking the background or pressing escape.'
				)
			).toBeVisible();
		} );
	} );

	test.describe( 'Dismiss on form submit option', () => {
		test( 'defaults to false', async ( { editor } ) => {
			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.dismissOnSubmit ).not.toBe( true );
		} );

		test( 'can enable dismiss on form submit', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'checkbox', { name: 'Dismiss on form submit' } )
				.check();

			const blocks = await editor.getBlocks();
			expect( blocks[ 0 ].attributes.dismissOnSubmit ).toBe( true );
		} );
	} );

	test.describe( 'Saved block output', () => {
		test( 'outputs correct data attributes for load trigger', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'load' );

			const postId = await editor.publishPost();
			await page.goto( `/?p=${ postId }` );

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toHaveAttribute( 'data-trigger', 'load' );
		} );

		test( 'outputs closedby="any" for dismissible dialogs', async ( {
			editor,
			page,
		} ) => {
			const postId = await editor.publishPost();
			await page.goto( `/?p=${ postId }` );

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toHaveAttribute( 'closedby', 'any' );
		} );

		test( 'outputs closedby="none" when undismissible', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'checkbox', { name: 'Dismissible' } )
				.uncheck();

			const postId = await editor.publishPost();
			await page.goto( `/?p=${ postId }` );

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toHaveAttribute( 'closedby', 'none' );
		} );

		test( 'outputs data-dismiss-on-submit="true" when enabled', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'checkbox', { name: 'Dismiss on form submit' } )
				.check();

			const postId = await editor.publishPost();
			await page.goto( `/?p=${ postId }` );

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toHaveAttribute(
				'data-dismiss-on-submit',
				'true'
			);
		} );
	} );

	test.describe( 'Frontend behavior', () => {
		test( 'load trigger opens popup on page load', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'load' );

			const postId = await editor.publishPost();

			// Clear localStorage so cookie expiry doesn't block the popup.
			await page.goto( `/?p=${ postId }` );
			await page.evaluate( () => localStorage.clear() );
			await page.reload();

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toBeVisible();
		} );

		test( 'undismissible popup cannot be closed via Escape', async ( {
			editor,
			page,
		} ) => {
			await editor.openDocumentSettingsSidebar();
			await page
				.getByRole( 'combobox', { name: 'Popup Trigger' } )
				.selectOption( 'load' );
			await page
				.getByRole( 'checkbox', { name: 'Dismissible' } )
				.uncheck();

			const postId = await editor.publishPost();
			await page.goto( `/?p=${ postId }` );
			await page.evaluate( () => localStorage.clear() );
			await page.reload();

			const dialog = page.locator( '.wp-block-hm-popup' );
			await expect( dialog ).toBeVisible();

			await page.keyboard.press( 'Escape' );

			// Dialog should remain open.
			await expect( dialog ).toBeVisible();
		} );
	} );
} );
