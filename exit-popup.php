<?php
/**
 * Plugin Name:       Exit Popup
 * Description:       A container block that displays its contents as an exit intent popup.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Human Made Limited
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       exit-popup
 *
 * @package           exit-popup
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function exit_popup_exit_popup_block_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'exit_popup_exit_popup_block_init' );
