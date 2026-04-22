import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersGateway } from './orders.gateway';

export type OrderCreatedPayload = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderCreatedPayload> {
    const productIds = dto.items.map((item) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];

    const products = await this.prisma.product.findMany({
      where: { id: { in: uniqueProductIds } },
      select: { id: true, price: true },
    });

    if (products.length !== uniqueProductIds.length) {
      throw new BadRequestException('One or more products do not exist');
    }

    const priceByProductId = new Map(products.map((product) => [product.id, product.price]));

    const total = dto.items.reduce((acc, item) => {
      const price = priceByProductId.get(item.productId);
      if (!price) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }
      return acc + Number(price) * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        total,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    this.ordersGateway.broadcastOrderCreated(order);

    return order;
  }
}
