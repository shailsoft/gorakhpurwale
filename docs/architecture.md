# Architecture

## Runtime

One server-rendered WordPress installation runs WooCommerce, the `gw-store` theme and `gw-tee-designer` plugin. There is no Node/React production service, page builder, custom authentication, card handling, or direct WooCommerce core edit.

## Responsibility map

| Layer | Responsibility |
|---|---|
| WordPress | Content, users, menus, pages, media and localization |
| WooCommerce | Products, variations, inventory, cart, checkout, customer accounts, orders, tax/shipping/payment APIs |
| GW Store theme | Presentation, responsive shell, homepage, catalog styles and configurable marketing copy |
| GW Tee Designer | Validated design state, quote additions, private upload references, cart/order metadata and print workflow |
| Official payment plugin | Provider-hosted/signed payment flow and webhooks; selected later |

## Personalization flow

1. Admin explicitly enables the designer on a product and configures fees.
2. Browser creates a preview and submits JSON; uploaded artwork first reaches a nonce-checked, session-bound REST route.
3. Server validates types, MIME, dimensions, ownership, numeric bounds, font allowlist and product capabilities.
4. Server calculates fees from WooCommerce settings. Browser prices are never trusted.
5. A random cart-line key prevents distinct designs of the same SKU from merging.
6. Validated JSON is copied to order-item metadata using WooCommerce CRUD. Artwork is bound to the order.
7. Staff with `manage_woocommerce`, or the authenticated owning customer, can retrieve artwork through the controlled route. Direct IIS/Apache access is denied.
8. Hourly cleanup removes abandoned, unbound temporary uploads after the configured retention window. Bound order artwork is never auto-deleted.

## Extension points

- Use WooCommerce shipping zones, tax tables, coupons, email templates, analytics and CSV tools rather than theme-specific replacements.
- Add one official gateway plugin after sandbox/KYC approval.
- Replace local private originals with an approved object-storage adapter before high-volume artwork orders.
- Keep customer-facing strings localization-ready through WordPress text domains.

