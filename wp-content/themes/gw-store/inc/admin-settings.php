<?php
defined( 'ABSPATH' ) || exit;

function gw_store_customize( WP_Customize_Manager $customizer ): void {
	$customizer->add_section( 'gw_storefront', array( 'title' => __( 'GW Storefront', 'gw-store' ), 'priority' => 30 ) );
	$fields = array(
		'gw_announcement' => array( __( 'Announcement', 'gw-store' ), __( 'Demo store — shipping and offers are configured at checkout.', 'gw-store' ) ),
		'gw_hero_title'   => array( __( 'Hero title', 'gw-store' ), __( 'Wear your story.', 'gw-store' ) ),
		'gw_hero_copy'    => array( __( 'Hero copy', 'gw-store' ), __( 'Everyday fits, original graphics and custom prints made personal.', 'gw-store' ) ),
		'gw_support_email'=> array( __( 'Support email', 'gw-store' ), '' ),
		'gw_instagram_url'=> array( __( 'Instagram URL', 'gw-store' ), '' ),
	);
	foreach ( $fields as $id => $field ) {
		$customizer->add_setting( $id, array( 'default' => $field[1], 'sanitize_callback' => str_contains( $id, 'url' ) ? 'esc_url_raw' : 'sanitize_text_field' ) );
		$customizer->add_control( $id, array( 'label' => $field[0], 'section' => 'gw_storefront', 'type' => 'text' ) );
	}
}
add_action( 'customize_register', 'gw_store_customize' );

