# Phase 1 — sitemap and design system

## Routes

Home `/`; shop `/shop/`; T-shirts `/product-category/t-shirts/`; oversized `/product-category/oversized-t-shirts/`; graphics `/product-category/graphic-t-shirts/`; custom `/custom-t-shirts/`; products `/product/{slug}/`; cart `/cart/`; checkout `/checkout/`; account `/my-account/`; plus About, Contact, FAQ, Size Guide, Shipping & Delivery, Returns & Refunds, Cancellation & Custom Order Policy, Privacy, Terms, Custom Printing Guidelines and Bulk Orders.

## Tokens

- Midnight `#101522`; warm paper `#FAF8F5`; coral `#FF5C45`; white `#FFFFFF`; muted grey `#6F7783`; sage `#B9C6AE`.
- System font stack only. No external font payload.
- 12–24 px control radii; 44 px minimum interactive target; shell width `min(1240px, 100% - 40px)`.
- Original GW monogram uses only G/W. The domain is not embedded in logo art.

## Responsive wireframes

| Width | Header | Hero | Catalog | Customizer |
|---:|---|---|---|---|
| 390 | menu/logo/cart; 64 px | image with lower gradient; stacked CTAs | two columns | preview over controls |
| 768 | drawer navigation | editorial overlay | two columns | preview over controls |
| 1440 | full category nav | copy left, garment image right | four columns + sidebar filters | two columns |

Content follows a distinct progression: promise → trust → category discovery → customization steps → products → brand point of view. Trust statements are phrased as process descriptions and remain configurable; no invented testimonials, addresses or guaranteed shipping claims appear.

