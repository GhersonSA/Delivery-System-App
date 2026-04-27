import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
