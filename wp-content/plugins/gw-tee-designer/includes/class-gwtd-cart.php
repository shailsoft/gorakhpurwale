<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Cart {
	private const FONTS = array( 'system', 'serif', 'rounded', 'mono' );

	public static function init(): void {
		add_filter( 'woocommerce_add_to_cart_validation', array( __CLASS__, 'validate' ), 10, 5 );
		add_filter( 'woocommerce_add_cart_item_data', array( __CLASS__, 'item_data' ), 10, 3 );
		add_action( 'woocommerce_before_calculate_totals', array( __CLASS__, 'price' ) );
		add_filter( 'woocommerce_get_item_data', array( __CLASS__, 'display_data' ), 10, 2 );
		add_action( 'woocommerce_review_order_before_submit', array( __CLASS__, 'policy_checkbox' ) );
		add_action( 'woocommerce_checkout_process', array( __CLASS__, 'validate_policy' ) );
		add_filter( 'woocommerce_available_payment_gateways', array( __CLASS__, 'payment_gateways' ) );
	}

	public static function validate( bool $passed, int $product_id, int $quantity, int $variation_id = 0, array $variations = array() ): bool {
		$target_id = $variation_id ?: $product_id;
		$parent_id = $variation_id ? wp_get_post_parent_id( $variation_id ) : $product_id;
		if ( 'yes' !== get_post_meta( $parent_id ?: $target_id, '_gw_designer_enabled', true ) ) {
			return $passed;
		}
		if ( empty( $_POST['gwtd_design'] ) ) {
			wc_add_notice( __( 'Create and confirm your design before adding this product.', 'gw-tee-designer' ), 'error' );
			return false;
		}
		$design = self::sanitize_design( wp_unslash( $_POST['gwtd_design'] ), $parent_id ?: $target_id );
		if ( is_wp_error( $design ) ) {
			wc_add_notice( $design->get_error_message(), 'error' );
			return false;
		}
		return $passed;
	}

	public static function item_data( array $cart_item, int $product_id, int $variation_id ): array {
		$parent_id = $variation_id ? $product_id : $product_id;
		if ( empty( $_POST['gwtd_design'] ) || 'yes' !== get_post_meta( $parent_id, '_gw_designer_enabled', true ) ) {
			return $cart_item;
		}
		$design = self::sanitize_design( wp_unslash( $_POST['gwtd_design'] ), $parent_id );
		if ( is_wp_error( $design ) ) {
			return $cart_item;
		}
		$product = wc_get_product( $variation_id ?: $product_id );
		$has_artwork = ! empty( $design['artwork_id'] );
		$cart_item['gwtd_design']     = $design;
		$cart_item['gwtd_fee']        = GWTD_Settings::fee( $design['surface'], $has_artwork );
		$cart_item['gwtd_base_price'] = $product ? (float) $product->get_price( 'edit' ) : 0;
		$cart_item['gwtd_key']        = hash( 'sha256', wp_json_encode( $design ) . wp_generate_uuid4() );
		return $cart_item;
	}

	public static function price( WC_Cart $cart ): void {
		if ( is_admin() && ! wp_doing_ajax() ) {
			return;
		}
		foreach ( $cart->get_cart() as $item ) {
			if ( isset( $item['gwtd_design'], $item['gwtd_base_price'], $item['gwtd_fee'] ) && $item['data'] instanceof WC_Product ) {
				$item['data']->set_price( max( 0, (float) $item['gwtd_base_price'] + (float) $item['gwtd_fee'] ) );
			}
		}
	}

	public static function display_data( array $data, array $cart_item ): array {
		if ( empty( $cart_item['gwtd_design'] ) ) {
			return $data;
		}
		$design = $cart_item['gwtd_design'];
		$data[] = array( 'key' => __( 'Print surface', 'gw-tee-designer' ), 'value' => ucfirst( $design['surface'] ) );
		if ( $design['text'] ) {
			$data[] = array( 'key' => __( 'Custom text', 'gw-tee-designer' ), 'value' => $design['text'] );
			$data[] = array( 'key' => __( 'Text style', 'gw-tee-designer' ), 'value' => sprintf( '%s · %s · %dpx', ucfirst( $design['font'] ), $design['color'], $design['font_size'] ) );
		}
		if ( ! empty( $design['artwork_id'] ) ) {
			$data[] = array( 'key' => __( 'Artwork', 'gw-tee-designer' ), 'value' => $design['artwork_name'] );
		}
		if ( ! empty( $design['note'] ) ) {
			$data[] = array( 'key' => __( 'Print-team note', 'gw-tee-designer' ), 'value' => $design['note'] );
		}
		$data[] = array( 'key' => __( 'Print fee', 'gw-tee-designer' ), 'value' => wc_price( (float) $cart_item['gwtd_fee'] ) );
		return $data;
	}

	public static function policy_checkbox(): void {
		if ( ! self::cart_has_design() ) {
			return;
		}
		woocommerce_form_field( 'gwtd_policy_accepted', array( 'type' => 'checkbox', 'required' => true, 'class' => array( 'form-row', 'validate-required' ), 'label' => __( 'I confirm that I have the right to reproduce this design and understand that customized items follow the custom-order policy.', 'gw-tee-designer' ) ), isset( $_POST['gwtd_policy_accepted'] ) );
	}

	public static function validate_policy(): void {
		if ( self::cart_has_design() && empty( $_POST['gwtd_policy_accepted'] ) ) {
			wc_add_notice( __( 'Please accept the custom-order policy to continue.', 'gw-tee-designer' ), 'error' );
		}
	}

	public static function payment_gateways( array $gateways ): array {
		if ( 'yes' === get_option( 'gwtd_disable_cod', 'no' ) && self::cart_has_design() ) {
			unset( $gateways['cod'] );
		}
		return $gateways;
	}

	private static function cart_has_design(): bool {
		if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
			return false;
		}
		foreach ( WC()->cart->get_cart() as $item ) {
			if ( ! empty( $item['gwtd_design'] ) ) {
				return true;
			}
		}
		return false;
	}

	public static function sanitize_design( string $json, int $product_id ) {
		$raw = json_decode( $json, true );
		if ( ! is_array( $raw ) ) {
			return new WP_Error( 'gwtd_json', __( 'The design data is invalid.', 'gw-tee-designer' ) );
		}
		$surface = isset( $raw['surface'] ) && 'back' === $raw['surface'] ? 'back' : 'front';
		if ( 'back' === $surface && 'yes' !== get_post_meta( $product_id, '_gw_back_print_enabled', true ) ) {
			return new WP_Error( 'gwtd_surface', __( 'Back printing is unavailable for this product.', 'gw-tee-designer' ) );
		}
		$text = isset( $raw['text'] ) ? sanitize_text_field( $raw['text'] ) : '';
		$text = function_exists( 'mb_substr' ) ? mb_substr( $text, 0, 80 ) : substr( $text, 0, 80 );
		$note = isset( $raw['note'] ) ? sanitize_textarea_field( $raw['note'] ) : '';
		$note = function_exists( 'mb_substr' ) ? mb_substr( $note, 0, 200 ) : substr( $note, 0, 200 );
		if ( $text && 'yes' !== get_option( 'gwtd_text_enabled', 'yes' ) ) {
			return new WP_Error( 'gwtd_text_disabled', __( 'Text personalization is unavailable.', 'gw-tee-designer' ) );
		}
		$artwork_id = isset( $raw['artwork_id'] ) ? sanitize_text_field( $raw['artwork_id'] ) : '';
		$artwork = null;
		if ( $artwork_id ) {
			if ( 'yes' !== get_option( 'gwtd_upload_enabled', 'no' ) || ! GWTD_Upload::verify_session( $artwork_id ) ) {
				return new WP_Error( 'gwtd_artwork', __( 'The artwork reference is not valid for this session.', 'gw-tee-designer' ) );
			}
			$artwork = GWTD_Upload::record( $artwork_id );
		}
		if ( '' === $text && ! $artwork ) {
			return new WP_Error( 'gwtd_empty', __( 'Add text or approved artwork to your design.', 'gw-tee-designer' ) );
		}
		$font = isset( $raw['font'] ) && in_array( $raw['font'], self::FONTS, true ) ? $raw['font'] : 'system';
		$color = isset( $raw['color'] ) && preg_match( '/^#[0-9a-fA-F]{6}$/', $raw['color'] ) ? strtolower( $raw['color'] ) : '#101522';
		$alignment = isset( $raw['alignment'] ) && in_array( $raw['alignment'], array( 'left', 'center', 'right' ), true ) ? $raw['alignment'] : 'center';
		$clean = array(
			'version'      => 1,
			'surface'      => $surface,
			'text'         => $text,
			'note'         => $note,
			'font'         => $font,
			'font_size'    => min( 72, max( 14, absint( $raw['font_size'] ?? 38 ) ) ),
			'bold'         => ! empty( $raw['bold'] ),
			'color'        => $color,
			'alignment'    => $alignment,
			'x'            => min( 90, max( 10, (float) ( $raw['x'] ?? 50 ) ) ),
			'y'            => min( 90, max( 10, (float) ( $raw['y'] ?? 42 ) ) ),
			'scale'        => min( 1.8, max( .4, (float) ( $raw['scale'] ?? 1 ) ) ),
			'rotation'     => min( 35, max( -35, (float) ( $raw['rotation'] ?? 0 ) ) ),
			'artwork_id'   => $artwork_id,
			'artwork_name' => $artwork ? $artwork['name'] : '',
			'low_res_ack'  => ! empty( $raw['low_res_ack'] ),
		);
		if ( $artwork && min( (int) $artwork['width'], (int) $artwork['height'] ) < (int) get_option( 'gwtd_min_pixels', 1200 ) && ! $clean['low_res_ack'] ) {
			return new WP_Error( 'gwtd_low_res', __( 'Confirm the low-resolution artwork warning before adding to cart.', 'gw-tee-designer' ) );
		}
		$clean['preview_ref'] = 'gwp_' . hash_hmac( 'sha256', wp_json_encode( $clean ) . '|' . wp_generate_uuid4() . '|' . $product_id, wp_salt( 'secure_auth' ) );
		return $clean;
	}
}
