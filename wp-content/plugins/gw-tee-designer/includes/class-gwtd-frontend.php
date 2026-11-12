<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Frontend {
	private static int $instances = 0;

	public static function init(): void {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'assets' ) );
		add_action( 'woocommerce_before_add_to_cart_button', array( __CLASS__, 'product_designer' ), 8 );
		add_shortcode( 'gw_tee_designer', array( __CLASS__, 'shortcode' ) );
	}

	public static function assets(): void {
		wp_register_style( 'gwtd', GWTD_URL . 'assets/css/designer.css', array(), GWTD_VERSION );
		wp_register_script( 'gwtd', GWTD_URL . 'assets/js/designer.js', array(), GWTD_VERSION, true );
		wp_localize_script(
			'gwtd',
			'gwtdConfig',
			array(
				'restUrl'       => esc_url_raw( rest_url( 'gwtd/v1/upload' ) ),
				'nonce'         => wp_create_nonce( 'wp_rest' ),
				'uploadEnabled' => 'yes' === get_option( 'gwtd_upload_enabled', 'no' ),
				'frontFee'      => GWTD_Settings::fee( 'front', false ),
				'backFee'       => GWTD_Settings::fee( 'back', false ),
				'artworkFee'    => max( 0, (float) get_option( 'gwtd_artwork_fee', 50 ) ),
				'currency'      => get_woocommerce_currency_symbol(),
				'uploading'     => __( 'Uploading artwork securely…', 'gw-tee-designer' ),
				'uploadError'   => __( 'Artwork upload failed. Try again.', 'gw-tee-designer' ),
			)
		);
	}

	public static function product_designer(): void {
		global $product;
		if ( ! $product || 'yes' !== get_post_meta( $product->get_id(), '_gw_designer_enabled', true ) ) {
			return;
		}
		self::render( $product, false );
	}

	public static function shortcode( array $atts = array() ): string {
		$atts = shortcode_atts( array( 'product_id' => 0 ), $atts, 'gw_tee_designer' );
		$product_id = absint( $atts['product_id'] );
		if ( ! $product_id ) {
			$query = new WP_Query( array( 'post_type' => 'product', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_key' => '_gw_designer_enabled', 'meta_value' => 'yes', 'post_status' => 'publish' ) );
			$product_id = $query->posts ? (int) $query->posts[0] : 0;
		}
		$product = $product_id ? wc_get_product( $product_id ) : false;
		if ( ! $product ) {
			return '<div class="woocommerce-info">' . esc_html__( 'No print-capable product is configured yet. Enable the designer on a WooCommerce product.', 'gw-tee-designer' ) . '</div>';
		}
		ob_start();
		echo '<form class="gwtd-shortcode-cart cart" method="post" enctype="multipart/form-data">';
		if ( $product->is_type( 'variable' ) ) {
			$variations = $product->get_available_variations();
			echo '<label class="gwtd-size-label">' . esc_html__( 'Choose size', 'gw-tee-designer' ) . '<select name="variation_id" required><option value="">' . esc_html__( 'Select a size', 'gw-tee-designer' ) . '</option>';
			foreach ( $variations as $variation ) {
				$size = $variation['attributes']['attribute_pa_size'] ?? '';
				printf( '<option value="%d" data-price="%s" data-size="%s">%s — %s</option>', absint( $variation['variation_id'] ), esc_attr( $variation['display_price'] ), esc_attr( $size ), esc_html( strtoupper( $size ) ), wp_kses_post( wc_price( $variation['display_price'] ) ) );
			}
			echo '</select></label><input class="gwtd-variation-size" type="hidden" name="attribute_pa_size" value="">';
		}
		self::render( $product, true );
		printf( '<input type="hidden" name="add-to-cart" value="%d"><input type="hidden" name="product_id" value="%d"><input type="hidden" name="quantity" value="1">', $product->get_id(), $product->get_id() );
		echo '<button type="submit" class="single_add_to_cart_button button alt gwtd-add">' . esc_html__( 'Add custom tee to cart', 'gw-tee-designer' ) . '</button></form>';
		return (string) ob_get_clean();
	}

	private static function render( WC_Product $product, bool $standalone ): void {
		++self::$instances;
		wp_enqueue_style( 'gwtd' );
		wp_enqueue_script( 'gwtd' );
		$id = 'gwtd-' . self::$instances;
		$back_enabled = 'yes' === get_post_meta( $product->get_id(), '_gw_back_print_enabled', true );
		$upload_enabled = 'yes' === get_option( 'gwtd_upload_enabled', 'no' );
		?>
		<section id="<?php echo esc_attr( $id ); ?>" class="gwtd" data-base-price="<?php echo esc_attr( $product->get_price() ); ?>" data-standalone="<?php echo $standalone ? '1' : '0'; ?>">
			<div class="gwtd-preview-column">
				<div class="gwtd-stage" aria-label="<?php esc_attr_e( 'T-shirt design preview', 'gw-tee-designer' ); ?>">
					<div class="gwtd-shirt" aria-hidden="true"><span class="gwtd-sleeve gwtd-sleeve--left"></span><span class="gwtd-sleeve gwtd-sleeve--right"></span><span class="gwtd-neck"></span></div>
					<div class="gwtd-print-area" tabindex="0" aria-label="<?php esc_attr_e( 'Printable area. Drag the design to reposition it.', 'gw-tee-designer' ); ?>">
						<img class="gwtd-artwork" alt="" hidden><div class="gwtd-text">Your story</div>
					</div>
				</div>
				<p class="gwtd-safe-note"><?php esc_html_e( 'Dashed line marks the printable area and is not printed.', 'gw-tee-designer' ); ?></p>
			</div>
			<div class="gwtd-controls">
				<div class="gwtd-heading"><div><span><?php esc_html_e( 'GW custom studio', 'gw-tee-designer' ); ?></span><h2><?php esc_html_e( 'Make it unmistakably yours.', 'gw-tee-designer' ); ?></h2></div><output class="gwtd-quote" aria-live="polite"></output></div>
				<fieldset><legend><?php esc_html_e( 'Print side', 'gw-tee-designer' ); ?></legend><div class="gwtd-segment"><label><input type="radio" name="<?php echo esc_attr( $id ); ?>-surface" value="front" checked><span><?php esc_html_e( 'Front', 'gw-tee-designer' ); ?></span></label><?php if ( $back_enabled ) : ?><label><input type="radio" name="<?php echo esc_attr( $id ); ?>-surface" value="back"><span><?php esc_html_e( 'Back', 'gw-tee-designer' ); ?></span></label><?php endif; ?></div></fieldset>
				<label><?php esc_html_e( 'Your text', 'gw-tee-designer' ); ?><input class="gwtd-text-input" type="text" maxlength="80" value="Your story" autocomplete="off"></label>
				<div class="gwtd-row"><label><?php esc_html_e( 'Font', 'gw-tee-designer' ); ?><select class="gwtd-font"><option value="system"><?php esc_html_e( 'Modern', 'gw-tee-designer' ); ?></option><option value="serif"><?php esc_html_e( 'Editorial', 'gw-tee-designer' ); ?></option><option value="rounded"><?php esc_html_e( 'Rounded', 'gw-tee-designer' ); ?></option><option value="mono"><?php esc_html_e( 'Mono', 'gw-tee-designer' ); ?></option></select></label><label><?php esc_html_e( 'Colour', 'gw-tee-designer' ); ?><input class="gwtd-color" type="color" value="#101522"></label></div>
				<label><?php esc_html_e( 'Text alignment', 'gw-tee-designer' ); ?><select class="gwtd-alignment"><option value="left"><?php esc_html_e( 'Left', 'gw-tee-designer' ); ?></option><option value="center" selected><?php esc_html_e( 'Centre', 'gw-tee-designer' ); ?></option><option value="right"><?php esc_html_e( 'Right', 'gw-tee-designer' ); ?></option></select></label>
			<div class="gwtd-row gwtd-compact"><label><?php esc_html_e( 'Text size', 'gw-tee-designer' ); ?><input class="gwtd-font-size" type="range" min="14" max="72" value="38"></label><label class="gwtd-check"><input class="gwtd-bold" type="checkbox"><span><?php esc_html_e( 'Bold', 'gw-tee-designer' ); ?></span></label></div>
			<div class="gwtd-row"><label><?php esc_html_e( 'Scale', 'gw-tee-designer' ); ?><input class="gwtd-scale" type="range" min="0.4" max="1.8" step="0.05" value="1"></label><label><?php esc_html_e( 'Rotate', 'gw-tee-designer' ); ?><input class="gwtd-rotation" type="range" min="-35" max="35" value="0"></label></div>
			<?php if ( $upload_enabled ) : ?><label class="gwtd-upload-label"><?php esc_html_e( 'Add artwork (PNG, JPG or WebP)', 'gw-tee-designer' ); ?><input class="gwtd-upload" type="file" accept="image/png,image/jpeg,image/webp"><small><?php printf( esc_html__( 'Maximum %d MB. Files are private and session-bound.', 'gw-tee-designer' ), (int) get_option( 'gwtd_max_upload_mb', 8 ) ); ?></small></label><div class="gwtd-upload-status" aria-live="polite"></div><label class="gwtd-low-res" hidden><input type="checkbox"><span><?php esc_html_e( 'I understand this artwork may be too low-resolution for the selected print size.', 'gw-tee-designer' ); ?></span></label><?php else : ?><div class="gwtd-storage-gate"><strong><?php esc_html_e( 'Text-only mode', 'gw-tee-designer' ); ?></strong><span><?php esc_html_e( 'Artwork uploads open after protected storage is verified.', 'gw-tee-designer' ); ?></span></div><?php endif; ?>
				<div class="gwtd-toolbar"><button class="gwtd-undo" type="button"><?php esc_html_e( 'Undo', 'gw-tee-designer' ); ?></button><button class="gwtd-reset" type="button"><?php esc_html_e( 'Reset', 'gw-tee-designer' ); ?></button></div>
				<label><?php esc_html_e( 'Print-team note (optional)', 'gw-tee-designer' ); ?><input class="gwtd-note" type="text" maxlength="200" placeholder="<?php esc_attr_e( 'Placement or review note', 'gw-tee-designer' ); ?>"></label>
				<input class="gwtd-design-data" type="hidden" name="gwtd_design" value="">
				<p class="gwtd-disclaimer"><?php esc_html_e( 'The on-screen preview is indicative. The print team reviews placement and file quality before production.', 'gw-tee-designer' ); ?></p>
			</div>
		</section>
		<?php
	}
}
