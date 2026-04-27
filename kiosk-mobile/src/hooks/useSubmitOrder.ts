import { useMutation } from '@tanstack/react-query';
import { submitOrder } from '../services/orders.service';
import { printTicket } from '../services/print-ticket';
import { useCartStore } from '../store/cart.store';
import { OrderResponse } from '../types/order';

export const useSubmitOrder = () => {
  const items = useCartStore((state) => state.items);
  const toCreateOrderPayload = useCartStore((state) => state.toCreateOrderPayload);
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation<OrderResponse, Error, void>({
    mutationFn: async () => {
      const payload = toCreateOrderPayload();
      if (payload.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const order = await submitOrder(payload);
      try {
        await printTicket({ order, cartItems: items });
      } catch (error) {
        console.warn('Ticket printing failed. Order was created successfully.', error);
      }
      return order;
    },
    onSuccess: () => {
      clearCart();
    },
  });
};
