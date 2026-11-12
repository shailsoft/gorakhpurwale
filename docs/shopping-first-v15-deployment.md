# Shopping-first homepage release — 2026-11-08

Approved and deployed to https://gorakhpurwale.com/.

## Scope

Only `index.html`, the theme's `store.js`, and `store.css` were replaced. Homepage order is hero, search, product filters/catalog, benefits, discovery, custom-printing banner, and design studio. The homepage delivery checker was removed; product/checkout checks remain. Existing products, accounts, orders, delivery settings, PHP services, and permissions were not replaced.

Release: `deployment/gw-shopping-first-v15.zip`. Previous public files were downloaded into `deployment/rollback-shopping-v15/` before replacement.

## Verification

All seven existing local regression suites passed: checkout-login, checkout-submit, customer-order-sync, delivery-areas, demo-payment, registration-contacts, tracking-and-product-area.

`tests/release-smoke.mjs` passed against production: all three deployed files match the local release byte for byte; API health, unauthenticated access rejection, the legacy endpoint, private-file protection, and the inventory helper passed.

Live browser checks passed for public product loading, search, category filters, bag quantity/totals, existing admin session and product/order/user screens, three enabled delivery areas, unsupported checkout PIN 273001 rejection and supported PIN 273209 acceptance with free delivery at the current bag amount. The original bag quantities were restored. No orders or accounts were created, and no production records were edited. Mobile viewport 390 × 844 had no horizontal page overflow; the homepage checker was absent and checkout checker present.

The approved release archive remains in the web root. Automatic approval review rejected optional relocation as an extra server change; user approval was requested separately. The archive contains only the same three public application files, with no private data or backend files.

The payment feature remains a demo; no real payment provider or courier feed was added by this release. No commit or push was performed.
