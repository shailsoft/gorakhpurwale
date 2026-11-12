<?php
defined( 'ABSPATH' ) || exit;

final class GWTD_Health {
	public static function init(): void {
		add_filter( 'site_status_tests', array( __CLASS__, 'tests' ) );
	}

	public static function tests( array $tests ): array {
		$tests['direct']['gwtd_disk_headroom'] = array( 'label' => __( 'GW artwork disk headroom', 'gw-tee-designer' ), 'test' => array( __CLASS__, 'disk_test' ) );
		$tests['direct']['gwtd_cleanup_schedule'] = array( 'label' => __( 'GW artwork cleanup schedule', 'gw-tee-designer' ), 'test' => array( __CLASS__, 'cron_test' ) );
		return $tests;
	}

	public static function disk_test(): array {
		$uploads = wp_upload_dir();
		$free = function_exists( 'disk_free_space' ) ? @disk_free_space( $uploads['basedir'] ) : false;
		$target = 500 * MB_IN_BYTES;
		if ( false === $free ) {
			return self::result( 'recommended', __( 'Disk headroom could not be measured', 'gw-tee-designer' ), __( 'Confirm the hosting quota and keep at least 500 MB free before enabling artwork uploads.', 'gw-tee-designer' ) );
		}
		if ( $free < $target ) {
			return self::result( 'critical', __( 'Artwork storage headroom is too low', 'gw-tee-designer' ), sprintf( __( 'Only %s appears free. Disable uploads and free or migrate storage.', 'gw-tee-designer' ), size_format( $free ) ) );
		}
		return self::result( 'good', __( 'Artwork storage has local disk headroom', 'gw-tee-designer' ), sprintf( __( '%s is visible to PHP. Confirm this reflects the account quota, not the whole server.', 'gw-tee-designer' ), size_format( $free ) ) );
	}

	public static function cron_test(): array {
		$scheduled = wp_next_scheduled( 'gwtd_cleanup_temporary_uploads' );
		if ( 'yes' === get_option( 'gwtd_upload_enabled', 'no' ) && ! $scheduled ) {
			return self::result( 'critical', __( 'Temporary artwork cleanup is not scheduled', 'gw-tee-designer' ), __( 'Disable uploads or reactivate the plugin and configure reliable WordPress cron.', 'gw-tee-designer' ) );
		}
		return self::result( 'good', __( 'Artwork cleanup state is safe', 'gw-tee-designer' ), $scheduled ? __( 'The cleanup event is scheduled. Confirm real cron reliability on hosting.', 'gw-tee-designer' ) : __( 'Artwork uploads are disabled, so no temporary customer files are accepted.', 'gw-tee-designer' ) );
	}

	private static function result( string $status, string $label, string $description ): array {
		return array( 'status' => $status, 'label' => $label, 'description' => '<p>' . esc_html( $description ) . '</p>', 'badge' => array( 'label' => __( 'GW Tee Designer', 'gw-tee-designer' ), 'color' => 'blue' ), 'test' => 'gwtd_' . sanitize_key( $label ) );
	}
}

