<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Order {
	public static function init(): void {
		add_action( 'woocommerce_checkout_create_order_line_item', array( __CLASS__, 'line_item' ), 10, 4 );
		add_action( 'woocommerce_checkout_order_created', array( __CLASS__, 'bind_uploads' ) );
		add_filter( 'wc_order_statuses', array( __CLASS__, 'statuses' ) );
		add_action( 'init', array( __CLASS__, 'register_statuses' ) );
		add_action( 'woocommerce_admin_order_data_after_order_details', array( __CLASS__, 'admin_panel' ) );
	}

	public static function line_item( WC_Order_Item_Product $item, string $cart_item_key, array $values, WC_Order $order ): void {
		if ( empty( $values['gwtd_design'] ) ) {
			return;
		}
		$design = $values['gwtd_design'];
		$item->add_meta_data( '_gwtd_design', wp_json_encode( $design ), true );
		$item->add_meta_data( __( 'Print surface', 'gw-tee-designer' ), ucfirst( $design['surface'] ), true );
		if ( $design['text'] ) {
			$item->add_meta_data( __( 'Custom text', 'gw-tee-designer' ), $design['text'], true );
		}
		if ( ! empty( $design['note'] ) ) {
			$item->add_meta_data( __( 'Print-team note', 'gw-tee-designer' ), $design['note'], true );
		}
		$item->add_meta_data( __( 'Personalization fee', 'gw-tee-designer' ), wc_price( (float) $values['gwtd_fee'] ), true );
	}

	public static function bind_uploads( WC_Order $order ): void {
		$has_design = false;
		foreach ( $order->get_items() as $item ) {
			$design = json_decode( (string) $item->get_meta( '_gwtd_design', true ), true );
			if ( is_array( $design ) ) {
				$has_design = true;
				if ( ! empty( $design['artwork_id'] ) ) {
					GWTD_Upload::bind_to_order( $design['artwork_id'], $order->get_id() );
				}
			}
		}
		if ( $has_design ) {
			$order->add_order_note( __( 'Custom design received. Artwork review is required before production.', 'gw-tee-designer' ) );
			$order->update_meta_data( '_gwtd_pipeline', 'artwork-review' );
			$order->save();
		}
	}

	public static function register_statuses(): void {
		$statuses = array(
			'wc-artwork-review'  => __( 'Artwork review', 'gw-tee-designer' ),
			'wc-customer-action' => __( 'Customer action needed', 'gw-tee-designer' ),
			'wc-printing'        => __( 'Printing', 'gw-tee-designer' ),
			'wc-packed'          => __( 'Packed', 'gw-tee-designer' ),
		);
		foreach ( $statuses as $slug => $label ) {
			register_post_status( $slug, array( 'label' => $label, 'public' => true, 'exclude_from_search' => false, 'show_in_admin_all_list' => true, 'show_in_admin_status_list' => true, 'label_count' => _n_noop( $label . ' <span class="count">(%s)</span>', $label . ' <span class="count">(%s)</span>', 'gw-tee-designer' ) ) );
		}
	}

	public static function statuses( array $statuses ): array {
		$custom = array(
			'wc-artwork-review'  => __( 'Artwork review', 'gw-tee-designer' ),
			'wc-customer-action' => __( 'Customer action needed', 'gw-tee-designer' ),
			'wc-printing'        => __( 'Printing', 'gw-tee-designer' ),
			'wc-packed'          => __( 'Packed', 'gw-tee-designer' ),
		);
		$output = array();
		foreach ( $statuses as $key => $label ) {
			$output[ $key ] = $label;
			if ( 'wc-processing' === $key ) {
				$output += $custom;
			}
		}
		return $output;
	}

	public static function admin_panel( WC_Order $order ): void {
		$rows = array();
		foreach ( $order->get_items() as $item ) {
			$design = json_decode( (string) $item->get_meta( '_gwtd_design', true ), true );
			if ( ! is_array( $design ) ) {
				continue;
			}
			$download = '';
			if ( ! empty( $design['artwork_id'] ) ) {
				$download = rest_url( 'gwtd/v1/download/' . rawurlencode( $design['artwork_id'] ) );
			}
			$rows[] = '<tr><td>' . esc_html( $item->get_name() ) . '</td><td><code>' . esc_html( wp_json_encode( $design, JSON_PRETTY_PRINT ) ) . '</code></td><td>' . ( $download ? '<a class="button" href="' . esc_url( $download ) . '">' . esc_html__( 'Secure download', 'gw-tee-designer' ) . '</a>' : esc_html__( 'Text only', 'gw-tee-designer' ) ) . '</td></tr>';
		}
		if ( ! $rows ) {
			return;
		}
		echo '<div class="order_data_column_container"><h3>' . esc_html__( 'GW print production details', 'gw-tee-designer' ) . '</h3><table class="widefat striped"><thead><tr><th>' . esc_html__( 'Item', 'gw-tee-designer' ) . '</th><th>' . esc_html__( 'Validated design state', 'gw-tee-designer' ) . '</th><th>' . esc_html__( 'Artwork', 'gw-tee-designer' ) . '</th></tr></thead><tbody>' . wp_kses_post( implode( '', $rows ) ) . '</tbody></table></div>';
	}
}
