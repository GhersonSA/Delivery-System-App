'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { KitchenOrder } from '../types/order';

const DEFAULT_SOCKET_URL = 'http://localhost:3000';

function normalizeToPreparing(order: Omit<KitchenOrder, 'status'> & { status?: string }): KitchenOrder {
  return {
    ...order,
    status: 'PREPARING',
  };
}

export function useKitchenOrders() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL ?? DEFAULT_SOCKET_URL;
    const socket: Socket = io(baseUrl, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('orderCreated', (incomingOrder: Omit<KitchenOrder, 'status'> & { status?: string }) => {
      const mappedOrder = normalizeToPreparing(incomingOrder);
      setOrders((current) => [mappedOrder, ...current]);
    });

    return () => {
      socket.removeAllListeners('orderCreated');
      socket.disconnect();
    };
  }, []);

  const preparingOrders = useMemo(() => orders, [orders]);

  return {
    isConnected,
    preparingOrders,
  };
}
