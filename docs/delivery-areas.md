# Delivery coverage

Sign in as administrator, open **Store Manager → Delivery areas**.

Create an area with a name and exact six-digit PIN codes, separated by commas or new lines. Add city/state if every PIN belongs to that city/state; otherwise create separate areas. Set delivery fee, free-delivery threshold (0 disables the threshold), and estimated delivery time. Enable the area and save. Pause an area to stop accepting new orders there. Existing orders retain the delivery details recorded when placed.

Customers can check availability above the product collection. Checkout validates the PIN again, displays the delivery fee and prefills the configured city/state. The order API independently rechecks coverage and computes delivery charges; changing browser fields cannot enable an unserved PIN. Administrators alone can change areas; staff can view coverage.

Storage: `private-data/delivery-areas.json` is created on the first successful save. Existing products, orders and users are not migrated or erased. A revision protects against overwriting another administrator's changes. No areas are enabled by default: orders remain unavailable until the owner enters the serviceable PIN codes. No geographic permissions, external map accounts or guessed locations are used.

PIN coverage checks serviceability, not the authenticity of a street address. Confirm the full address during fulfilment. If you deliver to only part of one PIN district, do not enable that entire PIN until your operational process can handle its full coverage.

Checks: `node tests/delivery-areas.mjs`, `node tests/checkout-login.mjs`, `node tests/registration-contacts.mjs`. `node tests/server-delivery.mjs` accepts admin credentials on hidden standard input and validates live API authorization, PIN errors, revision conflicts and rejected orders without creating orders or changing coverage.
