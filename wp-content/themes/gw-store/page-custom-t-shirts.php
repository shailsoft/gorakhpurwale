<?php
/** Template Name: Custom T-Shirts */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="site-main gw-custom-page">
	<header class="gw-page-hero"><div class="gw-shell"><p class="gw-eyebrow"><?php esc_html_e( 'Create with GW', 'gw-store' ); ?></p><h1><?php esc_html_e( 'Your tee, down to the last detail.', 'gw-store' ); ?></h1><p><?php esc_html_e( 'Preview text or artwork inside a defined print area. Final pricing is always checked on the server before the item enters your cart.', 'gw-store' ); ?></p></div></header>
	<div class="gw-shell gw-content">
		<?php while ( have_posts() ) : the_post(); the_content(); endwhile; ?>
		<?php if ( shortcode_exists( 'gw_tee_designer' ) ) { echo do_shortcode( '[gw_tee_designer]' ); } else { echo '<div class="woocommerce-info">' . esc_html__( 'Activate the GW Tee Designer plugin to use the customizer.', 'gw-store' ) . '</div>'; } ?>
	</div>
</main>
<?php get_footer(); ?>

