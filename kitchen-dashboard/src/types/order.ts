export type KitchenStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';

export interface KitchenOrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    category: string;
  };
}

export interface KitchenOrder {
  id: string;
  total: string;
  status: KitchenStatus;
  createdAt: string;
  updatedAt?: string;
  items: KitchenOrderItem[];
}
