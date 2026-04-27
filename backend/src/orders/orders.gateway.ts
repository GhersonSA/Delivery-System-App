import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'socket.io';
import type { OrderCreatedPayload } from './orders.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrdersGateway {
  @WebSocketServer()
  private server!: Server;

  broadcastOrderCreated(order: OrderCreatedPayload): void {
    this.server.emit('orderCreated', order);
  }

  broadcastOrderUpdated(order: OrderCreatedPayload): void {
    this.server.emit('orderUpdated', order);
  }
}
