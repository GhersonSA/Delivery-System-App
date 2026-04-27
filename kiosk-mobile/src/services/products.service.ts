import { Product } from '../types/product';
import { getApiBaseUrl } from './api';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/products`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return (await response.json()) as Product[];
}
