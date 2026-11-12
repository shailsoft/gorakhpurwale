<?php
defined( 'ABSPATH' ) || exit;

function gw_store_woocommerce_setup(): void {
	remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
	remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
}
add_action( 'after_setup_theme', 'gw_store_woocommerce_setup', 20 );

function gw_store_wc_before(): void {
	echo '<main id="main" class="site-main gw-shop"><div class="gw-shell">';
	if ( is_shop() || is_product_taxonomy() ) {
		echo '<button class="gw-filter-toggle" type="button" aria-expanded="false" aria-controls="gw-shop-filters">' . esc_html__( 'Filters', 'gw-store' ) . '</button>';
		echo '<aside id="gw-shop-filters" class="gw-shop-filters" aria-label="' . esc_attr__( 'Product filters', 'gw-store' ) . '">';
		if ( is_active_sidebar( 'shop-filters' ) ) {
			dynamic_sidebar( 'shop-filters' );
		} else {
			echo '<p>' . esc_html__( 'Add WooCommerce filter blocks here in Appearance → Widgets.', 'gw-store' ) . '</p>';
		}
		echo '</aside><div class="gw-shop-results">';
	}
}
add_action( 'woocommerce_before_main_content', 'gw_store_wc_before', 10 );

function gw_store_wc_after(): void {
	if ( is_shop() || is_product_taxonomy() ) {
		echo '</div>';
	}
	echo '</div></main>';
}
add_action( 'woocommerce_after_main_content', 'gw_store_wc_after', 10 );

function gw_store_loop_badge(): void {
	global $product;
	if ( $product && $product->is_featured() ) {
		echo '<span class="gw-product-kicker">' . esc_html__( 'GW pick', 'gw-store' ) . '</span>';
	}
}
add_action( 'woocommerce_before_shop_loop_item_title', 'gw_store_loop_badge', 8 );

function gw_store_cart_count_fragment( array $fragments ): array {
	$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
	$fragments['.gw-cart-count'] = '<span class="gw-cart-count" aria-label="' . esc_attr( sprintf( _n( '%d item in cart', '%d items in cart', $count, 'gw-store' ), $count ) ) . '">' . esc_html( $count ) . '</span>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'gw_store_cart_count_fragment' );

function gw_store_empty_search_message(): void {
	if ( is_search() && ! have_posts() ) {
		echo '<div class="gw-empty"><h2>' . esc_html__( 'Nothing matched that search.', 'gw-store' ) . '</h2><p>' . esc_html__( 'Try a simpler phrase, browse T-shirts, or explore custom printing.', 'gw-store' ) . '</p></div>';
	}
}
add_action( 'woocommerce_no_products_found', 'gw_store_empty_search_message' );

