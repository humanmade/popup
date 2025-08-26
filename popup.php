<?php
/**
 * Plugin Name:       Popup Block
 * Description:       A container block that displays its contents as a popup.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.2.1
 * Author:            Human Made Limited
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-popup
 *
 * @package           hm-popup
 */

namespace HM\Popup;

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
	wp_script_add_data( 'hm-popup-view-script', 'strategy', 'defer' );
}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );

/**
 * Filters the HTML tags that are allowed for a given context.
 *
 * @param array[] $html    Allowed HTML tags.
 * @param string  $context Context name.
 * @return array[] Allowed HTML tags.
 */
function filter_wp_kses_allowed_html( array $html, string $context ) : array {
	$html['dialog'] = [
		'open' => [
			'valueless' => 'y',
		],
	];

	return $html;
}

add_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\\filter_wp_kses_allowed_html', 10, 2 );
