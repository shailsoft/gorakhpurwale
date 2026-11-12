<?php
/**
 * Plugin Name: GW Tee Designer
 * Description: Secure WooCommerce text and artwork personalization with server-authoritative pricing.
 * Version: 1.0.0
 * Requires at least: 7.0
 * Requires PHP: 8.1
 * WC requires at least: 9.0
 * WC tested up to: 11.2.2
 * Text Domain: gw-tee-designer
 * License: GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

define( 'GWTD_VERSION', '1.0.0' );
define( 'GWTD_FILE', __FILE__ );
define( 'GWTD_DIR', plugin_dir_path( __FILE__ ) );
define( 'GWTD_URL', plugin_dir_url( __FILE__ ) );

require_once GWTD_DIR . 'includes/class-gwtd-settings.php';
require_once GWTD_DIR . 'includes/class-gwtd-upload.php';
require_once GWTD_DIR . 'includes/class-gwtd-cart.php';
require_once GWTD_DIR . 'includes/class-gwtd-order.php';
require_once GWTD_DIR . 'includes/class-gwtd-frontend.php';
require_once GWTD_DIR . 'includes/class-gwtd-health.php';

function gwtd_boot(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', static function (): void { echo '<div class="notice notice-error"><p>' . esc_html__( 'GW Tee Designer requires WooCommerce.', 'gw-tee-designer' ) . '</p></div>'; } );
		return;
	}
	GWTD_Settings::init();
	GWTD_Upload::init();
	GWTD_Cart::init();
	GWTD_Order::init();
	GWTD_Frontend::init();
	GWTD_Health::init();
}
add_action( 'plugins_loaded', 'gwtd_boot', 20 );

add_action( 'before_woocommerce_init', static function (): void {
	if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );

register_activation_hook( __FILE__, array( 'GWTD_Upload', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'GWTD_Upload', 'deactivate' ) );
