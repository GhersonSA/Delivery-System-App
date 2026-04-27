# Kiosk Mobile

This folder now includes a runnable Expo app for kiosk ordering.

## Included

- Zustand cart store with actions:
  - `addItem`
  - `removeItem`
  - `clearCart`
- Order submit flow to backend (`POST /api/orders`)
- Ticket print attempted after successful order creation
- TanStack Query mutation hook (`useSubmitOrder`)
- Product list fetch from backend (`GET /api/products`)
- App UI to add products to cart and send orders

## Run App

```bash
npm install
npm run start
```

Then open Android/iOS simulator from Expo, or scan the QR in Expo Go.

## Backend URL

Default mobile URL is Android emulator friendly:

- `http://10.0.2.2:3001`

Override with env var when using real device:

- `EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3001`

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
