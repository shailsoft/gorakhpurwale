<?php
declare(strict_types=1);

function gw_checkout_items(array $requested, array $catalog): array {
    if (!$requested || count($requested) > 30) throw new InvalidArgumentException('Choose between 1 and 30 order items.');
    $items = []; $positions = [];
    foreach ($catalog as $index => $product) $positions[$product['id']] = $index;
    foreach ($requested as $item) {
        if (!is_array($item)) throw new InvalidArgumentException('Invalid order item.');
        $id = (string) ($item['productId'] ?? '');
        if (!isset($positions[$id])) throw new DomainException('An item in your bag is no longer available. Please remove it.');
        $index = $positions[$id]; $product = $catalog[$index];
        if (($product['status'] ?? '') !== 'active') throw new DomainException($product['name'] . ' is currently unavailable.');
        $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
        if ($quantity === false || $quantity < 1 || $quantity > 20) throw new InvalidArgumentException('Choose a quantity between 1 and 20.');
        $size = trim((string) ($item['size'] ?? ''));
        if (!in_array($size, $product['sizes'] ?? [], true)) throw new DomainException('Choose an available variation for ' . $product['name'] . '.');
        if ($quantity > (int) ($product['stock'] ?? 0)) throw new DomainException('Not enough stock for ' . $product['name'] . '. Please update your bag.');
        $custom = is_array($item['custom'] ?? null) ? $item['custom'] : null;
        if (!empty($product['customizable']) && (!$custom || (!trim((string) ($custom['text'] ?? '')) && empty($custom['artwork']) && empty($custom['artwork_data'])))) throw new InvalidArgumentException('Add your text or artwork for ' . $product['name'] . '.');
        if ($custom && empty($product['customizable'])) throw new InvalidArgumentException('This item does not support personalization.');
        $price = round((float) $product['price'], 2);
        if ($id === 'custom-text' && $custom) $price += (($custom['surface'] ?? 'front') === 'back' ? 50 : 0) + (!empty($custom['artwork_id']) ? 50 : 0);
        if (!isset($item['unitPrice']) || !is_numeric($item['unitPrice']) || abs((float) $item['unitPrice'] - $price) > 0.009) throw new UnexpectedValueException('The price of ' . $product['name'] . ' changed. Review your updated bag before ordering.');
        $catalog[$index]['stock'] -= $quantity;
        if ($custom) unset($custom['price']);
        $items[] = ['productId' => $id, 'name' => $product['name'], 'size' => $size, 'quantity' => $quantity, 'unitPrice' => $price, 'custom' => $custom];
    }
    return ['items' => $items, 'products' => $catalog];
}

// All checkouts take the catalog lock before validating stock, and keep it until the order is stored.
function gw_checkout_catalog(): array {
    $handle = fopen(products_file(), 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) respond(503, ['ok' => false, 'error' => 'Stock is being updated. Please try again.']);
    $raw = stream_get_contents($handle);$products = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($products)) { fclose($handle); respond(503, ['ok' => false, 'error' => 'Catalog unavailable. Please try again.']); }
    return [$handle, $raw, $products];
}

function gw_commit_checkout($catalogHandle, string $previousCatalog, array $products, array $order): array {
    $handle = fopen(orders_file(), 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) { fclose($catalogHandle); respond(503, ['ok' => false, 'error' => 'Order storage unavailable.']); }
    $raw = stream_get_contents($handle); $orders = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($orders)) { fclose($handle);fclose($catalogHandle);respond(503, ['ok' => false, 'error' => 'Orders unavailable. Please try again.']); }
    if (!empty($order['isDemo']) && !empty($order['checkoutAttemptId'])) {
        foreach ($orders as $existing) {
            if (!empty($existing['isDemo']) && ($existing['accountId'] ?? '') === $order['accountId'] && ($existing['checkoutAttemptId'] ?? '') === $order['checkoutAttemptId']) {
                flock($handle, LOCK_UN);fclose($handle);flock($catalogHandle, LOCK_UN);fclose($catalogHandle);return $existing;
            }
        }
    }
    array_unshift($orders, $order);
    $catalogJson = json_encode($products, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $ordersJson = json_encode($orders, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($catalogJson === false || $ordersJson === false) { fclose($handle);fclose($catalogHandle);respond(422, ['ok' => false, 'error' => 'Invalid order data.']); }
    rewind($catalogHandle);$catalogOk = ftruncate($catalogHandle, 0) && fwrite($catalogHandle, $catalogJson) === strlen($catalogJson) && fflush($catalogHandle);
    $orderOk = false;
    if ($catalogOk) { rewind($handle);$orderOk = ftruncate($handle, 0) && fwrite($handle, $ordersJson) === strlen($ordersJson) && fflush($handle); }
    if (!$catalogOk || !$orderOk) {
        rewind($catalogHandle);ftruncate($catalogHandle, 0);fwrite($catalogHandle, $previousCatalog);fflush($catalogHandle);
        if ($catalogOk) { rewind($handle);ftruncate($handle, 0);fwrite($handle, $raw);fflush($handle); }
    }
    flock($handle, LOCK_UN);fclose($handle);flock($catalogHandle, LOCK_UN);fclose($catalogHandle);
    if (!$catalogOk || !$orderOk) respond(503, ['ok' => false, 'error' => 'Your order could not be saved. Please try again.']);
    return $order;
}
