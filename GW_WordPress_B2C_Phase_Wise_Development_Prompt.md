# GW — WordPress B2C Clothing & Custom T-Shirt Store
## Complete phase-wise development brief and Codex implementation prompt

**Project domain:** `gorakhpurwale.com` (production URL must be `https://gorakhpurwale.com/` after TLS is enabled)  
**Storefront brand shown to shoppers:** **GW**; the logo **must use only the stylized letters G and W**, with **no full domain or “gorakhpurwale” wording inside any logo artwork**.  
**Business model:** Single-vendor B2C e-commerce in India; priority is ready-made T-shirts and print-on-demand/customized T-shirts.  
**References:** [Myntra](https://www.myntra.com/) and [Meesho](https://www.meesho.com/) **only for UX patterns**. Do **not** copy visual identity, layouts exactly, imagery, trademarks, copyrighted code, or content. Create an original GW design.  
**Technology:** Self-hosted WordPress, WooCommerce, custom lightweight theme / child theme and isolated custom plugin for personalization.  
**Hosting:** Existing **Windows shared hosting, maximum 1.5 GB disk**, unknown IIS/PHP/database provisioning; **hosting feasibility is a Phase 0 release gate**.  
**Currency/locale:** INR (₹), India, mobile-first; English at launch with Hindi-ready localization.  
**Status:** Requirements and demo only. Do not treat the provided static HTML as a working WordPress shop, and do not attempt live deployment or payment collection without authorization and production credentials.

---

# HOW TO USE THIS FILE WITH CODEX

1. Create a new project folder or repository, place this Markdown file in its root, and attach the original GW SVG logo and storefront sample if available.
2. Tell Codex: **"Read `GW_WordPress_B2C_Phase_Wise_Development_Prompt.md` completely and execute Phase 0 first. Work phase by phase, implement real WordPress/WooCommerce code, run available tests, and report acceptance results and disk usage after each phase. Do not assume hosting compatibility or publish the site without my approval."**
3. If server credentials are not available, Codex must **not** invent the results of hosting checks. It may create a reproducible local development environment and a precise Windows-host verification checklist; clearly label all unverified items.
4. For development, use placeholder catalog data and payment **sandbox** keys only. Obtain real shipping prices, GST/tax details, merchant credentials, fulfillment policies, supplier stock, and buyer artwork-handling policy before launch.
5. Keep each phase's output in version control. The site must remain easily maintainable using standard WordPress admin and WooCommerce workflows, not require a developer to change every product or sale banner.

**Delivery priority:** a usable, secure B2C T-shirt store first; text-only custom printing may be the initial production MVP if the 1.5 GB account cannot safely protect/store uploaded artwork.

---

# INSTRUCTIONS FOR CODEX / DEVELOPMENT AGENT

You are the lead WordPress/WooCommerce architect, designer, QA engineer, and deployment engineer. Build a production-ready, responsive, original **GW** clothing store **phase by phase**, respecting the 1.5 GB Windows-hosting constraint.

## Mandatory execution rules

1. **Implement one phase at a time**. At the end of each phase, produce its files, setup instructions, demo/screenshots when applicable, test results, known limitations, and a short *go/no-go* checklist. Continue to the next phase only when its prerequisites are satisfied; if the prompt is run unattended, stop safely on failed prerequisites rather than pretending that deployment succeeded.
2. Inspect the actual hosting environment **before** installing anything. **Windows Server does not automatically mean WordPress-compatible hosting**. If PHP, MySQL/MariaDB, HTTPS, supported permissions, IIS URL Rewrite, or memory are missing, document the blocker; recommend migration to appropriate Linux WordPress hosting rather than shipping an insecure workaround.
3. Prefer **current, supported, compatible stable versions** of WordPress, WooCommerce, PHP, themes, and plugins; pin tested versions in a release manifest. As of this brief, WordPress recommends PHP **8.3+**, MySQL **8.0+ or MariaDB 10.11+**, HTTPS; WooCommerce 10.8+ recommends **WordPress 6.9+**, **PHP 8.3+**, MySQL **8.0+ or MariaDB 10.6+**, and WordPress memory **256 MB+**. Prefer currently supported database/PHP LTS releases after confirming plugin compatibility. Confirm current requirements again before deployment.
4. Use free/open-source components where practical. Do not assume any premium plugin or paid SaaS subscription is approved. Payment-provider transaction fees, shipping fees, domain/hosting, and optional storage fees are separate costs.
5. Prefer server-rendered WordPress/WooCommerce templates with progressive enhancement. **Do not deploy a separate React/Node server** on 1.5 GB shared hosting. Avoid Elementor-heavy, large multipurpose themes, unused libraries, excessive sliders and fonts.
6. Develop locally or on a **separate protected staging environment**, maintain a Git repo excluding secrets, uploads, database dumps and vendor credentials. Do not overwrite existing production content without a verified backup and explicit approval.
7. Do not fabricate order processing, payment verification, or production readiness. Use test mode/sandbox for checkout until signed off.
8. The domain has a publicly indexed historical page unrelated to this store. **Audit current DNS, TLS, site content, redirects, files, administrator accounts, and search-index status** before launch; don't assume the old indexed content still reflects the current live site.

## Branding and supplied design references

- Logo: use the original **GW monogram only**; full `gorakhpurwale` text is prohibited **inside the logo**. The domain can appear as a URL in checkout policies, email metadata, or footer if required, but never baked into the logo image.
- Proposed visual palette: midnight `#101522`, warm off-white `#FAF8F5`, coral `#FF5C45`, white `#FFFFFF`, muted grey `#77808E`.
- Typography: system-ui stack first; only one optimized self-hosted display font if it demonstrably improves rendering.
- Style: editorial fashion, generous spacing, crisp product cards, modern retail trust signals, clear customization CTA, excellent mobile touch targets.
- Provided companion deliverables: `GW_Logo.svg`, `GW_Storefront_Interactive_Sample.html`, desktop/mobile PNG visual previews. Use these for direction, not as a WordPress theme implementation.

---

# PHASE 0 — Hosting, security & feasibility assessment (BLOCKING)

**Objective:** Prove that WordPress + WooCommerce + customer image uploads can run safely on the existing Windows 1.5 GB account.

**Inspection tasks**

- [ ] Determine web server: IIS vs Apache; actual PHP execution; PHP version and extensions (`curl`, `mbstring`, `mysqli`, `gd` or `imagick`, `fileinfo`, `openssl`, `zip`, `intl` as applicable); MySQL/MariaDB version and DB quota.
- [ ] Confirm PHP 8.3+ preferred, DB versions noted above, HTTPS certificate, TLS auto-renewal, sufficient PHP memory and WordPress memory (target >=256 MB), request timeout, `upload_max_filesize`, `post_max_size`, `max_file_uploads`, `max_input_vars`.
- [ ] Confirm the 1.5 GB limit's meaning: **website files only, or also database, mailbox, logs, backups and temporary files?** Verify file count / inode and bandwidth restrictions.
- [ ] On IIS check **IIS URL Rewrite**, PHP via FastCGI, `web.config`, write access to `wp-content/uploads`, and clean WooCommerce product/cart/checkout URLs. **Do not rely on `.htaccess` rules on IIS.**
- [ ] Check DNS A/AAAA and www/non-www records; verify domain ownership/control, SSL, current redirects, site content, Search Console security warnings, suspicious pages, malware and unknown administrator accounts. Preserve a backup/snapshot before changes.
- [ ] Check SMTP/outbound email support, WP-Cron/real cron options, HTTPS outbound to payment provider, webhook reachability, and external object storage capability.
- [ ] Verify the host permits WordPress/WooCommerce resource use and account is not already near limits.

**Proposed disk budget, to verify against actual measurements rather than guaranteeing capacity:**

| Resource | Initial target |
| --- | ---: |
| WordPress + WooCommerce + minimal theme/plugins | ≤ 300 MB |
| Product/catalog media and thumbnails | ≤ 400 MB |
| Temporary custom-design uploads pending external offload or cleanup | ≤ 200 MB |
| Logs, transients, staging spillover, miscellaneous | ≤ 100 MB |
| **Headroom reserved for upgrades and spikes** | **≥ 500 MB** |
| **Total physical disk** | **≤ 1,500 MB** |

Never keep full backup ZIP archives in the hosting account. If hosting quota includes DB or mail, reduce these allocations further. **Printing originals may be several megabytes each and quickly exhaust the quota**: a production customizer needs either controlled retention / offsite transfer or compatible, approved object storage (S3-compatible provider etc.) before accepting many customer uploads. Do not delete assets required for undelivered orders.

**Deliverables:** `docs/hosting-audit.md`, environment checklist, risk register, recommended PHP/DB/IIS settings, go/no-go decision, migration fallback to lean Linux hosting if needed.

**Acceptance gate:** WordPress/WooCommerce supported and tested, HTTPS works, sufficient storage/memory, safe domain state, writable uploads and working URLs. If not, stop and report exact blockers.

---

# PHASE 1 — Information architecture & design system

**Objective:** Implement an original GW storefront close in quality and clarity to well-known Indian fashion retailers, not a clone.

**Pages and routes (WP/WooCommerce-native):**

- Home `/`
- Shop `/shop/`
- T-Shirts `/product-category/t-shirts/`
- Oversized T-Shirts `/product-category/oversized-t-shirts/`
- Graphic T-Shirts `/product-category/graphic-t-shirts/`
- Custom Printed T-Shirts `/custom-t-shirts/`
- Product detail `/product/{slug}/`
- Cart `/cart/`; Checkout `/checkout/`; My Account `/my-account/`
- Wishlist (defer unless lightweight, tested implementation); Order tracking/lookup via WooCommerce order page
- About, Contact, FAQ, Size Guide, Shipping & Delivery, Returns / Refunds, Cancellation & Custom Order Policy, Privacy, Terms, Custom Printing Guidelines, Bulk Orders enquiry.

**Homepage sections:**

1. Slim announcement strip (shipping/promotion claim must be configurable and accurate).
2. Sticky header: GW symbol, categories, product search, account, cart with count; mobile drawer.
3. Editorial hero: “Wear your story.” Two distinct CTAs **Shop T-Shirts** and **Design Your Tee**.
4. Category tiles: Everyday Essentials, Oversized, Graphic Prints, Customize.
5. Bestsellers / New Arrivals; sale badges only for real configured prices.
6. 3-step personalization: Pick T-shirt → Customize → Order.
7. Quality / secure checkout / shipping trust indicators (only make claims supportable in operations).
8. Newsletter optional: require consent and compliant provider; defer if not available.
9. Footer with customer-support links, policies, contact and social links; do not invent phone numbers, addresses or testimonials.

**Mobile UX:** One- or two-column product grid depending on viewport, compressed header, filter drawer, sticky product CTA, easy size selectors, accessible 44px+ tap areas, touch-friendly customizer, responsive checkout.

**Deliverables:** sitemap, responsive design tokens, reusable components, wireframes for 390/768/1440 widths, original logo integration and screenshots. Implement the shell as an upgrade-safe custom theme or child theme.

**Acceptance:** No brand name text inside logo; responsive at 320/375/390/768/1024/1440 px; no overflow; usable keyboard navigation and accessible contrast.

---

# PHASE 2 — WordPress + WooCommerce foundation and catalog (launch MVP)

**Install and configure:**

- WordPress with **custom lightweight GW theme** or clean parent plus child theme; no direct core/plugin edits.
- WooCommerce currency INR; India address fields, state/postcode, one-seller inventory, order emails, taxes (configure according to seller's verified registration; never invent GST rate), policies, basic analytics.
- Core product categories, attributes and **variable products**: Size S/M/L/XL/XXL, Color, Fit, Fabric, Print Style; SKUs, stock by variation where appropriate, actual dimensions, wash-care, size guide, gallery and pricing.
- Filters: size, color, price range, category, sort by newest / price / popularity; pagination; search with zero-results handling. Prefer native query or proven lightweight plugin.
- Product page: 2–4 compressed photos, price/strike-through when valid, stock, size chart, quantity, delivery/PIN code note, shipping/returns policy, related products, accessible selection and Add to Cart.
- Cart: editable quantities, remove product, coupon if enabled, shipping estimates, total. Checkout: guest checkout optional, address, mobile number, payment method, terms, accurate shipping/tax totals, order confirmation.
- Account: register/sign-in/password reset, order history, addresses. Ensure no theme-level custom authentication or storing passwords.
- Seed **12 demonstrative T-shirt products** and categories using clearly marked dummy descriptions/prices/images; documented cleanup before launch.

**Acceptance:** A normal T-shirt can be found, sized, added to cart, checked out in test mode and viewed as an order by an administrator.

---

# PHASE 3 — Personalized / printed T-Shirt configurator (priority differentiator)

**Goal:** Support an actual orderable product customization workflow, not merely a visual demo.

**Customer flow**

1. Select print-capable T-shirt (size, fabric/fit/color, front/back eligibility).
2. Pick front or back print surface. See clearly demarcated print-safe area over garment preview.
3. Add custom text with editable content, font from **licensed predefined list**, font size, bold toggle when supported, text color, alignment, position, rotation; optional preset design.
4. Upload PNG/JPG/WebP artwork; show preview, safe crop/fit/scale/drag/rotate within printable area; prevent print outside boundaries. **Reject SVG, HTML, executable content, unsupported MIME and files that violate size limits.**
5. Display clear warning if image resolution is insufficient for selected print dimensions; ask customer to confirm. No promise that low-resolution images become print-ready.
6. Show real-time quote from **server-authoritative pricing** (base T-shirt + front print + optional back print + extras + applicable tax/shipping). Prices configured by admin, never trusted from browser.
7. Preview and confirm artwork; add to WooCommerce cart. Save design metadata and a **server-generated immutable preview reference** with a unique line-item key; a customer cannot alter another order's design.
8. Checkout with appropriate policy acknowledgement for personalized orders. In admin order details show front/back previews, printable source references, exact text/font/placements, size/color, price breakdown, customer notes and controlled download links.
9. Order operations: New → Artwork review → Approved / Customer action needed → Printing → Packed → Shipped → Completed, using WooCommerce-compatible statuses or order notes with no brittle core modification.

**Recommended implementation**

- A small standalone plugin e.g. `gw-tee-designer` provides hooks, templates, REST/AJAX routes, nonce validation, capability checks, price rules, order item metadata, and HPOS-compatible WooCommerce CRUD (`wc_get_order`, `$order->...`).
- Frontend: choose lightweight vanilla JavaScript + native Canvas/CSS transforms **or** a permissively licensed, bundled editor library only if measured bundle size/performance justify it. Avoid external API subscriptions, iframe design tools, and third-party runtime CDNs.
- Upload via authenticated-or-session-bound secure endpoint and WordPress APIs; MIME/size limits and server-side inspection. Limit quantity per session, rate-limit uploads, sanitize file names, restrict attachment access to the order/staff, implement cleanup and retention policy. **Publicly accessible raw customer art URLs are not an acceptable default.**
- Optimize thumbnail previews on the shared server, but preserve original upload in a controlled private/offloaded location for print-production; preview pixels are **not** automatically acceptable as print-ready files. Define print dimensions and DPI with the actual print vendor.
- Store final state as validated JSON/order metadata; no arbitrary HTML/script input, no unsanitized CSS, no trusting manipulated client-side prices. Test duplicate cart lines and multiple different designs of the same base SKU.
- Must work on touch screens and low-powered phones; support undo/reset, accessible zoom/rotate controls, error/retry paths and upload-in-progress indicator.

**Low-storage fallback MVP:** If protected print-original storage/offload is unavailable, launch **custom text-only** with predefined fonts/colors, while keeping full photo-upload printing **disabled** until infrastructure passes the Phase 0/3 gate. Do not quietly accept uploads that cannot be fulfilled.

**Acceptance tests:** Distinct designs remain distinct in cart and order; variants and calculated amounts correct; staff can retrieve originals; cross-user access denied; uploaded invalid files rejected; aborted uploads cleaned; mobile editing works; order survives completed checkout.

---

# PHASE 4 — Payments, shipping, customer communication

- Integrate **one official or reputable compatible India payment gateway** (Razorpay or Cashfree are examples) **after account/KYC approval**. Use its maintained WooCommerce integration and test in sandbox; choose based on documented compatibility and transaction costs. Do not store cards, CVVs, raw credentials or API secrets in Git.
- Verify server-to-server payment confirmation/signatures/webhooks, idempotent status transitions, canceled/failed/refunded payment behavior; **never fulfill on client-side “success” screen alone**.
- Optional **COD** per zone and product type; allow owner to disable COD for customized non-returnable items if store policy requires prepayment.
- Shipping zones: local Gorakhpur/Pipiganj if actually served, Uttar Pradesh, Rest of India; configure cost and free-shipping threshold as **editable**, not fabricated. Shipping label/tracking integration only if chosen carrier/provider supports hosting and business account.
- Automated WooCommerce order emails with clear contact identity, order status, estimated processing time by category, and tracking only when valid. Configure SPF/DKIM/DMARC and authenticated SMTP if available.
- Policy pages: custom-print order approval, delivery estimate, print file ownership/rights, misprints/damage claims, refunds/cancellations, privacy/retention, customer-upload content restrictions. Have operator review for applicable Indian consumer and tax requirements.

**Acceptance:** Simulated orders for successful, pending, failed, COD, partial refund and shipping-zone changes produce correct amounts and statuses.

---

# PHASE 5 — Store administration, marketing, SEO & analytics

**Owner controls:** product/size/color/stock management, image uploads, discounts/coupons, order pipeline, sales/revenue view, abandoned cart only if feasible/consented, artwork preview and secure print-download, contact messages, editable homepage collections, CSV import/export.

**Search engine:** SEO-friendly titles/meta, canonical URLs, product structured data via WooCommerce-compatible methods, XML sitemap, real product descriptions, robots directives, optimized category copy, Open Graph images, redirect plan, Google Search Console verification. No keyword stuffing or misleading review schema.

**Marketing:** configurable banner, seasonal collections (Holi, Diwali, college/group events), discount logic, WhatsApp share/contact with consent and real number only, Instagram links, basic analytics with cookie/privacy settings and consent where required. Bulk printing inquiry form (team uniforms/events) with spam protection.

**SEO/security note:** Once the current domain is audited, investigate historical unrelated gambling content, old indexed URLs, malicious sitemaps or SEO spam; remove only verified unauthorized content, request re-indexing after cleanup, and ensure legitimate 404/410/redirect handling.

**Acceptance:** Nontechnical admin can manage catalog, prices, orders and customization settings without editing code.

---

# PHASE 6 — Performance, QA, security & accessibility

**Performance:**

- Target an efficient homepage and product pages on midrange Android/mobile network. Use WebP/AVIF where supported, `srcset`, lazy load below fold, appropriately sized thumbnails, CSS over JS where feasible.
- Keep at most a small set of installed plugins; record each purpose, license, version, PHP/HPOS compatibility and approximate storage cost.
- Cache anonymous catalog pages only; **never cache personalized cart, checkout, my-account, authenticated or sensitive design endpoints**. Avoid duplicate media generation and local backup archives.
- Configure scheduled cleanup for temporary designs, transients and old logs without deleting unpaid or unfulfilled order assets. Set proactive low-space monitoring.

**Security:** HTTPS-only; strong admin roles and MFA where compatible; least privilege; nonces + capability checks; input validation/escaping, prepared SQL, rate limiting, safe upload validation, CSRF/XSS/IDOR tests, no publicly downloadable private design assets, secure backups **off-server**, secret rotation, updates tested on staging.

**Test matrix:** iPhone Safari, Android Chrome, desktop Chrome/Edge/Firefox; 320–1440+ widths; accessibility (labels, focus indicators, contrast, keyboard flow); INR totals/tax, variant stock race conditions, checkout, coupons, refund; product search; IIS clean URL 404 behavior; signed links; URL migration; image upload under slow network; storage stress; failed SMTP and payment webhooks.

**Acceptance:** No critical/high unresolved issues; no fabricated visual trust claims; no severe layout break, no sensitive files publicly exposed, actual disk measurements documented, test checkout passes.

---

# PHASE 7 — Production deployment and handover (approval required)

**Deploy checklist:**

1. Confirm business owner approves final design, policies, real prices, legal/store identity, shipping costs and payment gateway merchant account.
2. Make **offsite** backup of any existing production files and database and verify a test restore. Avoid exposure of live credentials in logs/chat/Git.
3. Apply DNS/canonical domain and **valid HTTPS**; HTTP → HTTPS, www/non-www single canonical. Validate SSL before taking customer data.
4. Provision DB and production secret configuration in host control panel. Deploy only optimized theme/plugin assets with WordPress core and WooCommerce; do not upload `node_modules`, `.git`, dev archives, test fixtures or raw design backups.
5. On IIS ensure `web.config` rewrite rules and PHP FastCGI work with shop, products, cart, checkout, REST, `wp-admin` and payment-provider webhooks.
6. Complete WP install, set permalinks, shipping zones/taxes, transactional mail, legal pages, production gateway keys in secure settings, real products and stock; disable demo products and test payment mode.
7. Place one **small genuine live test order** using an approved payment method; verify payment, stock, email, shipping, artwork access, refunds and monitoring before wide promotion.
8. Submit sitemap, fix any historical search spam/security issues, enable external backups and uptime/storage alerts.
9. Deliver owner manual, access/secret handoff **out of Git**, diagram of theme/plugin files, configuration export, restore instructions and 30-day post-launch maintenance checklist.

**Rollback:** Document time-bounded method to restore verified offsite files + DB and payment reconciliation; no data-loss assumptions. For severe payment/security issues, switch to safe maintenance mode while preserving order records.

---

# Architecture and repository layout (proposal)

```text
gw-commerce/
├── README.md
├── docs/
│   ├── hosting-audit.md
│   ├── architecture.md
│   ├── sitemap-and-design.md
│   ├── security-and-upload-policy.md
│   ├── payment-shipping-test-plan.md
│   ├── deployment-iis.md
│   └── owner-guide.md
├── design/
│   ├── GW_Logo.svg
│   └── sample-mockups/
├── wp-content/
│   ├── themes/
│   │   └── gw-store/              # lightweight original theme or child theme
│   └── plugins/
│       └── gw-tee-designer/       # modular custom WooCommerce extension
├── tests/
│   └── manual-qa-checklist.md
├── .gitignore                    # ignore uploads, secrets, backups, DB, runtime files
└── release-manifest.md
```

**Architecture principles:** One WordPress install + WooCommerce + original theme + self-contained personalization plugin; no multi-vendor marketplace; no custom payment handling; avoid direct edits to WooCommerce core; standard REST/AJAX with security; HPOS-compatible WooCommerce order APIs; reusable templates and WordPress escaping/i18n APIs. Document all vendor dependencies and license terms.

# Phase acceptance / definition of done

| Phase | Must demonstrate |
| --- | --- |
| 0 | Windows hosting viability, clean domain/DNS, TLS, resource capacity and safe plan |
| 1 | Original branding and mobile/desktop mockups with GW-only logo |
| 2 | Shop, catalog, search, cart, checkout sandbox, real WooCommerce order |
| 3 | Custom tee design stored and retrievable securely for fulfillment |
| 4 | Payment webhook checks, shipping costs, emails and refund cases |
| 5 | Admin operability, SEO, real policies and basic analytics |
| 6 | Security, performance, storage, browser and accessibility QA |
| 7 | Authorized live launch, tests, rollback and complete handover |

# Initial product and price examples (NOT live claims)

- Basic solid-color T-shirt — **₹349** illustrative.
- Oversized T-shirt — **₹499** illustrative.
- Graphic T-shirt — **₹449** illustrative.
- Customized T-shirt — **base ₹349 + front printing ₹149 = ₹498**, indicative. Shipping, back printing and taxes depend on configured rules. Final real prices supplied by store owner.
- Categories at launch: Basic / Oversized / Graphic / Customized. Expand to polos, hoodies, kidswear, gifts and bulk/team orders **only after stable MVP**.

# Important owner decisions / sensible defaults

| Topic | Default for development | Must confirm before production |
| --- | --- | --- |
| B2C scope | Single seller, India | Legal name, store operator |
| Currency | INR | Tax registration and correct GST settings |
| Logo | GW monogram only | Sign-off on final vector logo |
| Product lines | T-shirts first | Real supplier stock, pricing, size chart |
| Custom image upload | Built but gated by storage feasibility | Print provider dimensions and private storage |
| Shipping | Flat rate + editable zones | Carrier/account, Pincodes, SLA, charges |
| Payment | Sandbox WooCommerce provider + COD optional | Merchant KYC, gateway fees, production keys |
| Hosting | Current Windows shared hosting only after audit | PHP/MySQL/TLS/IIS capability, disk limits |
| Custom order refunds | Clear policy + applicable-law review | Business/legal approval |

# Final response format required from Codex after each phase

Provide: **(a)** phase completed, **(b)** changed files, **(c)** steps to run/test locally, **(d)** visual proof/screenshots, **(e)** actual disk footprint, **(f)** test pass/fail summary, **(g)** unresolved blockers and next-phase recommendation. Never label the complete website “live” unless it has been deployed and end-to-end tested.

# Official reference links for implementers (recheck before launch)

- WordPress requirements: https://wordpress.org/about/requirements/
- WooCommerce server recommendations: https://woocommerce.com/document/server-requirements/
- WordPress IIS URL rewrite capability: https://developer.wordpress.org/reference/functions/iis7_supports_permalinks/
- WordPress IIS `web.config` note: https://developer.wordpress.org/advanced-administration/server/wordpress-in-directory/
- WordPress permalink guide: https://wordpress.org/documentation/article/customize-permalinks/
- WooCommerce shipping zones: https://woocommerce.com/document/setting-up-shipping-zones/
- WooCommerce HPOS: https://developer.woocommerce.com/docs/features/orders/high-performance-order-storage/
- Razorpay official WooCommerce plugin: https://wordpress.org/plugins/woo-razorpay/
- Cashfree official WooCommerce plugin: https://wordpress.org/plugins/cashfree/
