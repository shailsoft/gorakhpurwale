<form role="search" method="get" class="gw-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label><span class="screen-reader-text"><?php esc_html_e( 'Search products', 'gw-store' ); ?></span><input type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search T-shirts…', 'gw-store' ); ?>"></label>
	<input type="hidden" name="post_type" value="product"><button type="submit"><?php esc_html_e( 'Search', 'gw-store' ); ?></button>
</form>
