export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    category: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderResponse {
  id: string;
  total: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}
