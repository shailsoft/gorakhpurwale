# Phase 4 — payments, shipping and communication

No merchant account, real charges, tax identity, carrier prices or verified email identity were supplied. Implementation therefore stops at WooCommerce-compatible configuration and test planning.

## Selection and setup

Choose exactly one maintained official/reputable WooCommerce provider after comparing current compatibility, KYC, settlement, refund, webhook and transaction costs. Razorpay and Cashfree are candidates, not endorsements. Store API secrets in host configuration/admin secrets, never this repository. Use sandbox until signed off.

Create editable zones only after owner confirmation: local service area (if actually served), Uttar Pradesh and Rest of India. Configure COD per zone and disable it for personalized items if approved policy requires prepayment. Do not invent free-shipping thresholds.

## Acceptance scenarios

| Scenario | Expected result |
|---|---|
| Signed successful webhook | Idempotent paid/processing transition; stock reduced once |
| Pending | No fulfillment; later signed update reconciles |
| Failed/cancelled | Order not treated as paid; retry remains possible |
| Duplicate webhook | No duplicate note, charge or stock transition |
| COD allowed zone | Accurate total and COD status |
| Custom item with COD disabled | COD unavailable without breaking normal products |
| Partial refund | Gateway and WooCommerce totals/status agree |
| Shipping-zone change | Recalculated editable rate, tax and grand total |

Send transactional mail through authenticated SMTP when supported. Verify From identity, SPF, DKIM, DMARC, bounce path, failed-send visibility and valid tracking links. Delivery estimates must distinguish ready-made and custom production time.

