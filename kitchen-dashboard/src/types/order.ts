export type KitchenStatus = 'PREPARING';

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
  items: KitchenOrderItem[];
}
