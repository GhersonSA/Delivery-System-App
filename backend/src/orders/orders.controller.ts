import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderCreatedPayload, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('kitchen')
  listKitchenOrders(): Promise<OrderCreatedPayload[]> {
    return this.ordersService.listKitchenOrders();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto): Promise<OrderCreatedPayload> {
    return this.ordersService.createOrder(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderCreatedPayload> {
    return this.ordersService.updateOrderStatus(orderId, dto.status);
  }
}
