<?php
/**
 * GW Store theme bootstrap.
 *
 * @package GW_Store
 */

defined( 'ABSPATH' ) || exit;

define( 'GW_STORE_VERSION', '1.0.0' );
define( 'GW_STORE_DIR', get_template_directory() );
define( 'GW_STORE_URI', get_template_directory_uri() );

require_once GW_STORE_DIR . '/inc/setup.php';
require_once GW_STORE_DIR . '/inc/assets.php';
require_once GW_STORE_DIR . '/inc/woocommerce.php';
require_once GW_STORE_DIR . '/inc/admin-settings.php';
require_once GW_STORE_DIR . '/inc/seo.php';
require_once GW_STORE_DIR . '/inc/demo-catalog.php';

