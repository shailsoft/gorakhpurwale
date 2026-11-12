<?php get_header(); ?>
<main id="main" class="site-main"><div class="gw-shell gw-empty"><p class="gw-eyebrow">404</p><h1><?php esc_html_e( 'This page has moved on.', 'gw-store' ); ?></h1><p><?php esc_html_e( 'Try the shop, search for a tee, or start a custom design.', 'gw-store' ); ?></p><div class="gw-actions"><a class="gw-button" href="<?php echo esc_url( home_url( '/shop/' ) ); ?>"><?php esc_html_e( 'Browse the shop', 'gw-store' ); ?></a></div><?php get_search_form(); ?></div></main>
<?php get_footer(); ?>

