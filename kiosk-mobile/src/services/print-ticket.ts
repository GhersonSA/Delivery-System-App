import { CartItem, OrderResponse } from '../types/order';
import { EscPosBuilder } from './escpos/commands';
import { Tp510ubBluetoothTransport } from './escpos/tp510ub.bluetooth';
import { EscPosTransport } from './escpos/types';

export interface PrintTicketInput {
  order: OrderResponse;
  cartItems: CartItem[];
}

function toMoney(value: number): string {
  return value.toFixed(2);
}

function shortCode(orderId: string): string {
  return orderId.slice(-6).toUpperCase();
}

function renderItemLine(item: CartItem): string {
  const name = item.name.slice(0, 24);
  const qty = `x${item.quantity}`.padEnd(4, ' ');
  const subtotal = toMoney(item.unitPrice * item.quantity).padStart(9, ' ');
  return `${qty}${name}${subtotal}`;
}

function buildTicketPayload(input: PrintTicketInput): Uint8Array {
  const total = Number(input.order.total);

  const builder = new EscPosBuilder();
  builder
    .init()
    .align('center')
    .bold(true)
    .size(2, 2)
    .line('DELIVERY SYSTEM')
    .size(1, 1)
    .line('KIOSCO MOVIL')
    .bold(false)
    .feed(1)
    .align('left')
    .hr()
    .line(`Pedido: ${input.order.id}`)
    .line(`Estado: ${input.order.status}`)
    .line(`Fecha: ${new Date(input.order.createdAt).toLocaleString()}`)
    .hr()
    .line('Cant Producto                 Subtotal');

  input.cartItems.forEach((item) => {
    builder.line(renderItemLine(item));
  });

  builder
    .hr()
    .bold(true)
    .line(`TOTAL: ${toMoney(total)}`)
    .bold(false)
    .feed(1)
    .align('center')
    .bold(true)
    .size(3, 3)
    .line(`#${shortCode(input.order.id)}`)
    .size(1, 1)
    .bold(false)
    .line('GRACIAS POR TU PEDIDO')
    .feed(4)
    .cut();

  return builder.build();
}

export async function printTicket(input: PrintTicketInput): Promise<void> {
  const transport: EscPosTransport = new Tp510ubBluetoothTransport({
    deviceNameHint: 'TP510UB',
  });
  const ticketBytes = buildTicketPayload(input);
  await transport.write(ticketBytes);
}
