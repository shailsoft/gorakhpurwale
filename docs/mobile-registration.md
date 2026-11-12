# Mobile registration

Public registration requires name, Indian mobile number and a password. It does not request or store an email address supplied to the registration endpoint. Existing email logins and administrator-created accounts continue to work.

Checkout email is optional. A supplied email is validated and stored with that order; it is not used to identify the account. My Orders continues to use the authenticated account ID.

Checks: `node tests/registration-contacts.mjs` and `node tests/checkout-login.mjs`. Live checks must not create disposable customers or delivery orders in the production database.

Automatic courier synchronization still requires a selected courier/shipping service and its authenticated API or webhook connection. The existing customer order list refreshes stored statuses, but does not obtain new delivery events from a courier.
