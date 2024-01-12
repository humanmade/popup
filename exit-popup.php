<?php
/**
 * Plugin Name:       Exit Popup
 * Description:       A container block that displays its contents as an exit intent popup.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Human Made Limited
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       exit-popup
 *
 * @package           exit-popup
 */

namespace HM\Exit_Popup;

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
function init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', __NAMESPACE__ . '\\init' );

/**
 * Fires when scripts and styles are enqueued.
 *
 */
function enqueue_scripts() : void {
	wp_script_add_data( 'hm-exit-popup-view-script', 'strategy', 'defer' );
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
