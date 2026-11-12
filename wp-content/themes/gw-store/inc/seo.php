<?php
defined( 'ABSPATH' ) || exit;

function gw_store_meta_description(): void {
	if ( is_admin() || defined( 'WPSEO_VERSION' ) ) {
		return;
	}
	$description = '';
	if ( is_front_page() ) {
		$description = __( 'Shop GW T-shirts and create custom printed tees. Demo catalog for an India-focused WooCommerce store.', 'gw-store' );
	} elseif ( is_singular() ) {
		$description = wp_strip_all_tags( get_the_excerpt() );
	}
	if ( $description ) {
		printf( "\n<meta name=\"description\" content=\"%s\">\n", esc_attr( wp_trim_words( $description, 28, '' ) ) );
	}
}
add_action( 'wp_head', 'gw_store_meta_description', 2 );

function gw_store_robots( array $robots ): array {
	if ( function_exists( 'wp_get_environment_type' ) && 'production' !== wp_get_environment_type() ) {
		$robots['noindex'] = true;
		$robots['nofollow'] = true;
	}
	return $robots;
}
add_filter( 'wp_robots', 'gw_store_robots' );
