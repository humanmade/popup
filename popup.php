<?php
/**
 * Plugin Name:       Popup Block
 * Description:       A container block that displays its contents as a popup.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           __VERSION__
 * Author:            Human Made Limited
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       hm-popup
 *
 * @package           hm-popup
 */

namespace HM\Popup;

use WP_HTML_Tag_Processor;
use WP_Style_Engine;
use WP_Style_Engine_CSS_Rule;

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
	$html['dialog'] = _wp_add_global_attributes( [
		'open' => [
			'valueless' => 'y',
		],
		'closedby' => true,
	] );
	$html['button']['commandfor'] = true;
	$html['button']['command'] = true;

	return $html;
}

add_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\\filter_wp_kses_allowed_html', 10, 2 );

/**
 * Filters the content of the block.
 *
 * @param string    $block_content The block content.
 * @param array     $block         The full block, including name and attributes.
 * @param \WP_Block $instance      The block instance.
 * @return string The block content.
 */
function filter_render_block( $block_content, $block, \WP_Block $instance ) {

	$classname = 'wp-elements-' . md5( maybe_serialize( $block['attrs'] ) );

	$styles = [
		'opacity' => ( $block['attrs']['opacity'] ?? '0' ) . '%',
		'background-color' => "var(--wp--preset--color--{$block['attrs']['backgroundColor']})",
		'background-position' => 'center',
		'background-size' => 'cover',
		'background-repeat' => 'no-repeat',
	];

	if ( ! empty( $block['attrs']['style']['color']['gradient'] ) ) {
		$styles['background-color'] = 'transparent';
		$styles['background-image'] = "{$block['attrs']['style']['color']['gradient']}";
	}

	$styles = array_map( function ( $style, $prop ) {
		return "{$prop}: {$style} !important";
	}, $styles, array_keys( $styles ) );

	$style = implode( ';', $styles );
	$style = ".{$classname}::backdrop{{$style}}";

	wp_enqueue_block_support_styles( $style );

	$block_content = new WP_HTML_Tag_Processor( $block_content );
	$block_content->next_tag();
	$block_content->add_class( $classname );

	return (string) $block_content;
}

add_filter( 'render_block_hm/popup', __NAMESPACE__ . '\\filter_render_block', 10, 3 );

add_action( 'init', __NAMESPACE__ . '\\action_init' );

/**
 * Fires after WordPress has finished loading but before any headers are sent.
 *
 */
function action_init() : void {
	register_block_style(
		'hm/popup',
		[
			'name' => 'side--left',
			'label' => __( 'Left Side', 'hm-popup' ),
		]
	);

	register_block_style(
		'hm/popup',
		[
			'name' => 'side--right',
			'label' => __( 'Right Side', 'hm-popup' ),
		]
	);

	register_block_style(
		'hm/popup',
		[
			'name' => 'anchored',
			'label' => __( 'Anchored', 'hm-popup' ),
		]
	);
}
