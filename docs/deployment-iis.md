# Phase 7 — IIS deployment and rollback

Deployment is intentionally **not performed**. This runbook requires explicit approval and successful Phase 0–6 evidence.

## Authorized release procedure

1. Approve business identity, policies, genuine products, stock, prices, tax treatment, shipping, payment KYC and artwork policy.
2. Create off-host file/database backup of the existing site and prove a restore. Audit unknown admins, malware, indexed legacy content and DNS/TLS.
3. Provision production DB and secrets in the hosting control panel. Install current supported WordPress/WooCommerce versions; activate only the selected lean plugins.
4. Upload only the theme and plugin release directories. Exclude `.git`, docs, preview, uploads, secrets, dumps, caches, `node_modules`, archives and demo media.
5. On IIS, confirm FastCGI and URL Rewrite; regenerate `web.config`; test `/shop/`, product, cart, checkout, account, REST, admin and gateway webhook paths.
6. Configure canonical HTTPS, no mixed content, real SMTP, cron, tax/shipping, legal pages, production products and stocks. Remove `[DEMO]` products and keep gateway sandbox until the final approved test.
7. Run the full matrix. Place one approved low-value genuine test order; verify signed payment, stock, email, artwork access, refund and logs.
8. Submit the clean sitemap only after historical spam/redirect review. Enable external backups, uptime/error/disk alerts and update staging.

## Rollback

Freeze new checkout if payment/security integrity is in doubt. Record the last valid order/payment event. Restore the verified off-host files and DB as one matched point-in-time set, reapply secrets, verify canonical TLS and reconcile gateway transactions created after the snapshot. Never roll back the database blindly while orders continue. Keep maintenance mode scoped and preserve order evidence.

