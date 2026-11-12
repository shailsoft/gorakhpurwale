# Release manifest — local candidate 1.0.0

Status: **local code complete; production gates open**. Generated 2026-11-06. This is not a deployed release.

| Component | Candidate | Source / license | Production status |
|---|---:|---|---|
| GW Store theme | 1.0.0 | This repository / GPL-2.0-or-later | Local candidate |
| GW Tee Designer | 1.0.0 | This repository / GPL-2.0-or-later | Local candidate; uploads gated |
| WordPress | 7.1.4 target (reconfirm before release) | wordpress.org / GPLv2+ | Not installed or verified here |
| WooCommerce | 11.2.2 target (reconfirm before release) | WooCommerce / GPLv3 | Not installed or verified here |
| PHP | 8.3+ preferred | Host/runtime | Windows host unverified |
| Database | MySQL 8.0+ or MariaDB 10.11+ preferred | Host/runtime | Windows host unverified |
| Payment plugin | Official Razorpay or Cashfree candidate, one only | Provider repository | Not selected; KYC/sandbox absent |

No runtime CDN, page builder, custom authentication, card storage, external font, analytics tracker, or premium dependency is included. Before release, record exact installed versions, checksums, plugin size, PHP/HPOS compatibility, licenses, and the rollback version.

Version research on 2026-11-06: the official WooCommerce release list identified 11.2.2 as stable, and the official plugin listing reported WordPress 7.0+ with testing through 7.1.4. The target remains provisional until the local/staging compatibility matrix passes.

