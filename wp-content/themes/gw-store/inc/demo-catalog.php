<?php
/**
 * Explicit WP-CLI demo setup. Never runs automatically.
 *
 * @package GW_Store
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	return;
}

/**
 * Seed the clearly labelled demonstration catalog and required pages.
 */
function gw_store_seed_demo(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		WP_CLI::error( 'WooCommerce must be active.' );
	}

	update_option( 'woocommerce_currency', 'INR' );
	update_option( 'woocommerce_default_country', 'IN:UP' );
	update_option( 'woocommerce_calc_taxes', 'no' ); // Tax must remain off until registration/rates are confirmed.
	update_option( 'woocommerce_enable_guest_checkout', 'yes' );

	$pages = array(
		'custom-t-shirts' => array( 'Custom T-Shirts', 'page-custom-t-shirts.php', '<p>This demonstration page uses the GW Tee Designer. Product availability and print options are illustrative until approved by the store operator.</p>' ),
		'about' => array( 'About GW', '', '<p>GW is a demonstration storefront for focused T-shirt collections and custom printing. Replace this copy with the verified business story before launch.</p>' ),
		'contact' => array( 'Contact', '', '<p>Add the verified support email, phone and address before launch.</p>' ),
		'faq' => array( 'FAQ', '', '<h2>When will my order arrive?</h2><p>Delivery estimates will be displayed after shipping zones and carrier service levels are approved.</p><h2>Can I return a custom product?</h2><p>Custom-order terms must be reviewed and accepted before checkout.</p>' ),
		'size-guide' => array( 'Size Guide', '', '<table><thead><tr><th>Size</th><th>Chest</th><th>Length</th></tr></thead><tbody><tr><td>S</td><td>Supplier measurement required</td><td>Supplier measurement required</td></tr><tr><td>M–XXL</td><td colspan="2">Confirm the production size chart before launch.</td></tr></tbody></table>' ),
		'shipping-delivery' => array( 'Shipping & Delivery', '', '<p>Shipping charges, serviceable pincodes and delivery estimates are configurable and must be confirmed before production.</p>' ),
		'returns-refunds' => array( 'Returns & Refunds', '', '<p>This draft does not replace an operator-approved policy. State eligible products, timelines, evidence requirements and refund method before launch.</p>' ),
		'cancellation-custom-orders' => array( 'Cancellation & Custom Order Policy', '', '<p>Custom items may enter artwork review before production. Define cancellation cut-offs and remedies in accordance with applicable law.</p>' ),
		'privacy' => array( 'Privacy', '', '<p>Document customer data, artwork retention, processors, contact details and deletion requests before launch.</p>' ),
		'terms' => array( 'Terms', '', '<p>Add reviewed store terms and legal operator identity before launch.</p>' ),
		'custom-printing-guidelines' => array( 'Custom Printing Guidelines', '', '<p>Upload only artwork you have permission to reproduce. Low-resolution files may not print cleanly. The print team may request a replacement file.</p>' ),
		'bulk-orders' => array( 'Bulk Orders', '', '<p>For team or event printing, add a consent-aware enquiry form and verified contact route.</p>' ),
	);

	foreach ( $pages as $slug => $data ) {
		$existing = get_page_by_path( $slug );
		$page_id  = $existing ? $existing->ID : wp_insert_post( array( 'post_title' => $data[0], 'post_name' => $slug, 'post_content' => $data[2], 'post_status' => 'publish', 'post_type' => 'page' ) );
		if ( $page_id && $data[1] ) {
			update_post_meta( $page_id, '_wp_page_template', $data[1] );
		}
	}
	$checkout_id = wc_get_page_id( 'checkout' );
	$cart_id     = wc_get_page_id( 'cart' );
	if ( $checkout_id > 0 ) {
		wp_update_post( array( 'ID' => $checkout_id, 'post_content' => '[woocommerce_checkout]' ) );
	}
	if ( $cart_id > 0 ) {
		wp_update_post( array( 'ID' => $cart_id, 'post_content' => '[woocommerce_cart]' ) );
	}

	$categories = array(
		't-shirts'             => 'T-Shirts',
		'oversized-t-shirts'   => 'Oversized T-Shirts',
		'graphic-t-shirts'     => 'Graphic T-Shirts',
		'customized-t-shirts'  => 'Customized T-Shirts',
	);
	$term_ids = array();
	foreach ( $categories as $slug => $name ) {
		$term = term_exists( $slug, 'product_cat' );
		if ( ! $term ) {
			$term = wp_insert_term( $name, 'product_cat', array( 'slug' => $slug, 'description' => 'Demonstration category; replace copy and catalog before launch.' ) );
		}
		$term_ids[ $slug ] = is_array( $term ) ? (int) $term['term_id'] : (int) $term;
	}

	gw_store_create_attribute( 'size', 'Size', array( 'S', 'M', 'L', 'XL', 'XXL' ) );
	gw_store_create_attribute( 'color', 'Color', array( 'Midnight', 'Off White', 'Coral', 'Sage', 'Sky' ) );
	gw_store_create_attribute( 'fit', 'Fit', array( 'Regular', 'Oversized' ) );
	gw_store_create_attribute( 'fabric', 'Fabric', array( 'Cotton Demo', 'Heavy Cotton Demo' ) );
	gw_store_create_attribute( 'print-style', 'Print Style', array( 'Solid', 'Graphic', 'Custom Print' ) );

	$products = array(
		array( 'Everyday Midnight Tee', 349, 't-shirts', 'Midnight', 'Regular', 'Solid' ),
		array( 'Everyday Off-White Tee', 349, 't-shirts', 'Off White', 'Regular', 'Solid' ),
		array( 'Everyday Sage Tee', 379, 't-shirts', 'Sage', 'Regular', 'Solid' ),
		array( 'Coral Weekend Tee', 379, 't-shirts', 'Coral', 'Regular', 'Solid' ),
		array( 'After Hours Oversized Tee', 499, 'oversized-t-shirts', 'Midnight', 'Oversized', 'Solid' ),
		array( 'Cloud Oversized Tee', 499, 'oversized-t-shirts', 'Off White', 'Oversized', 'Solid' ),
		array( 'Sage Studio Oversized Tee', 529, 'oversized-t-shirts', 'Sage', 'Oversized', 'Solid' ),
		array( 'Orbit Graphic Tee', 449, 'graphic-t-shirts', 'Midnight', 'Regular', 'Graphic' ),
		array( 'Dawn Lines Graphic Tee', 449, 'graphic-t-shirts', 'Coral', 'Regular', 'Graphic' ),
		array( 'Trail Graphic Tee', 469, 'graphic-t-shirts', 'Off White', 'Regular', 'Graphic' ),
		array( 'Custom Text Tee', 349, 'customized-t-shirts', 'Off White', 'Regular', 'Custom Print' ),
		array( 'Custom Artwork Tee', 399, 'customized-t-shirts', 'Midnight', 'Regular', 'Custom Print' ),
	);

	$image_id = gw_store_import_demo_image();
	foreach ( $products as $index => $data ) {
		$slug = sanitize_title( $data[0] );
		if ( get_page_by_path( $slug, OBJECT, 'product' ) ) {
			continue;
		}
		$product = new WC_Product_Variable();
		$product->set_name( '[DEMO] ' . $data[0] );
		$product->set_slug( $slug );
		$product->set_status( 'publish' );
		$product->set_catalog_visibility( 'visible' );
		$product->set_description( 'Demonstration product only. Confirm fabric, measurements, wash care, stock, imagery, tax and fulfillment details before launch.' );
		$product->set_short_description( 'Illustrative GW T-shirt. Pricing and specifications are not a live offer.' );
		$product->set_category_ids( array( $term_ids[ $data[2] ] ) );
		$product->set_sku( 'GW-DEMO-' . str_pad( (string) ( $index + 1 ), 3, '0', STR_PAD_LEFT ) );
		$product->set_manage_stock( false );
		$product->set_featured( $index < 4 );
		if ( $image_id ) {
			$product->set_image_id( $image_id );
		}
		$attributes = array();
		foreach ( array( 'pa_size' => array( 'S', 'M', 'L', 'XL', 'XXL' ), 'pa_color' => array( $data[3] ), 'pa_fit' => array( $data[4] ), 'pa_print-style' => array( $data[5] ) ) as $taxonomy => $options ) {
			$attribute = new WC_Product_Attribute();
			$attribute->set_id( wc_attribute_taxonomy_id_by_name( $taxonomy ) );
			$attribute->set_name( $taxonomy );
			$attribute->set_options( array_map( fn( $value ) => get_term_by( 'name', $value, $taxonomy )->term_id, $options ) );
			$attribute->set_visible( true );
			$attribute->set_variation( 'pa_size' === $taxonomy );
			$attributes[] = $attribute;
		}
		$product->set_attributes( $attributes );
		$product_id = $product->save();
		foreach ( array( 's', 'm', 'l', 'xl', 'xxl' ) as $size ) {
			$variation = new WC_Product_Variation();
			$variation->set_parent_id( $product_id );
			$variation->set_attributes( array( 'pa_size' => $size ) );
			$variation->set_regular_price( (string) $data[1] );
			$variation->set_stock_status( 'instock' );
			$variation->save();
		}
		if ( 'customized-t-shirts' === $data[2] ) {
			update_post_meta( $product_id, '_gw_designer_enabled', 'yes' );
		}
	}
	gw_store_seed_menus();
	flush_rewrite_rules();
	WP_CLI::success( 'Demo pages, menus and 12 clearly marked products created. Classic cart/checkout are used for policy hooks. Tax remains disabled pending verification.' );
}

function gw_store_seed_menus(): void {
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	$menus = array(
		'primary' => array( 'T-Shirts' => '/product-category/t-shirts/', 'Oversized' => '/product-category/oversized-t-shirts/', 'Graphic Tees' => '/product-category/graphic-t-shirts/', 'Custom Print' => '/custom-t-shirts/' ),
		'footer'  => array( 'Size Guide' => '/size-guide/', 'Shipping & Delivery' => '/shipping-delivery/', 'Returns & Refunds' => '/returns-refunds/', 'Privacy' => '/privacy/', 'Terms' => '/terms/' ),
	);
	foreach ( $menus as $location => $items ) {
		$menu = wp_get_nav_menu_object( 'GW ' . ucfirst( $location ) );
		$created = $menu ? (int) $menu->term_id : wp_create_nav_menu( 'GW ' . ucfirst( $location ) );
		if ( is_wp_error( $created ) ) {
			WP_CLI::warning( 'Could not create the ' . $location . ' menu: ' . $created->get_error_message() );
			continue;
		}
		$menu_id = (int) $created;
		if ( ! wp_get_nav_menu_items( $menu_id ) ) {
			foreach ( $items as $title => $path ) {
				wp_update_nav_menu_item( $menu_id, 0, array( 'menu-item-title' => $title, 'menu-item-url' => home_url( $path ), 'menu-item-status' => 'publish' ) );
			}
		}
		$locations[ $location ] = $menu_id;
	}
	set_theme_mod( 'nav_menu_locations', $locations );
}

function gw_store_create_attribute( string $slug, string $label, array $terms ): void {
	if ( ! wc_attribute_taxonomy_id_by_name( $slug ) ) {
		wc_create_attribute( array( 'name' => $label, 'slug' => $slug, 'type' => 'select', 'order_by' => 'menu_order', 'has_archives' => true ) );
		delete_transient( 'wc_attribute_taxonomies' );
	}
	$taxonomy = 'pa_' . $slug;
	if ( ! taxonomy_exists( $taxonomy ) ) {
		register_taxonomy( $taxonomy, 'product', array( 'hierarchical' => false, 'show_ui' => false ) );
	}
	foreach ( $terms as $term ) {
		if ( ! term_exists( $term, $taxonomy ) ) {
			wp_insert_term( $term, $taxonomy );
		}
	}
}

function gw_store_import_demo_image(): int {
	$existing = get_page_by_title( 'GW demonstration apparel', OBJECT, 'attachment' );
	if ( $existing ) {
		return (int) $existing->ID;
	}
	$source = GW_STORE_DIR . '/assets/images/gw-hero.png';
	$upload = wp_upload_bits( 'gw-demonstration-apparel.png', null, file_get_contents( $source ) );
	if ( ! empty( $upload['error'] ) ) {
		return 0;
	}
	$attachment_id = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => 'GW demonstration apparel', 'post_status' => 'inherit' ), $upload['file'] );
	if ( $attachment_id ) {
		require_once ABSPATH . 'wp-admin/includes/image.php';
		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );
	}
	return (int) $attachment_id;
}

WP_CLI::add_command( 'gw seed-demo', 'gw_store_seed_demo' );
