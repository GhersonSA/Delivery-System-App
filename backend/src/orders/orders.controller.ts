import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCreatedPayload, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto): Promise<OrderCreatedPayload> {
    return this.ordersService.createOrder(dto);
  }
}
