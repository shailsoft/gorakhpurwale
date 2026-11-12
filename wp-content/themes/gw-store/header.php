<?php defined( 'ABSPATH' ) || exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'gw-store' ); ?></a>
<div class="gw-announcement"><?php echo esc_html( get_theme_mod( 'gw_announcement', __( 'Demo store — shipping and offers are configured at checkout.', 'gw-store' ) ) ); ?></div>
<header class="site-header">
	<div class="gw-shell gw-header-inner">
		<a class="gw-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'GW home', 'gw-store' ); ?>">
			<img src="<?php echo esc_url( GW_STORE_URI . '/assets/images/gw-logo.svg' ); ?>" alt="GW" width="104" height="42">
		</a>
		<button class="gw-menu-toggle" type="button" aria-expanded="false" aria-controls="gw-primary-menu"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Menu', 'gw-store' ); ?></span></button>
		<nav id="gw-primary-menu" class="gw-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'gw-store' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'fallback_cb'    => 'gw_store_fallback_menu',
				)
			);
			?>
		</nav>
		<div class="gw-header-actions">
			<button class="gw-search-toggle" type="button" aria-expanded="false" aria-controls="gw-header-search"><span aria-hidden="true">⌕</span><span class="screen-reader-text"><?php esc_html_e( 'Search', 'gw-store' ); ?></span></button>
			<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() ); ?>" aria-label="<?php esc_attr_e( 'My account', 'gw-store' ); ?>">♙</a>
			<a class="gw-cart-link" href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '#' ); ?>" aria-label="<?php esc_attr_e( 'Cart', 'gw-store' ); ?>">🛒<span class="gw-cart-count"><?php echo esc_html( function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span></a>
		</div>
	</div>
	<div id="gw-header-search" class="gw-header-search" hidden><div class="gw-shell"><?php get_search_form(); ?></div></div>
</header>
<?php
function gw_store_fallback_menu(): void {
	$links = array(
		__( 'T-Shirts', 'gw-store' )      => home_url( '/product-category/t-shirts/' ),
		__( 'Oversized', 'gw-store' )     => home_url( '/product-category/oversized-t-shirts/' ),
		__( 'Graphic Tees', 'gw-store' )  => home_url( '/product-category/graphic-t-shirts/' ),
		__( 'Custom Print', 'gw-store' )  => home_url( '/custom-t-shirts/' ),
	);
	echo '<ul class="menu">';
	foreach ( $links as $label => $url ) {
		printf( '<li><a href="%s">%s</a></li>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</ul>';
}
