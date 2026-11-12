<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Settings {
	public static function init(): void {
		add_filter( 'woocommerce_get_sections_products', array( __CLASS__, 'section' ) );
		add_filter( 'woocommerce_get_settings_products', array( __CLASS__, 'settings' ), 10, 2 );
		add_action( 'woocommerce_product_options_general_product_data', array( __CLASS__, 'product_fields' ) );
		add_action( 'woocommerce_process_product_meta', array( __CLASS__, 'save_product_fields' ) );
	}

	public static function section( array $sections ): array {
		$sections['gw_tee_designer'] = __( 'GW Tee Designer', 'gw-tee-designer' );
		return $sections;
	}

	public static function settings( array $settings, string $section ): array {
		if ( 'gw_tee_designer' !== $section ) {
			return $settings;
		}
		return array(
			array( 'title' => __( 'GW Tee Designer', 'gw-tee-designer' ), 'type' => 'title', 'desc' => __( 'Upload printing stays disabled until protected storage, retention and fulfillment are verified.', 'gw-tee-designer' ), 'id' => 'gwtd_options' ),
			array( 'title' => __( 'Text personalization', 'gw-tee-designer' ), 'id' => 'gwtd_text_enabled', 'type' => 'checkbox', 'default' => 'yes' ),
			array( 'title' => __( 'Artwork uploads', 'gw-tee-designer' ), 'desc' => __( 'Enable only after the Phase 0/3 storage gate passes.', 'gw-tee-designer' ), 'id' => 'gwtd_upload_enabled', 'type' => 'checkbox', 'default' => 'no' ),
			array( 'title' => __( 'Disable COD for custom items', 'gw-tee-designer' ), 'desc' => __( 'Use only when the approved custom-order policy requires prepayment.', 'gw-tee-designer' ), 'id' => 'gwtd_disable_cod', 'type' => 'checkbox', 'default' => 'no' ),
			array( 'title' => __( 'Front print fee', 'gw-tee-designer' ), 'id' => 'gwtd_front_fee', 'type' => 'price', 'default' => '149', 'css' => 'width:100px' ),
			array( 'title' => __( 'Back print fee', 'gw-tee-designer' ), 'id' => 'gwtd_back_fee', 'type' => 'price', 'default' => '199', 'css' => 'width:100px' ),
			array( 'title' => __( 'Artwork handling fee', 'gw-tee-designer' ), 'id' => 'gwtd_artwork_fee', 'type' => 'price', 'default' => '50', 'css' => 'width:100px' ),
			array( 'title' => __( 'Maximum upload size (MB)', 'gw-tee-designer' ), 'id' => 'gwtd_max_upload_mb', 'type' => 'number', 'default' => '8', 'custom_attributes' => array( 'min' => 1, 'max' => 20 ) ),
			array( 'title' => __( 'Temporary retention (hours)', 'gw-tee-designer' ), 'id' => 'gwtd_retention_hours', 'type' => 'number', 'default' => '48', 'custom_attributes' => array( 'min' => 6, 'max' => 168 ) ),
			array( 'title' => __( 'Low-resolution warning threshold', 'gw-tee-designer' ), 'desc' => __( 'Minimum pixels on the shortest edge.', 'gw-tee-designer' ), 'id' => 'gwtd_min_pixels', 'type' => 'number', 'default' => '1200', 'custom_attributes' => array( 'min' => 300, 'max' => 6000 ) ),
			array( 'type' => 'sectionend', 'id' => 'gwtd_options' ),
		);
	}

	public static function product_fields(): void {
		echo '<div class="options_group">';
		woocommerce_wp_checkbox( array( 'id' => '_gw_designer_enabled', 'label' => __( 'Enable tee designer', 'gw-tee-designer' ), 'description' => __( 'Show personalization controls for this product.', 'gw-tee-designer' ) ) );
		woocommerce_wp_checkbox( array( 'id' => '_gw_back_print_enabled', 'label' => __( 'Allow back print', 'gw-tee-designer' ) ) );
		echo '</div>';
	}

	public static function save_product_fields( int $product_id ): void {
		update_post_meta( $product_id, '_gw_designer_enabled', isset( $_POST['_gw_designer_enabled'] ) ? 'yes' : 'no' );
		update_post_meta( $product_id, '_gw_back_print_enabled', isset( $_POST['_gw_back_print_enabled'] ) ? 'yes' : 'no' );
	}

	public static function fee( string $surface, bool $has_artwork = false ): float {
		$fee = 'back' === $surface ? (float) get_option( 'gwtd_back_fee', 199 ) : (float) get_option( 'gwtd_front_fee', 149 );
		if ( $has_artwork ) {
			$fee += (float) get_option( 'gwtd_artwork_fee', 50 );
		}
		return max( 0, $fee );
	}
}
