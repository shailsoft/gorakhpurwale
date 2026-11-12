# Deploy the storefront update in Plesk

The update is ready for review in `deployment/gw-order-requests-v16.zip`. It contains four application files.

1. Unzip the package on your computer.
2. Sign in to Plesk. Open **Websites & Domains → gorakhpurwale.com → File Manager → httpdocs**. [Plesk File Manager instructions](https://docs.plesk.com/en-US/obsidian/customer-guide/quick-start-with-plesk/set-up-your-first-website/1-create-your-site/uploading-content/uploading-content-with-file-manager.74105/)
3. Download the four current files listed below to a local backup folder. Keep their folder paths so you can restore them.
4. In each destination folder, use **Add New → Upload File**. Select the matching unzipped file and approve replacement. Upload in the order shown so the PHP endpoint and assets are in place before the homepage references them.

| Upload file | Destination under `httpdocs` |
| --- | --- |
| `api/store.php` | `api/` |
| `wp-content/themes/gw-store/assets/css/store.css` | `wp-content/themes/gw-store/assets/css/` |
| `wp-content/themes/gw-store/assets/js/store.js` | `wp-content/themes/gw-store/assets/js/` |
| `index.html` | `httpdocs` itself |

Keep the ZIP on your computer because it contains PHP source. Leave `private-data/` in place. It holds the live products, users, orders, and delivery areas.

Open the live store in a private browser window and check a product tile, the Support and Custom design links, and the registration form. Sign in to verify checkout and My Orders. In **Store manager → Orders**, open an order with a request to see the review controls. The release smoke test in `tests/release-smoke.mjs` checks the deployed assets and access protection without creating live records.

For a layout rollback, upload the three previous frontend files to their original folders. If the API needs a rollback after customers have registered with email, preserve the new account ownership check in `order_belongs_to_user`. It keeps newly registered addresses from matching legacy orders. Keep the current `private-data/` files so new orders and account changes are retained.

## Handle an order request

- **Cancellation** is available before dispatch. Review the reason in **Store manager → Orders**. Approval marks the order **Cancelled**.
- **Return or replacement** is available after delivery. Add a customer update when arranging pickup or replacement. Mark it **Completed** once handled. Completing a return marks the order **Returned**.
- **Decline** requires an explanation. The customer sees your decision and note in **My orders**.

Requests apply to the whole order. Arrange pickups, replacements, and any refund with the customer. Update available stock in the product editor after confirming which items can be resold.
