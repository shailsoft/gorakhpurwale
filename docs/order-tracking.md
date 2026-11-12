# Courier tracking

Open Store Manager → Orders. Each order has Courier name, Tracking number and an optional HTTPS courier tracking link. Save tracking, then update the order status as fulfilment progresses. Admins and staff may update these details. Clearing courier name, number and link removes the displayed tracking details; updates are retained in the order's tracking history.

Customers open Profile → My Orders to see courier, tracking number, current status and timestamped status history. The open order list checks the server every 5 seconds, on returning to the tab and after reconnecting. Customers can also tap Refresh. The update indicator shows successful checks or a connection problem; expired sessions require login. Links open the courier website. Automatic courier webhook/API synchronization is not connected; the store updates statuses manually.

Customer server responses are held separately from the manager's order list and never replaced with saved browser snapshots. Requests are uncached and overlapping responses cannot overwrite data after an account change. Closing My Orders stops its timer. Local preview reloads order storage on refresh and receives changes from other tabs. Older account identifiers (login email/mobile) remain supported for orders created before stable account IDs; no delivery-phone matching is used to grant order access. Shared file locks prevent reads during a partially written order update.

Existing orders require no migration. Optional fields are added only when tracking is saved. Tracking and status changes use locked read/write operations so simultaneous updates and new orders do not overwrite shipment details.

Product details have a delivery PIN check. Unsupported areas show “Delivery is not available in this area” and disable Add to bag after that check. Supported PINs show the area and charge. Checkout independently rechecks coverage. Product stock is checked separately from geographic serviceability. All active products use the store's configured delivery areas.

Tests: `node tests/customer-order-sync.mjs`, `node tests/tracking-and-product-area.mjs` and `node tests/server-tracking.mjs` (admin credentials via hidden standard input for live verification; it does not change orders).
