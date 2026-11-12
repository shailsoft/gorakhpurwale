# Phase 2–6 acceptance matrix

Record environment, browser/device, user, timestamp, evidence and exact result for every row.

## Catalog and checkout

- [ ] Search, zero results, category, size/color/price filters, sort and pagination.
- [ ] Variable size is required; out-of-stock variation cannot be bought; two concurrent last-stock attempts resolve safely.
- [ ] Add/update/remove/cart coupon/shipping estimate; guest and account checkout; address/mobile validation; password reset.
- [ ] INR line items, discounts, shipping, tax and total agree with verified configuration.
- [ ] Successful, pending, failed, cancelled, COD and partial-refund cases pass the Phase 4 plan.

## Designer

- [ ] Text font, size, bold, colour, drag, scale, rotate, front/back and reset work with keyboard/touch where applicable.
- [ ] Browser quote equals server cart/order amount after tampering attempts.
- [ ] Two designs for the same variation remain separate through checkout and admin order view.
- [ ] PNG/JPG/WebP accepted only when gate enabled; SVG/HTML/PHP/spoof/corrupt/oversized files rejected.
- [ ] Low-resolution warning requires confirmation. Slow/failed upload communicates retry state.
- [ ] Second session/user cannot use or retrieve another design. Customer can access own bound order only; staff capability works.
- [ ] Direct artwork URL is 403/404 on IIS and Apache. Abandoned files expire; unpaid/unfulfilled order assets remain.

## Responsive/accessibility

- [ ] No horizontal overflow at 320, 375, 390, 768, 1024 and 1440 px.
- [ ] iPhone Safari, Android Chrome, desktop Chrome, Edge and Firefox smoke tests.
- [ ] Keyboard navigation, visible focus, Escape-close navigation, labels/errors, contrast, 200% zoom and reduced-motion behavior.
- [ ] Product selections and designer controls have understandable accessible names; checkout errors receive focus/announcement.

## IIS/security/performance

- [ ] Clean product/cart/checkout/account/REST/webhook URLs; deliberate 404; no `.htaccess` dependency.
- [ ] CSRF, stored/reflected XSS, IDOR, traversal, MIME spoofing, capability, nonce and rate-limit tests.
- [ ] HTTPS/canonical redirects, no secrets/debug output, least privilege, MFA/admin audit, off-host restore.
- [ ] Anonymous cache excludes cart/checkout/account/auth/design routes. Mobile image sizes, lazy loading and actual transfer/LCP measurements recorded.
- [ ] Physical disk usage and 500 MB headroom confirmed after thumbnails, update simulation and cleanup.

Release requires zero unresolved critical/high issues and a fully evidenced test checkout. Current status: **not run against WordPress or production hosting**.

