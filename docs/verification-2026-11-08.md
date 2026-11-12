# Shopping and admin verification

The candidate release is tested on the same IIS/PHP server in an isolated store. Its PHP login session, browser storage and JSON files are separate from production. Test shoppers, staff, products and orders are synthetic. Production customer orders are not used for delivery tests.

## Completed server checks

All 18 checks in `tests/server-journey.mjs` passed against the corrected server code:

- Guest checkout and management access are blocked.
- Admin product creation, multiple images, variations, price, stock and visibility edits.
- Delivery area creation, paused areas, charges/free thresholds, duplicate PIN validation and conflicting-save protection.
- Mobile-only registration, password login, duplicate mobile protection and shopper-only self-registration.
- Admin-created staff and contact fields in the user list.
- Customer/admin/staff permission boundaries.
- Checkout PIN, email and mobile validation; optional blank email.
- COD checkout and account-bound My Orders; other shoppers cannot see the order.
- Received → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered, with customer-visible status history and courier details.
- Staff order updates and validation of statuses/tracking URLs.
- Server price validation, canonical product names and stock deduction.
- Inactive/missing product and invalid variation rejection.
- Concurrent checkouts for the last unit: one succeeds and one is rejected.
- Online-payment rejection until a gateway is connected.
- Custom front/back/artwork pricing.
- Customer-visible cancellation, return and refund status labels.
- Logout removes authenticated access.

The detailed results are stored in `deployment/qa-journey-report.json`.

## Browser verification

A shopper signed in with a dedicated test mobile account. The browser completed checkout with blank email and saved order `GW-20261107-B3792`. A separate admin session changed its status and courier details. My Orders displayed Confirmed and tracking number QA-BROWSER-12345 without reloading, then displayed Delivered after the remaining delivery stages.

The product image slider, unsupported/supported PIN checks, bag quantity, guest login gate and mobile-only registration fields were checked. My Orders was checked at 390 × 844 pixels with no page overflow. Screenshots: `deployment/customer-delivered-qa.png` and `deployment/customer-orders-mobile-qa.png`.

The admin browser uploaded two real PNG files, saved a new product, edited its price and stock, searched the catalog and moved it to draft. The active product appeared in the public collection and disappeared after drafting. The user list displayed contact details and roles. The browser saved an order status and courier details, viewed overview counts, and added/paused a test delivery area. The manager also fit a 390 × 844 viewport without page overflow (`deployment/admin-mobile-qa.png`).

A separate staff login confirmed that user management is hidden. The delivery editor initially had its hidden attribute overridden by a grid display rule; the final CSS fixes that. Retesting showed computed display none for staff, with the delivery-area list still readable. Admin-only changes remain rejected by the server.

Re-logging into the shopper account after editing in the actual manager UI showed Delivered, courier QA Admin UI Courier and tracking number QA-ADMIN-UI-67890. Search empty states, category/colour filters and ascending-price sorting were also checked in the browser.

## Production release

`deployment/gw-verified-shopping-v12.zip` contains only the tested application files; production JSON data is excluded. The host confirmed successful extraction. The production HTML, JavaScript and CSS match the local release hashes. Live API health, private-file protection (IIS returns 401), legacy URL login enforcement, mobile registration validation and optional-checkout-email checks passed without adding production users or orders.

Live tracking authorization/validation and all three enabled delivery PINs also passed. The temporary QA folder and its four archives, plus the production upload archive, were moved into protected private storage after testing. Existing production customers, products, orders and delivery settings were preserved. No commits or pushes were made.

## Fixes found through testing

Checkout now captures the form before awaiting login validation, since browser events clear currentTarget after dispatch. A regression test reproduces that lifecycle. Product prices, active state, variations and available stock are checked on the server. Checkout locks stock while saving orders and deducts inventory. The browser uses current catalog prices, handles changed stock/prices and includes artwork charges in custom quotes. The legacy order URL uses the same authenticated implementation.

## Validation limits

Cash on delivery is tested. Online payments, SMS/OTP, outbound email and automatic courier webhook/API feeds have no provider connection and are not verified as active services. Refund status labels do not initiate a financial refund. Server/API tests verify registration and role creation; no real credentials are changed through the browser. A hosting-panel memory/paging error prevented one extraction; a retry succeeded and the actual deployed files were checked before retesting.
