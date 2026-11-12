<?php get_header(); ?>
<main id="main" class="site-main"><div class="gw-shell gw-content">
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<article <?php post_class(); ?>><h1><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1><?php the_excerpt(); ?></article>
<?php endwhile; the_posts_pagination(); else : ?><div class="gw-empty"><h1><?php esc_html_e( 'Nothing here yet.', 'gw-store' ); ?></h1></div><?php endif; ?>
</div></main>
<?php get_footer(); ?>

