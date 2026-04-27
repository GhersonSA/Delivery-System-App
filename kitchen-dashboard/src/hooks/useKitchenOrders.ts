'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { KitchenOrder } from '../types/order';

const DEFAULT_SOCKET_URL = 'http://localhost:3000';

function normalizeIncomingOrder(order: Omit<KitchenOrder, 'status'> & { status?: string }): KitchenOrder {
  const status = order.status ?? 'PENDING';
  if (status === 'PENDING' || status === 'PREPARING' || status === 'READY' || status === 'DELIVERED') {
    return {
      ...order,
      status,
    };
  }

  return {
    ...order,
    status: 'PENDING',
  };
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL ?? DEFAULT_SOCKET_URL;

    void (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/orders/kitchen`);
        if (response.ok) {
          const payload = (await response.json()) as Array<
            Omit<KitchenOrder, 'status'> & { status?: string }
          >;
          setOrders(payload.map(normalizeIncomingOrder));
        }
      } finally {
        setIsLoading(false);
      }
    })();

    const socket: Socket = io(baseUrl, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('orderCreated', (incomingOrder: Omit<KitchenOrder, 'status'> & { status?: string }) => {
      const mappedOrder = normalizeIncomingOrder(incomingOrder);
      setOrders((current) => [mappedOrder, ...current.filter((item) => item.id !== mappedOrder.id)]);
    });

    socket.on('orderUpdated', (incomingOrder: Omit<KitchenOrder, 'status'> & { status?: string }) => {
      const mappedOrder = normalizeIncomingOrder(incomingOrder);
      setOrders((current) =>
        current.map((item) => (item.id === mappedOrder.id ? mappedOrder : item)),
      );
    });

    return () => {
      socket.removeAllListeners('orderCreated');
      socket.removeAllListeners('orderUpdated');
      socket.disconnect();
    };
  }, []);

  const preparingOrders = useMemo(
    () => orders.filter((item) => item.status === 'PENDING' || item.status === 'PREPARING'),
    [orders],
  );
  const readyOrders = useMemo(() => orders.filter((item) => item.status === 'READY'), [orders]);

  return {
    isConnected,
    isLoading,
    preparingOrders,
    readyOrders,
  };
}
