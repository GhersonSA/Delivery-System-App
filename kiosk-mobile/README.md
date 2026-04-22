# Kiosk Mobile

This folder contains the React Native kiosk logic for Delivery System App.

## Included

- Zustand cart store with actions:
  - `addItem`
  - `removeItem`
  - `clearCart`
- Order submit flow to backend (`POST /api/orders`)
- Ticket print triggered after successful order creation
- TanStack Query mutation hook (`useSubmitOrder`)

## Phase 5 ESC/POS (TP510UB 80mm)

`printTicket()` now builds raw ESC/POS bytes and sends them through a bluetooth transport.

Implemented format:

- Bold title
- Product list with quantity and subtotal
- Large order code at the end

Printer integration now uses `react-native-bluetooth-escpos-printer`.

TP510UB connection flow implemented:

- Enables bluetooth
- Reads paired devices
- Resolves device by name hint `TP510UB` or explicit MAC address
- Connects and prints raw ESC/POS payload

If your native bridge exposes different method names, adapt only:

- `src/services/escpos/tp510ub.bluetooth.ts`

## Pairing checklist (TP510UB)

- Pair TP510UB in Android bluetooth settings first
- Keep printer powered and discoverable
- Ensure your app has bluetooth permissions in AndroidManifest
- If multiple TP printers exist, set a fixed MAC in transport config

## Quick usage

```ts
import { useSubmitOrder } from './src/hooks/useSubmitOrder';
import { useCartStore } from './src/store/cart.store';

const addItem = useCartStore((state) => state.addItem);
const submitOrderMutation = useSubmitOrder();

addItem({ productId: 'prod_1', name: 'Big Burger', unitPrice: 45.5 });

await submitOrderMutation.mutateAsync();
```

## API URL

Set one of these env vars in your RN app:

- `EXPO_PUBLIC_API_URL`
- `REACT_NATIVE_API_URL`

Default: `http://localhost:3000`
