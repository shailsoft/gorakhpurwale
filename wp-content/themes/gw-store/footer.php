<?php defined( 'ABSPATH' ) || exit; ?>
<footer class="site-footer">
	<div class="gw-shell gw-footer-grid">
		<div><img class="gw-footer-logo" src="<?php echo esc_url( GW_STORE_URI . '/assets/images/gw-logo.svg' ); ?>" alt="GW" width="96" height="40"><p><?php esc_html_e( 'Original tees and thoughtful custom printing, built for everyday India.', 'gw-store' ); ?></p></div>
		<div><h2><?php esc_html_e( 'Customer care', 'gw-store' ); ?></h2><?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'fallback_cb' => false ) ); ?></div>
		<div><h2><?php esc_html_e( 'Need help?', 'gw-store' ); ?></h2><p><?php $email = get_theme_mod( 'gw_support_email', '' ); echo $email ? '<a href="mailto:' . esc_attr( antispambot( $email ) ) . '">' . esc_html( antispambot( $email ) ) . '</a>' : esc_html__( 'Add verified support details in the Customizer before launch.', 'gw-store' ); ?></p></div>
	</div>
	<div class="gw-shell gw-footer-bottom"><span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> GW</span><span><?php esc_html_e( 'Prices and policies shown in demo mode are illustrative.', 'gw-store' ); ?></span></div>
</footer>
<?php wp_footer(); ?>
</body></html>
