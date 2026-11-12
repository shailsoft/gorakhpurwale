# Online payment demo

At checkout choose **UPI / Card / Netbanking — Demo**, then **Continue to payment demo**. Select a simulated method and try **Simulate successful payment**, **Simulate failed payment**, or **Cancel demo**. There are no card, UPI ID, bank, PIN or OTP fields and no external payment service is called.

Failure/cancellation creates no order and retains the bag. Success saves a clearly marked **DEMO-…** confirmation in the authenticated customer's My Orders and the manager's order list. Amount collected is always ₹0. Demo records cannot be dispatched or assigned courier tracking, do not deduct/reserve stock and are excluded from real-order/revenue overview totals. The bag remains available for a genuine COD order.

The server derives the demo flag/status from the explicit `online-demo` payment method. Client-supplied Paid/amount/fulfillment flags are ignored. Account-scoped attempt IDs make retries idempotent, including concurrent requests from separate login sessions. Normal COD price, PIN, stock and login checks remain in place.

Tests: `node tests/demo-payment.mjs` and `node tests/server-demo-payment.mjs` (isolated QA server only, credentials via hidden stdin). Existing checkout and customer-order tests are retained. A real payment gateway needs its own server integration and verified gateway events before any real paid status can be enabled.

Verification: all 8 demo server checks and all 18 shopping/admin regression checks passed. The browser verified failed, retry, cancel and successful netbanking-demo paths, then displayed the saved demo in My Orders with ₹0 collected and no delivery. A 390 × 844 layout check found no page overflow. Screenshots are in `deployment/payment-demo-screen.png`, `deployment/payment-demo-success.png` and `deployment/payment-demo-mobile.png`. No production test customers or orders were required.

Release `deployment/gw-payment-demo-v13.zip` was deployed successfully. Production HTML/JS/CSS match the tested files. Live checks confirmed the demo validation paths, zero production order/stock changes, authenticated legacy URLs and private-file protection. The isolated preview scopes only storage keys so demo UI class names and styling remain identical to production.

The temporary QA store, its three upload packages and the production upload archive were moved to protected private storage. The live checkout option was verified enabled. Existing customers, orders, products and stock were preserved. No commit or push was made.
