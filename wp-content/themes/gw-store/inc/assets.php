<?php
defined( 'ABSPATH' ) || exit;

function gw_store_assets(): void {
	wp_enqueue_style( 'gw-store', GW_STORE_URI . '/assets/css/store.css', array(), GW_STORE_VERSION );
	wp_enqueue_script( 'gw-store', GW_STORE_URI . '/assets/js/store.js', array(), GW_STORE_VERSION, true );
	wp_localize_script(
		'gw-store',
		'gwStore',
		array(
			'menuLabel'  => __( 'Menu', 'gw-store' ),
			'closeLabel' => __( 'Close menu', 'gw-store' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'gw_store_assets' );

