# GW WooCommerce store

Local-only implementation of the phase-wise GW B2C T-shirt store brief. Nothing in this repository is deployed, connected to production payments, or a live offer.

## What is included

- `gw-store`: original, responsive WooCommerce theme with a GW-only monogram, home/shop/product/cart/checkout/account styling, filters, configurable storefront copy, SEO-safe defaults, and a 12-product demo seeder.
- `gw-tee-designer`: isolated WooCommerce extension for text/artwork personalization, server-side pricing, private session-bound uploads, unique cart items, custom-order consent, HPOS order metadata, production statuses, controlled downloads, and scheduled cleanup.
- Phase 0–7 operational documents and test checklists.
- `preview/index.html`: offline visual preview. It is not a substitute for WordPress/WooCommerce acceptance testing.

## Local WordPress setup

1. Provision a local WordPress site with PHP 8.3+, MySQL 8.0+ or MariaDB 10.11+, HTTPS if available, and at least 256 MB WordPress memory.
2. Install and activate WooCommerce using its supported installation method.
3. Copy `wp-content/themes/gw-store` and `wp-content/plugins/gw-tee-designer` into the local site's `wp-content` directory.
4. Activate **GW Store** and **GW Tee Designer**.
5. Set permalinks to **Post name**. Run `wp rewrite flush`.
6. From the local site root run `wp gw seed-demo`. This explicitly creates 12 `[DEMO]` products and draft-quality information pages; it never runs on activation.
7. Assign the custom page template **Custom T-Shirts** to `/custom-t-shirts/` if the seeder was not used. Configure menus, shop pages, shipping, email, taxes and test payments in WooCommerce admin.
8. Go to WooCommerce → Settings → Products → GW Tee Designer. Keep artwork uploads off until private storage and retention pass the hosting gate.

## Quick checks

```text
php -l <each PHP file>
wp theme activate gw-store
wp plugin activate woocommerce gw-tee-designer
wp gw seed-demo
wp wc product list --user=<administrator>
```

Run the test cases in `tests/manual-qa-checklist.md`. Test mode must remain enabled until real merchant, tax, shipping, legal, storage and hosting details are approved.

## Important boundaries

- Phase 0 is **not passed**: no Windows hosting/control-panel credentials or reliable server measurements were provided.
- Artwork upload is built but disabled by default. Text-only customization is the safe local MVP.
- Tax is disabled by the demo seeder because GST registration and rates are unknown.
- No real payment or shipping prices are configured. Use an official gateway plugin in sandbox only after merchant approval.
- Do not upload this whole repository to shared hosting. Follow `docs/deployment-iis.md` after authorization.

