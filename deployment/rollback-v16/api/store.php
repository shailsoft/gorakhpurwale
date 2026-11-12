<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store, no-cache, max-age=0, must-revalidate');
header('Pragma: no-cache');

$secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();
require_once __DIR__ . '/delivery.php';
require_once __DIR__ . '/inventory.php';

const OWNER_EMAIL = 'admin@gorakhpurwale.com';
const OWNER_SALT_B64 = 'R1dTdG9yZUFkbWluMjAyNiE=';
const OWNER_HASH_B64 = 'lE7x8QiFVIJwAAJCw6uiore0MdrCH/XVmoMxLLRT0c0=';
const ORDER_STATUSES = ['Received', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'];

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function text_value(mixed $value, int $max = 180): string {
    $value = trim((string) $value);
    return mb_substr($value, 0, $max);
}

function orders_file(): string {
    $directory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private-data';
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        respond(500, ['ok' => false, 'error' => 'Order storage is unavailable.']);
    }
    return $directory . DIRECTORY_SEPARATOR . 'orders.json';
}

function products_file(): string {
    $directory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'private-data';
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        respond(500, ['ok' => false, 'error' => 'Catalog storage is unavailable.']);
    }
    return $directory . DIRECTORY_SEPARATOR . 'products.json';
}

function load_products(): array {
    $file = products_file();
    if (!is_file($file)) return [];
    $handle = fopen($file, 'r');
    if (!$handle || !flock($handle, LOCK_SH)) respond(503, ['ok' => false, 'error' => 'Catalog unavailable. Please refresh.']);
    $raw = stream_get_contents($handle);flock($handle, LOCK_UN);fclose($handle);
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) respond(503, ['ok' => false, 'error' => 'Catalog unavailable. Please refresh.']);
    return $decoded;
}

function save_products(array $products): void {
    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || file_put_contents(products_file(), $json, LOCK_EX) === false) {
        respond(500, ['ok' => false, 'error' => 'Could not save the catalog.']);
    }
}

function delivery_settings(): array {
    $file = dirname(products_file()) . DIRECTORY_SEPARATOR . 'delivery-areas.json';
    if (!is_file($file)) return ['revision' => 0, 'areas' => []];
    $data = json_decode((string) file_get_contents($file), true);
    if (!is_array($data) || !isset($data['revision'], $data['areas']) || !is_array($data['areas'])) respond(503, ['ok' => false, 'error' => 'Delivery settings unavailable. Please try again later.']);
    return $data;
}

function clean_product(array $product): array {
    $allowed_categories = ['Essential', 'Oversized', 'Graphic', 'Custom', 'Beauty', 'Gift'];
    $allowed_colours = ['Black', 'White', 'Blue', 'Coral', 'Sage'];
    $allowed_audiences = ['Men', 'Women', 'Kids', 'GenZ'];
    $allowed_sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    $images = [];
    foreach (array_slice(is_array($product['images'] ?? null) ? $product['images'] : [], 0, 5) as $image) {
        $image = (string) $image;
        if (strlen($image) <= 1600000 && preg_match('#^data:image/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$#', $image)) $images[] = $image;
    }
    $category = text_value($product['category'] ?? 'Essential', 30);
    $colour = text_value($product['colour'] ?? 'Black', 20);
    return [
        'id' => preg_replace('/[^a-zA-Z0-9_-]/', '', text_value($product['id'] ?? '', 100)),
        'name' => text_value($product['name'] ?? '', 80),
        'category' => in_array($category, $allowed_categories, true) ? $category : 'Essential',
        'colour' => in_array($colour, $allowed_colours, true) ? $colour : 'Black',
        'price' => max(1, min(999999, (float) ($product['price'] ?? 1))),
        'mrp' => max(0, min(999999, (float) ($product['mrp'] ?? 0))),
        'stock' => max(0, min(999999, (int) ($product['stock'] ?? 0))),
        'status' => in_array(($product['status'] ?? ''), ['active', 'draft', 'inactive'], true) ? $product['status'] : 'active',
        'audiences' => array_values(array_intersect($allowed_audiences, is_array($product['audiences'] ?? null) ? $product['audiences'] : [])),
        'sizes' => array_values(array_filter(array_map(fn($value) => text_value($value, 50), array_slice(is_array($product['sizes'] ?? null) ? $product['sizes'] : ['Standard'], 0, 30)))),
        'description' => text_value($product['description'] ?? '', 300),
        'tags' => text_value($product['tags'] ?? '', 200),
        'shirt' => text_value($product['shirt'] ?? '#172335', 20),
        'print' => text_value($product['print'] ?? '#ffffff', 20),
        'motif' => text_value($product['motif'] ?? '', 30),
        'badge' => text_value($product['badge'] ?? 'New', 30),
        'art' => array_slice(is_array($product['art'] ?? null) ? $product['art'] : [], 0, 2),
        'images' => $images,
        'variants' => array_slice(is_array($product['variants'] ?? null) ? $product['variants'] : [], 0, 30),
        'customizable' => !empty($product['customizable']),
    ];
}

function load_orders(): array {
    $file = orders_file();
    if (!is_file($file)) return [];
    $handle = fopen($file, 'r');
    if (!$handle || !flock($handle, LOCK_SH)) respond(503, ['ok' => false, 'error' => 'Order storage unavailable. Please refresh.']);
    $raw = stream_get_contents($handle);flock($handle, LOCK_UN);fclose($handle);
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) respond(503, ['ok' => false, 'error' => 'Orders could not be loaded. Please refresh.']);
    return $decoded;
}

function save_orders(array $orders): void {
    $json = json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || file_put_contents(orders_file(), $json, LOCK_EX) === false) {
        respond(500, ['ok' => false, 'error' => 'Could not save the order.']);
    }
}

function append_order(array $order): void {
    $handle = fopen(orders_file(), 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) respond(503, ['ok' => false, 'error' => 'Order storage unavailable.']);
    $raw = stream_get_contents($handle); $orders = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($orders)) { flock($handle, LOCK_UN); fclose($handle); respond(503, ['ok' => false, 'error' => 'Order storage requires attention.']); }
    array_unshift($orders, $order);
    $json = json_encode(array_slice($orders, 0, 5000), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) { flock($handle, LOCK_UN); fclose($handle); respond(500, ['ok' => false, 'error' => 'Invalid order data.']); }
    rewind($handle); ftruncate($handle, 0); $written = fwrite($handle, $json); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
    if ($written !== strlen($json)) respond(500, ['ok' => false, 'error' => 'Could not save the order.']);
}

function update_order(string $id, callable $update): array {
    $handle = fopen(orders_file(), 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) respond(503, ['ok' => false, 'error' => 'Order storage unavailable.']);
    $raw = stream_get_contents($handle); $orders = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($orders)) { flock($handle, LOCK_UN); fclose($handle); respond(503, ['ok' => false, 'error' => 'Order storage requires attention.']); }
    $updated = null;
    foreach ($orders as &$order) {
        if (($order['id'] ?? '') === $id) { $order = $update($order); $updated = $order; break; }
    }
    unset($order);
    if (!$updated) { flock($handle, LOCK_UN); fclose($handle); respond(404, ['ok' => false, 'error' => 'Order not found.']); }
    $json = json_encode($orders, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) { flock($handle, LOCK_UN); fclose($handle); respond(500, ['ok' => false, 'error' => 'Invalid order data.']); }
    rewind($handle); ftruncate($handle, 0); $written = fwrite($handle, $json); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
    if ($written !== strlen($json)) respond(500, ['ok' => false, 'error' => 'Could not save order changes.']);
    return $updated;
}

function request_json(): array {
    $decoded = json_decode((string) file_get_contents('php://input'), true);
    return is_array($decoded) ? $decoded : [];
}

function require_owner(): void {
    $user = session_user();
    if (!$user || !in_array($user['role'], ['admin', 'staff'], true)) respond(401, ['ok' => false, 'error' => 'Please log in again with an administrator or staff account.']);
}

function users_file(): string { return dirname(products_file()) . DIRECTORY_SEPARATOR . 'users.json'; }
function load_users(): array {
    if (!is_file(users_file())) {
        $users = [['name' => 'GW Store Admin', 'email' => OWNER_EMAIL, 'role' => 'admin', 'salt' => OWNER_SALT_B64, 'hash' => OWNER_HASH_B64]];
        save_users($users);
        return $users;
    }
    return json_decode((string) file_get_contents(users_file()), true) ?: [];
}
function save_users(array $users): void {
    if (file_put_contents(users_file(), json_encode($users, JSON_PRETTY_PRINT), LOCK_EX) === false) respond(500, ['ok' => false, 'error' => 'Account storage unavailable.']);
}
function normalize_mobile(string $value): string {
    $digits = preg_replace('/[^0-9]/', '', $value);
    if (strlen($digits) === 12 && str_starts_with($digits, '91')) $digits = substr($digits, 2);
    return $digits;
}
function user_identity(array $user): string { return (string) ($user['id'] ?? ($user['email'] ?: ($user['phone'] ?? ''))); }
function public_user(array $user): array { return ['id' => user_identity($user), 'name' => $user['name'], 'email' => $user['email'] ?? '', 'phone' => $user['phone'] ?? '', 'role' => $user['role']]; }
function order_belongs_to_user(array $order, array $user): bool {
    $identity = user_identity($user);
    $account = trim((string) ($order['accountId'] ?? ''));
    $email = strtolower(trim((string) ($user['email'] ?? '')));
    // Older releases stored the login email/mobile as accountId, before stable IDs were added.
    if ($account !== '') return $account === $identity || ($email !== '' && strtolower($account) === $email) || (!empty($user['phone']) && $account === $user['phone']);
    return $email !== '' && strtolower(trim((string) ($order['email'] ?? ''))) === $email;
}
function session_user(): ?array {
    if (($_SESSION['gw_auth_version'] ?? '') !== 'server-users-v1') return null;
    foreach (load_users() as $user) if (user_identity($user) === ($_SESSION['gw_email'] ?? '')) return $user;
    return null;
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$action = text_value($_GET['action'] ?? '', 30);

if ($method === 'GET' && $action === 'health') {
    respond(200, ['ok' => true, 'service' => 'gw-store', 'version' => 'server-users-v1']);
}

if ($method === 'GET' && $action === 'session') { $user = session_user(); respond(200, ['ok' => true, 'user' => $user ? public_user($user) : null]); }
if ($method === 'GET' && $action === 'users') {
    require_owner();
    if (session_user()['role'] !== 'admin') respond(403, ['ok' => false, 'error' => 'Administrator required.']);
    respond(200, ['ok' => true, 'users' => array_map('public_user', load_users())]);
}
if ($method === 'GET' && $action === 'my-orders') {
    $user = session_user();
    if (!$user) respond(401, ['ok' => false, 'error' => 'Please log in.']);
    respond(200, ['ok' => true, 'user' => public_user($user), 'orders' => array_values(array_filter(load_orders(), fn($order) => order_belongs_to_user($order, $user)))]);
}

if ($method === 'GET' && $action === 'list') {
    require_owner();
    respond(200, ['ok' => true, 'orders' => load_orders()]);
}

if ($method === 'GET' && $action === 'catalog') {
    respond(200, ['ok' => true, 'products' => load_products()]);
}

if ($method === 'GET' && $action === 'delivery-settings') {
    require_owner(); respond(200, ['ok' => true, 'settings' => delivery_settings()]);
}
if ($method === 'GET' && $action === 'delivery-check') {
    $settings = delivery_settings();
    $pin = trim((string) ($_GET['pincode'] ?? ''));
    $subtotal = max(0, min(99999999, (float) ($_GET['subtotal'] ?? 0)));
    respond(200, ['ok' => true, 'quote' => gw_delivery_quote($settings['areas'], $pin, $subtotal)]);
}

if ($method === 'GET' && $action === 'order-status') {
    $id = text_value($_GET['id'] ?? '', 80);
    $token = text_value($_GET['token'] ?? '', 100);
    foreach (load_orders() as $order) {
        if (($order['id'] ?? '') === $id && $token !== '' && hash_equals((string) ($order['accessToken'] ?? ''), $token)) {
            respond(200, ['ok' => true, 'order' => ['id' => $order['id'], 'status' => $order['status'], 'statusHistory' => $order['statusHistory'] ?? [], 'updatedAt' => $order['updatedAt'] ?? $order['createdAt'], 'courierName' => $order['courierName'] ?? '', 'trackingNumber' => $order['trackingNumber'] ?? '', 'trackingUrl' => $order['trackingUrl'] ?? '', 'trackingUpdatedAt' => $order['trackingUpdatedAt'] ?? null]]);
        }
    }
    respond(404, ['ok' => false, 'error' => 'Order not found.']);
}

if ($method !== 'POST') respond(405, ['ok' => false, 'error' => 'Method not allowed.']);

$input = request_json();
$action = text_value($input['action'] ?? $action, 30);

if ($action === 'login') {
    $identifier = strtolower(text_value($input['identifier'] ?? $input['email'] ?? '', 180));
    $mobile = normalize_mobile($identifier);
    $password = (string) ($input['password'] ?? '');
    $found = null;
    foreach (load_users() as $user) if ((!empty($user['email']) && $user['email'] === $identifier) || (preg_match('/^[6-9][0-9]{9}$/', $mobile) && ($user['phone'] ?? '') === $mobile)) $found = $user;
    $salt = base64_decode($found['salt'] ?? OWNER_SALT_B64, true);
    $expected = base64_decode($found['hash'] ?? OWNER_HASH_B64, true);
    $derived = $salt === false ? false : hash_pbkdf2('sha256', $password, $salt, 100000, 32, true);
    if (!$found || $derived === false || $expected === false || !hash_equals($expected, $derived)) {
        respond(401, ['ok' => false, 'error' => 'Incorrect owner credentials.']);
    }
    session_regenerate_id(true);
    $_SESSION['gw_email'] = user_identity($found);
    $_SESSION['gw_auth_version'] = 'server-users-v1';
    respond(200, ['ok' => true, 'user' => public_user($found)]);
}

if ($action === 'register' || $action === 'user-create') {
    if ($action === 'user-create') { require_owner(); if (session_user()['role'] !== 'admin') respond(403, ['ok' => false, 'error' => 'Administrator required.']); }
    $email = $action === 'register' ? '' : strtolower(text_value($input['email'] ?? ''));
    $phone = normalize_mobile(text_value($input['phone'] ?? '', 30));
    $name = text_value($input['name'] ?? '', 100);
    $password = (string) ($input['password'] ?? '');
    if ($action === 'register' && !preg_match('/^[6-9][0-9]{9}$/', $phone)) respond(422, ['ok' => false, 'error' => 'Enter a valid 10-digit Indian mobile number.']);
    if ($email === '' && $phone === '') respond(422, ['ok' => false, 'error' => 'Enter an email address or mobile number.']);
    if (($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) || ($phone !== '' && !preg_match('/^[6-9][0-9]{9}$/', $phone)) || strlen($password) < 8 || strlen($name) < 2) respond(422, ['ok' => false, 'error' => 'Enter a name, valid email/mobile and password of at least 8 characters.']);
    $users = load_users();
    foreach ($users as $user) if (($email !== '' && $user['email'] === $email) || ($phone !== '' && ($user['phone'] ?? '') === $phone)) respond(409, ['ok' => false, 'error' => 'Email or mobile number already registered.']);
    $role = $action === 'register' ? 'shopper' : ($input['role'] ?? 'shopper');
    if (!in_array($role, ['admin', 'staff', 'shopper'], true)) respond(422, ['ok' => false, 'error' => 'Invalid role.']);
    $salt = random_bytes(16);
    $user = ['id' => bin2hex(random_bytes(16)), 'name' => $name, 'email' => $email, 'phone' => $phone, 'role' => $role, 'salt' => base64_encode($salt), 'hash' => base64_encode(hash_pbkdf2('sha256', $password, $salt, 100000, 32, true))];
    $users[] = $user; save_users($users);
    if ($action === 'register') { session_regenerate_id(true); $_SESSION['gw_email'] = user_identity($user); $_SESSION['gw_auth_version'] = 'server-users-v1'; }
    respond(201, ['ok' => true, 'user' => public_user($user)]);
}

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    respond(200, ['ok' => true]);
}

if ($action === 'delivery-save') {
    require_owner();
    if (session_user()['role'] !== 'admin') respond(403, ['ok' => false, 'error' => 'Only administrators can change delivery areas.']);
    if (!is_array($input['areas'] ?? null)) respond(422, ['ok' => false, 'error' => 'Invalid delivery areas.']);
    try { $areas = gw_delivery_clean_areas($input['areas']); } catch (InvalidArgumentException $error) { respond(422, ['ok' => false, 'error' => $error->getMessage()]); }
    $previous = delivery_settings();
    if ((int) ($input['revision'] ?? -1) !== (int) $previous['revision']) respond(409, ['ok' => false, 'error' => 'Delivery areas changed in another session. Reload this screen before saving.']);
    $file = dirname(products_file()) . DIRECTORY_SEPARATOR . 'delivery-areas.json';
    $handle = fopen($file, 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) respond(503, ['ok' => false, 'error' => 'Delivery settings unavailable.']);
    $current = json_decode(stream_get_contents($handle), true) ?: ['revision' => 0, 'areas' => []];
    if ((int) ($input['revision'] ?? -1) !== (int) $current['revision']) { flock($handle, LOCK_UN); fclose($handle); respond(409, ['ok' => false, 'error' => 'Delivery areas changed in another session. Reload this screen before saving.']); }
    $settings = ['revision' => $current['revision'] + 1, 'areas' => $areas, 'updatedAt' => gmdate('c')];
    $json = json_encode($settings, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    rewind($handle); ftruncate($handle, 0); $written = fwrite($handle, $json); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
    if ($written !== strlen($json)) respond(500, ['ok' => false, 'error' => 'Could not save delivery settings.']);
    respond(200, ['ok' => true, 'settings' => $settings]);
}

if ($action === 'product-save') {
    require_owner();
    if (!is_array($input['product'] ?? null)) respond(422, ['ok' => false, 'error' => 'Invalid product.']);
    $product = clean_product($input['product']);
    if ($product['id'] === '' || $product['name'] === '' || !$product['audiences'] || !$product['sizes']) respond(422, ['ok' => false, 'error' => 'Enter product name, audience and variations.']);
    $handle = fopen(products_file(), 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) respond(500, ['ok' => false, 'error' => 'Catalog is unavailable.']);
    $products = json_decode(stream_get_contents($handle), true) ?: [];
    $found = false;
    foreach ($products as &$existing) if ($existing['id'] === $product['id']) { $existing = $product; $found = true; break; }
    unset($existing);
    if (!$found) array_unshift($products, $product);
    $json = json_encode($products, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) { flock($handle, LOCK_UN); fclose($handle); respond(500, ['ok' => false, 'error' => 'Invalid product data.']); }
    rewind($handle); ftruncate($handle, 0); $written = fwrite($handle, $json); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
    if ($written !== strlen($json)) respond(500, ['ok' => false, 'error' => 'Catalog write failed.']);
    respond(200, ['ok' => true, 'products' => $products]);
}

if ($action === 'catalog-save') {
    require_owner();
    if (!is_array($input['products'] ?? null)) respond(422, ['ok' => false, 'error' => 'Invalid catalog.']);
    $products = [];
    foreach (array_slice($input['products'], 0, 500) as $product) {
        if (!is_array($product)) continue;
        $clean = clean_product($product);
        if ($clean['id'] === '' || $clean['name'] === '' || !$clean['audiences'] || !$clean['sizes']) respond(422, ['ok' => false, 'error' => 'Product requires a name, audience and variation: ' . $clean['name']]);
        $products[] = $clean;
    }
    if (!$products) respond(422, ['ok' => false, 'error' => 'The catalog cannot be empty.']);
    save_products($products);
    respond(200, ['ok' => true, 'products' => $products]);
}

if ($action === 'create') {
    $customer = session_user();
    if (!$customer) respond(401, ['ok' => false, 'error' => 'Please log in or create an account before placing your order.']);
    $required = ['customerName', 'phone', 'address', 'city', 'state', 'pincode', 'items'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === '' || ($field === 'items' && !is_array($input[$field]))) {
            respond(422, ['ok' => false, 'error' => 'Please complete all delivery details.']);
        }
    }
    $checkoutEmail = strtolower(text_value($input['email'] ?? '', 180));
    if ($checkoutEmail !== '' && !filter_var($checkoutEmail, FILTER_VALIDATE_EMAIL)) respond(422, ['ok' => false, 'error' => 'Enter a valid email address or leave it blank.']);
    $phone = normalize_mobile(text_value($input['phone'], 30));
    if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) respond(422, ['ok' => false, 'error' => 'Enter a valid 10-digit Indian delivery mobile number.']);
    $payment = (string) ($input['payment'] ?? 'cod');
    if (!in_array($payment, ['cod', 'online-demo'], true)) respond(422, ['ok' => false, 'error' => 'Choose cash on delivery or the clearly marked online payment demo.']);
    $isDemo = $payment === 'online-demo';
    $attemptId = '';$demoMethod = '';
    if ($isDemo) {
        if (($input['demoOutcome'] ?? '') !== 'success') respond(422, ['ok' => false, 'error' => 'The demo payment was not completed. No order or payment was created.']);
        $attemptId = text_value($input['checkoutAttemptId'] ?? '', 100);
        $demoMethod = (string) ($input['demoMethod'] ?? '');
        if (!preg_match('/^[A-Za-z0-9-]{16,80}$/', $attemptId) || !in_array($demoMethod, ['upi', 'card', 'netbanking'], true)) respond(422, ['ok' => false, 'error' => 'Start a new demo payment from checkout.']);
        foreach (load_orders() as $existing) if (!empty($existing['isDemo']) && ($existing['accountId'] ?? '') === user_identity($customer) && ($existing['checkoutAttemptId'] ?? '') === $attemptId) respond(200, ['ok' => true, 'order' => $existing]);
    }
    $settings = delivery_settings();
    $coverage = gw_delivery_quote($settings['areas'], trim((string) $input['pincode']), 0);
    if (!$coverage['eligible']) respond(422, ['ok' => false, 'code' => 'DELIVERY_UNAVAILABLE', 'error' => $coverage['message']]);
    [$catalogHandle, $previousCatalog, $products] = gw_checkout_catalog();
    try { $checked = gw_checkout_items($input['items'], $products); }
    catch (UnexpectedValueException $error) { fclose($catalogHandle);respond(409, ['ok' => false, 'code' => 'PRICE_CHANGED', 'error' => $error->getMessage()]); }
    catch (DomainException $error) { fclose($catalogHandle);respond(409, ['ok' => false, 'code' => 'STOCK_CHANGED', 'error' => $error->getMessage()]); }
    catch (InvalidArgumentException $error) { fclose($catalogHandle);respond(422, ['ok' => false, 'error' => $error->getMessage()]); }
    $items = $checked['items'];
    $calculatedSubtotal = round(array_reduce($items, fn($sum, $item) => $sum + $item['unitPrice'] * $item['quantity'], 0), 2);
    $delivery = gw_delivery_quote($settings['areas'], trim((string) $input['pincode']), $calculatedSubtotal);
    if (!$delivery['eligible']) respond(422, ['ok' => false, 'code' => 'DELIVERY_UNAVAILABLE', 'error' => $delivery['message']]);
    $order = [
        'id' => ($isDemo ? 'DEMO-' : 'GW-') . gmdate('Ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 5)),
        'createdAt' => gmdate('c'),
        'accountId' => user_identity($customer),
        'status' => $isDemo ? 'Demo only' : 'Received',
        'statusHistory' => [['status' => $isDemo ? 'Demo only' : 'Received', 'at' => gmdate('c')]],
        'accessToken' => bin2hex(random_bytes(24)),
        'customerName' => text_value($input['customerName'], 120),
        'email' => $checkoutEmail,
        'phone' => $phone,
        'address' => text_value($input['address'], 240),
        'city' => $delivery['city'] ?: text_value($input['city'], 100),
        'state' => $delivery['state'] ?: text_value($input['state'], 100),
        'pincode' => $delivery['pincode'],
        'deliveryArea' => $delivery['area'],
        'deliveryEstimate' => $delivery['eta'],
        'payment' => $payment,
        'paymentLabel' => $isDemo ? 'Online payment demo · ₹0 collected' : 'Cash on delivery',
        'paymentStatus' => $isDemo ? 'Demo success — no real payment' : 'Cash due on delivery',
        'amountCollected' => 0,
        'isDemo' => $isDemo,
        'demoMethod' => $demoMethod,
        'checkoutAttemptId' => $attemptId,
        'items' => $items,
        'subtotal' => $calculatedSubtotal,
        'shipping' => $delivery['shipping'],
        'total' => round($calculatedSubtotal + $delivery['shipping'], 2),
    ];
    $order = gw_commit_checkout($catalogHandle, $previousCatalog, $isDemo ? $products : $checked['products'], $order);
    respond(201, ['ok' => true, 'order' => $order]);
}

if ($action === 'tracking') {
    require_owner();
    $id = text_value($input['id'] ?? '', 80);
    $courier = trim((string) ($input['courierName'] ?? ''));
    $number = trim((string) ($input['trackingNumber'] ?? ''));
    $url = trim((string) ($input['trackingUrl'] ?? ''));
    if (($courier === '') !== ($number === '') || mb_strlen($courier) > 100 || mb_strlen($number) > 100 || ($number !== '' && !preg_match('/^[A-Za-z0-9][A-Za-z0-9 _\/.\-]{0,99}$/', $number))) respond(422, ['ok' => false, 'error' => 'Enter both a courier name and a valid tracking number (maximum 100 characters).']);
    if ($url !== '' && ($number === '' || strlen($url) > 2000 || !filter_var($url, FILTER_VALIDATE_URL) || strtolower((string) parse_url($url, PHP_URL_SCHEME)) !== 'https' || parse_url($url, PHP_URL_USER) !== null || parse_url($url, PHP_URL_PASS) !== null)) respond(422, ['ok' => false, 'error' => 'Use a valid HTTPS tracking link without embedded login details.']);
    $order = update_order($id, function(array $order) use ($courier, $number, $url): array {
        if (!empty($order['isDemo'])) respond(409, ['ok' => false, 'code' => 'DEMO_ORDER', 'error' => 'Demo orders cannot be dispatched. No real payment was collected.']);
        $order['courierName'] = $courier; $order['trackingNumber'] = $number; $order['trackingUrl'] = $url;
        $order['trackingUpdatedAt'] = gmdate('c'); $order['updatedAt'] = $order['trackingUpdatedAt'];
        $order['trackingHistory'][] = ['at' => $order['trackingUpdatedAt'], 'courierName' => $courier, 'trackingNumber' => $number, 'trackingUrl' => $url];
        return $order;
    });
    respond(200, ['ok' => true, 'order' => $order]);
}

if ($action === 'status') {
    require_owner();
    $id = text_value($input['id'] ?? '', 80);
    $status = text_value($input['status'] ?? '', 30);
    if (!in_array($status, ORDER_STATUSES, true)) respond(422, ['ok' => false, 'error' => 'Invalid order status.']);
    $order = update_order($id, function(array $order) use ($status): array {
        if (!empty($order['isDemo'])) respond(409, ['ok' => false, 'code' => 'DEMO_ORDER', 'error' => 'Demo orders cannot be dispatched. No real payment was collected.']);
        if ($order['status'] !== $status) {
            $order['status'] = $status; $order['updatedAt'] = gmdate('c');
            if (!is_array($order['statusHistory'] ?? null)) $order['statusHistory'] = [];
            $order['statusHistory'][] = ['status' => $status, 'at' => $order['updatedAt']];
        }
        return $order;
    });
    respond(200, ['ok' => true, 'order' => $order]);
}

respond(400, ['ok' => false, 'error' => 'Unknown action.']);
