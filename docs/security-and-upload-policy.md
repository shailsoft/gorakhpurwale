# Phase 3/6 — security and artwork policy

## Implemented controls

- Allowlist: PNG, JPEG and WebP only. SVG, HTML, executables and mismatched MIME are rejected.
- Server-side `finfo`/MIME and image-dimension checks; 1–20 MB configurable ceiling; eight uploads per WooCommerce session.
- WordPress REST nonce and active WooCommerce session required. Random UUID references are bound by HMAC to the session.
- Private directory contains IIS and Apache denial rules plus a dead `index.php`; controlled route checks staff capability or order ownership.
- Design JSON is reconstructed from an allowlist. Text length, fonts, colours, placement, scale and rotation are bounded.
- Server settings produce the charge; cart client values do not.
- Low-resolution uploads require explicit acknowledgement. No automatic print-readiness claim.
- Temporary unbound files expire; bound order files do not. Distinct designs cannot merge in cart.

## Production gate

Before enabling `gwtd_upload_enabled`, verify denial rules over real HTTPS, storage quota, secure print-team access, malware/content moderation process, print dimensions/DPI, privacy wording, deletion/retention schedule, incident response and off-host transfer. If any are absent, use text-only mode.

## Manual abuse tests

Test spoofed extensions, polyglots, SVG/HTML/PHP, oversized payloads, corrupted images, expired nonce, missing cookie, ninth upload, changed UUID, second user, logged-out order link, traversal strings, tampered fee/JSON, extreme transforms, two designs on one SKU and abandoned cleanup. See `tests/manual-qa-checklist.md`.

