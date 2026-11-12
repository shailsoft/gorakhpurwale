<?php
declare(strict_types=1);

// Pure delivery rules: no customer data or storage access.
function gw_delivery_clean_areas(array $areas): array {
    if (count($areas) > 500) throw new InvalidArgumentException('Maximum 500 delivery areas.');
    $result = []; $used = [];
    foreach ($areas as $area) {
        if (!is_array($area)) throw new InvalidArgumentException('Invalid delivery area.');
        $name = trim((string) ($area['name'] ?? ''));
        $pins = $area['pincodes'] ?? [];
        if ($name === '' || !is_array($pins) || !$pins || count($pins) > 1000) throw new InvalidArgumentException('Each area needs a name and at least one PIN code.');
        $cleanPins = [];
        foreach ($pins as $pin) {
            $pin = trim((string) $pin);
            if (!preg_match('/^[1-9][0-9]{5}$/', $pin)) throw new InvalidArgumentException('Enter complete six-digit PIN codes. Ranges and wildcards are not allowed.');
            if (isset($used[$pin])) throw new InvalidArgumentException('PIN ' . $pin . ' is already assigned to another area or repeated.');
            $used[$pin] = true; $cleanPins[] = $pin;
        }
        foreach (['fee', 'freeAbove'] as $field) {
            if (!isset($area[$field]) || !is_numeric($area[$field]) || !is_finite((float) $area[$field]) || (float) $area[$field] < 0 || (float) $area[$field] > 999999) throw new InvalidArgumentException('Enter valid delivery charges and free-delivery threshold.');
        }
        $result[] = [
            'name' => mb_substr($name, 0, 100), 'pincodes' => $cleanPins,
            'city' => mb_substr(trim((string) ($area['city'] ?? '')), 0, 100),
            'state' => mb_substr(trim((string) ($area['state'] ?? '')), 0, 100),
            'eta' => mb_substr(trim((string) ($area['eta'] ?? 'Confirmed before dispatch')), 0, 120),
            'fee' => round((float) $area['fee'], 2), 'freeAbove' => round((float) $area['freeAbove'], 2),
            'active' => ($area['active'] ?? false) === true,
        ];
    }
    return $result;
}

function gw_delivery_quote(array $areas, string $pin, float $subtotal): array {
    if (!preg_match('/^[1-9][0-9]{5}$/', $pin)) return ['eligible' => false, 'message' => 'Enter a valid six-digit PIN code.'];
    foreach ($areas as $area) {
        if (empty($area['active']) || !in_array($pin, $area['pincodes'], true)) continue;
        $fee = ($subtotal > 0 && $area['freeAbove'] > 0 && $subtotal >= $area['freeAbove']) ? 0 : $area['fee'];
        return ['eligible' => true, 'pincode' => $pin, 'area' => $area['name'], 'city' => $area['city'], 'state' => $area['state'], 'eta' => $area['eta'], 'shipping' => $fee, 'freeAbove' => $area['freeAbove'], 'message' => 'Delivery available in ' . $area['name'] . '.'];
    }
    $active = array_filter($areas, fn($area) => !empty($area['active']));
    return ['eligible' => false, 'message' => $active ? 'Delivery is not available in this area yet. Please use another delivery address.' : 'Delivery areas are being set up. Ordering is temporarily unavailable.'];
}
