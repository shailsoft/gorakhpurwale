<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Upload {
	private const CRON_HOOK = 'gwtd_cleanup_temporary_uploads';

	public static function init(): void {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
		add_action( self::CRON_HOOK, array( __CLASS__, 'cleanup' ) );
	}

	public static function activate(): void {
		self::ensure_private_dir();
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'hourly', self::CRON_HOOK );
		}
	}

	public static function deactivate(): void {
		wp_clear_scheduled_hook( self::CRON_HOOK );
	}

	public static function routes(): void {
		register_rest_route( 'gwtd/v1', '/upload', array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( __CLASS__, 'upload' ), 'permission_callback' => array( __CLASS__, 'session_permission' ) ) );
		register_rest_route( 'gwtd/v1', '/download/(?P<id>[a-f0-9\-]{36})', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( __CLASS__, 'download' ), 'permission_callback' => array( __CLASS__, 'download_permission' ) ) );
	}

	public static function session_permission( WP_REST_Request $request ) {
		if ( 'yes' !== get_option( 'gwtd_upload_enabled', 'no' ) ) {
			return new WP_Error( 'gwtd_disabled', __( 'Artwork uploads are not currently available.', 'gw-tee-designer' ), array( 'status' => 403 ) );
		}
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_Error( 'gwtd_nonce', __( 'Your session has expired. Refresh and try again.', 'gw-tee-designer' ), array( 'status' => 403 ) );
		}
		if ( ! function_exists( 'WC' ) || ! WC()->session ) {
			return new WP_Error( 'gwtd_session', __( 'A valid shop session is required.', 'gw-tee-designer' ), array( 'status' => 403 ) );
		}
		$count = (int) WC()->session->get( 'gwtd_upload_count', 0 );
		if ( $count >= 8 ) {
			return new WP_Error( 'gwtd_rate', __( 'Upload limit reached for this session.', 'gw-tee-designer' ), array( 'status' => 429 ) );
		}
		return true;
	}

	public static function upload( WP_REST_Request $request ) {
		$files = $request->get_file_params();
		if ( empty( $files['artwork'] ) || UPLOAD_ERR_OK !== (int) $files['artwork']['error'] ) {
			return new WP_Error( 'gwtd_file', __( 'Choose a valid artwork file.', 'gw-tee-designer' ), array( 'status' => 400 ) );
		}
		$file = $files['artwork'];
		$max  = min( 20, max( 1, (int) get_option( 'gwtd_max_upload_mb', 8 ) ) ) * MB_IN_BYTES;
		if ( (int) $file['size'] > $max ) {
			return new WP_Error( 'gwtd_size', __( 'The artwork file is too large.', 'gw-tee-designer' ), array( 'status' => 400 ) );
		}
		$mime = function_exists( 'finfo_open' ) ? ( new finfo( FILEINFO_MIME_TYPE ) )->file( $file['tmp_name'] ) : mime_content_type( $file['tmp_name'] );
		$allowed = array( 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp' );
		if ( ! isset( $allowed[ $mime ] ) ) {
			return new WP_Error( 'gwtd_mime', __( 'Only PNG, JPG and WebP artwork is accepted.', 'gw-tee-designer' ), array( 'status' => 400 ) );
		}
		$dimensions = @getimagesize( $file['tmp_name'] );
		if ( ! $dimensions || empty( $dimensions[0] ) || empty( $dimensions[1] ) ) {
			return new WP_Error( 'gwtd_image', __( 'The artwork is not a readable image.', 'gw-tee-designer' ), array( 'status' => 400 ) );
		}
		$dir = self::ensure_private_dir();
		if ( is_wp_error( $dir ) ) {
			return $dir;
		}
		$id       = wp_generate_uuid4();
		$filename = $id . '.' . $allowed[ $mime ];
		$path     = trailingslashit( $dir ) . $filename;
		if ( ! move_uploaded_file( $file['tmp_name'], $path ) ) {
			return new WP_Error( 'gwtd_move', __( 'The artwork could not be stored securely.', 'gw-tee-designer' ), array( 'status' => 500 ) );
		}
		chmod( $path, 0640 );
		$session_hash = hash_hmac( 'sha256', WC()->session->get_customer_id(), wp_salt( 'auth' ) );
		$record = array( 'id' => $id, 'path' => $path, 'name' => sanitize_file_name( $file['name'] ), 'mime' => $mime, 'width' => (int) $dimensions[0], 'height' => (int) $dimensions[1], 'size' => (int) $file['size'], 'session' => $session_hash, 'created' => time(), 'order_id' => 0 );
		update_option( 'gwtd_upload_' . $id, $record, false );
		WC()->session->set( 'gwtd_upload_count', (int) WC()->session->get( 'gwtd_upload_count', 0 ) + 1 );
		$minimum = max( 300, (int) get_option( 'gwtd_min_pixels', 1200 ) );
		return rest_ensure_response( array( 'id' => $id, 'name' => $record['name'], 'width' => $record['width'], 'height' => $record['height'], 'low_resolution' => min( $record['width'], $record['height'] ) < $minimum ) );
	}

	public static function download_permission( WP_REST_Request $request ) {
		$id = sanitize_text_field( $request['id'] );
		$record = get_option( 'gwtd_upload_' . $id );
		if ( ! is_array( $record ) ) {
			return new WP_Error( 'gwtd_missing', __( 'Artwork not found.', 'gw-tee-designer' ), array( 'status' => 404 ) );
		}
		if ( current_user_can( 'manage_woocommerce' ) ) {
			return true;
		}
		if ( ! empty( $record['order_id'] ) && is_user_logged_in() ) {
			$order = wc_get_order( (int) $record['order_id'] );
			if ( $order && (int) $order->get_customer_id() === get_current_user_id() ) {
				return true;
			}
		}
		return new WP_Error( 'gwtd_forbidden', __( 'You cannot access this artwork.', 'gw-tee-designer' ), array( 'status' => 403 ) );
	}

	public static function download( WP_REST_Request $request ) {
		$record = get_option( 'gwtd_upload_' . sanitize_text_field( $request['id'] ) );
		if ( ! $record || ! is_readable( $record['path'] ) ) {
			return new WP_Error( 'gwtd_missing', __( 'Artwork file is unavailable.', 'gw-tee-designer' ), array( 'status' => 404 ) );
		}
		nocache_headers();
		header( 'Content-Type: ' . $record['mime'] );
		header( 'Content-Disposition: attachment; filename="' . sanitize_file_name( $record['name'] ) . '"' );
		header( 'Content-Length: ' . filesize( $record['path'] ) );
		readfile( $record['path'] );
		exit;
	}

	public static function record( string $id ): ?array {
		$record = get_option( 'gwtd_upload_' . $id );
		return is_array( $record ) ? $record : null;
	}

	public static function bind_to_order( string $id, int $order_id ): void {
		$record = self::record( $id );
		if ( $record ) {
			$record['order_id'] = $order_id;
			update_option( 'gwtd_upload_' . $id, $record, false );
		}
	}

	public static function verify_session( string $id ): bool {
		$record = self::record( $id );
		if ( ! $record || ! function_exists( 'WC' ) || ! WC()->session ) {
			return false;
		}
		return hash_equals( $record['session'], hash_hmac( 'sha256', WC()->session->get_customer_id(), wp_salt( 'auth' ) ) );
	}

	public static function cleanup(): void {
		global $wpdb;
		$hours = min( 168, max( 6, (int) get_option( 'gwtd_retention_hours', 48 ) ) );
		$keys = $wpdb->get_col( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE 'gwtd_upload_%'" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
		foreach ( $keys as $key ) {
			$record = get_option( $key );
			if ( ! is_array( $record ) || ! empty( $record['order_id'] ) || (int) $record['created'] > time() - $hours * HOUR_IN_SECONDS ) {
				continue;
			}
			if ( ! empty( $record['path'] ) && is_file( $record['path'] ) ) {
				wp_delete_file( $record['path'] );
			}
			delete_option( $key );
		}
	}

	private static function ensure_private_dir() {
		$uploads = wp_upload_dir();
		$dir = trailingslashit( $uploads['basedir'] ) . 'gw-private-artwork';
		if ( ! wp_mkdir_p( $dir ) ) {
			return new WP_Error( 'gwtd_dir', __( 'Private artwork storage is unavailable.', 'gw-tee-designer' ) );
		}
		$files = array(
			'index.php'  => "<?php\nhttp_response_code(404);\nexit;\n",
			'.htaccess'  => "Require all denied\nDeny from all\n",
			'web.config' => "<?xml version=\"1.0\" encoding=\"UTF-8\"?><configuration><system.webServer><security><requestFiltering><hiddenSegments><add segment=\"gw-private-artwork\" /></hiddenSegments></requestFiltering></security></system.webServer></configuration>",
		);
		foreach ( $files as $name => $content ) {
			$path = trailingslashit( $dir ) . $name;
			if ( ! file_exists( $path ) ) {
				file_put_contents( $path, $content ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			}
		}
		return $dir;
	}
}

