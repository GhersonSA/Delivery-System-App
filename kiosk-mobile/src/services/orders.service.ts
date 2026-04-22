import { getApiBaseUrl } from './api';
import { CreateOrderRequest, OrderResponse } from '../types/order';

export async function submitOrder(payload: CreateOrderRequest): Promise<OrderResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create order: ${response.status} ${errorBody}`);
  }

  return (await response.json()) as OrderResponse;
}
