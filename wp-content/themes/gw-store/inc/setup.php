<?php
defined( 'ABSPATH' ) || exit;

function gw_store_setup(): void {
	load_theme_textdomain( 'gw-store', GW_STORE_DIR . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'gw-store' ),
			'footer'  => __( 'Footer menu', 'gw-store' ),
		)
	);
	add_image_size( 'gw-card', 720, 880, true );
}
add_action( 'after_setup_theme', 'gw_store_setup' );

function gw_store_widgets(): void {
	register_sidebar(
		array(
			'name'          => __( 'Shop filters', 'gw-store' ),
			'id'            => 'shop-filters',
			'before_widget' => '<section class="gw-filter">',
			'after_widget'  => '</section>',
			'before_title'  => '<h3>',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'gw_store_widgets' );

function gw_store_body_classes( array $classes ): array {
	if ( class_exists( 'WooCommerce' ) ) {
		$classes[] = 'gw-has-woocommerce';
	}
	return $classes;
}
add_filter( 'body_class', 'gw_store_body_classes' );

