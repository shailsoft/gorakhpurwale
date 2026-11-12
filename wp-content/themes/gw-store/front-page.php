<?php
defined( 'ABSPATH' ) || exit;
get_header();
$shop_url   = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
$custom_url = home_url( '/custom-t-shirts/' );
?>
<main id="main" class="site-main">
	<section class="gw-hero">
		<div class="gw-shell gw-hero-inner">
			<div class="gw-hero-copy">
				<p class="gw-eyebrow"><?php esc_html_e( 'Fits for every version of you', 'gw-store' ); ?></p>
				<h1><?php echo wp_kses_post( str_replace( 'story.', '<span>story.</span>', esc_html( get_theme_mod( 'gw_hero_title', __( 'Wear your story.', 'gw-store' ) ) ) ) ); ?></h1>
				<p><?php echo esc_html( get_theme_mod( 'gw_hero_copy', __( 'Everyday fits, original graphics and custom prints made personal.', 'gw-store' ) ) ); ?></p>
				<div class="gw-actions"><a class="gw-button" href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'Shop T-Shirts', 'gw-store' ); ?> <span aria-hidden="true">→</span></a><a class="gw-button gw-button--ghost" href="<?php echo esc_url( $custom_url ); ?>"><?php esc_html_e( 'Design Your Tee', 'gw-store' ); ?></a></div>
			</div>
		</div>
	</section>

	<section class="gw-trust" aria-label="<?php esc_attr_e( 'Store promises', 'gw-store' ); ?>"><div class="gw-shell gw-trust-grid">
		<div><span>↺</span><strong><?php esc_html_e( 'Clear returns', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Policy shown before checkout', 'gw-store' ); ?></small></div>
		<div><span>♢</span><strong><?php esc_html_e( 'Secure checkout', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Payments handled by verified providers', 'gw-store' ); ?></small></div>
		<div><span>✓</span><strong><?php esc_html_e( 'Quality reviewed', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Custom artwork checked before print', 'gw-store' ); ?></small></div>
		<div><span>✦</span><strong><?php esc_html_e( 'Made personal', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Text and artwork options', 'gw-store' ); ?></small></div>
	</div></section>

	<section class="gw-section gw-shell"><div class="gw-section-heading"><div><p class="gw-eyebrow"><?php esc_html_e( 'Find your fit', 'gw-store' ); ?></p><h2><?php esc_html_e( 'Shop by mood', 'gw-store' ); ?></h2></div><a href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'View all', 'gw-store' ); ?> →</a></div>
		<div class="gw-category-grid">
			<a class="gw-category gw-category--cream" href="<?php echo esc_url( home_url( '/product-category/t-shirts/' ) ); ?>"><span>01</span><h3><?php esc_html_e( 'Everyday essentials', 'gw-store' ); ?></h3><p><?php esc_html_e( 'Easy colour. Clean cut. Repeat.', 'gw-store' ); ?></p></a>
			<a class="gw-category gw-category--dark" href="<?php echo esc_url( home_url( '/product-category/oversized-t-shirts/' ) ); ?>"><span>02</span><h3><?php esc_html_e( 'Oversized', 'gw-store' ); ?></h3><p><?php esc_html_e( 'Roomy silhouettes with structure.', 'gw-store' ); ?></p></a>
			<a class="gw-category gw-category--coral" href="<?php echo esc_url( home_url( '/product-category/graphic-t-shirts/' ) ); ?>"><span>03</span><h3><?php esc_html_e( 'Graphic prints', 'gw-store' ); ?></h3><p><?php esc_html_e( 'Original art for off-duty days.', 'gw-store' ); ?></p></a>
			<a class="gw-category gw-category--sage" href="<?php echo esc_url( $custom_url ); ?>"><span>04</span><h3><?php esc_html_e( 'Make it yours', 'gw-store' ); ?></h3><p><?php esc_html_e( 'Your words. Your artwork. Your tee.', 'gw-store' ); ?></p></a>
		</div>
	</section>

	<section class="gw-custom-banner"><div class="gw-shell gw-custom-banner-inner"><div><p class="gw-eyebrow"><?php esc_html_e( 'Custom T-shirt printing', 'gw-store' ); ?></p><h2><?php esc_html_e( 'From idea to wearable.', 'gw-store' ); ?></h2><p><?php esc_html_e( 'Choose a tee, compose your design and confirm every detail before it reaches the print team.', 'gw-store' ); ?></p><a class="gw-button" href="<?php echo esc_url( $custom_url ); ?>"><?php esc_html_e( 'Start customizing', 'gw-store' ); ?> →</a></div><ol><li><span>1</span><strong><?php esc_html_e( 'Pick your tee', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Fit, size and colour', 'gw-store' ); ?></small></li><li><span>2</span><strong><?php esc_html_e( 'Create your design', 'gw-store' ); ?></strong><small><?php esc_html_e( 'Text or approved artwork', 'gw-store' ); ?></small></li><li><span>3</span><strong><?php esc_html_e( 'Review & order', 'gw-store' ); ?></strong><small><?php esc_html_e( 'See the quote before checkout', 'gw-store' ); ?></small></li></ol></div></section>

	<?php if ( class_exists( 'WooCommerce' ) ) : ?>
	<section class="gw-section gw-shell"><div class="gw-section-heading"><div><p class="gw-eyebrow"><?php esc_html_e( 'Demo collection', 'gw-store' ); ?></p><h2><?php esc_html_e( 'Trending now', 'gw-store' ); ?></h2></div><a href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'Shop all', 'gw-store' ); ?> →</a></div><?php echo do_shortcode( '[products limit="4" columns="4" orderby="date" order="DESC"]' ); ?></section>
	<?php endif; ?>

	<section class="gw-section gw-shell gw-story"><div><p class="gw-eyebrow"><?php esc_html_e( 'Designed with restraint', 'gw-store' ); ?></p><h2><?php esc_html_e( 'A smaller wardrobe. A stronger point of view.', 'gw-store' ); ?></h2></div><p><?php esc_html_e( 'GW begins with focused T-shirt drops: useful solids, relaxed oversized fits, graphic stories and genuinely personal prints. Product facts, prices and delivery promises stay editable by the store team.', 'gw-store' ); ?></p></section>
</main>
<?php get_footer(); ?>

