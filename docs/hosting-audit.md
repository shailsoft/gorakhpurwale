# Phase 0 — hosting, security and feasibility audit

Decision: **NO-GO for production until verified on the actual account.** No host credentials, control-panel export, database access, DNS ownership proof, or resource measurements were provided. This is an evidence gap, not a failed host.

## Evidence checklist

Record screenshots/exports and actual values; do not infer from “Windows hosting”.

| Area | Required evidence | Target | Status |
|---|---|---|---|
| Web server | IIS version, FastCGI mapping, URL Rewrite module | Supported IIS + clean permalinks | Unverified |
| PHP | Version, `phpinfo()` or CLI, extensions | PHP 8.3+; curl, mbstring, mysqli, gd/imagick, fileinfo, openssl, zip, intl | Unverified |
| Database | Engine/version/quota/connection | MySQL 8.0+ or MariaDB 10.11+ preferred | Unverified |
| Memory | PHP memory, WP memory, timeouts | 256 MB+ WP memory | Unverified |
| Uploads | `upload_max_filesize`, `post_max_size`, temp path, permissions | ≥8 MB if artwork enabled | Unverified |
| HTTPS | Certificate chain, TLS renewal, redirect, webhook reachability | Valid HTTPS, auto-renewal | Unverified |
| URLs | Product/cart/checkout/REST/admin rewrite tests | All 200 without `.htaccess` dependency | Unverified |
| Quota | Files, DB, mail, logs, temp, backup accounting | ≥500 MB upgrade/spike headroom | Unverified |
| Email/cron | SMTP, SPF/DKIM/DMARC, WP-Cron or real cron | Authenticated delivery and reliable jobs | Unverified |
| Domain | A/AAAA/www, redirects, owner access, Search Console, indexed legacy URLs | Clean canonical state | Unverified |
| Security | Existing files/DB/admins, malware scan, backup/restore | Verified clean snapshot | Unverified |
| Outbound | Payment API/webhooks and optional object storage | TLS outbound allowed | Unverified |

## Recommended IIS/PHP configuration

- PHP FastCGI with supported non-debug build, `memory_limit` ≥256M, `max_execution_time` 120 for admin operations, `max_input_vars` ≥3000, secure temp directory and disabled display errors in production.
- `upload_max_filesize` 8M and `post_max_size` at least 10M only if artwork uploads are approved. Keep the plugin's own limit no higher.
- IIS URL Rewrite installed; WordPress-generated rules in root `web.config`; deny direct access to `/wp-content/uploads/gw-private-artwork/` and confirm the denial with an HTTP test.
- Write access only where WordPress needs it; no script execution in uploads; secrets outside version control; production debug logging off.
- Reliable scheduled job to call WordPress cron and cleanup temporary designs. Exclude cart, checkout, account, REST design routes and authenticated traffic from caches.

## Disk budget

| Resource | Target |
|---|---:|
| WordPress, WooCommerce, theme and lean plugins | ≤300 MB |
| Catalog media and generated thumbnails | ≤400 MB |
| Temporary protected designs | ≤200 MB |
| Logs/transients/miscellaneous | ≤100 MB |
| Upgrade/spike headroom | ≥500 MB |
| Total | ≤1,500 MB |

Measure physical bytes after WordPress generates thumbnails. Never store backup ZIPs on the 1.5 GB account. If DB/mail/logs share the quota, reduce allocations. Production artwork originals require approved private object storage or a tightly controlled off-host fulfillment transfer; otherwise retain text-only mode.

## Go gate

Proceed only after all rows above have evidence, a test restore exists off-host, private artwork direct access returns 403/404, and the measured install retains ≥500 MB headroom. If any core capability is missing, migrate to a lean managed Linux WordPress host rather than weaken security.

