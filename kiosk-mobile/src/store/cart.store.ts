import { create } from 'zustand';
import { CartItem, CreateOrderRequest } from '../types/order';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string, quantity?: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  toCreateOrderPayload: () => CreateOrderRequest;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.productId === item.productId);
      if (!existing) {
        return { items: [...state.items, { ...item, quantity }] };
      }

      return {
        items: state.items.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        ),
      };
    });
  },

  removeItem: (productId, quantity = 1) => {
    set((state) => {
      const target = state.items.find((item) => item.productId === productId);
      if (!target) {
        return state;
      }

      if (target.quantity <= quantity) {
        return { items: state.items.filter((item) => item.productId !== productId) };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - quantity }
            : item,
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce((accumulator, item) => accumulator + item.unitPrice * item.quantity, 0),

  toCreateOrderPayload: () => ({
    items: get().items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  }),
}));
