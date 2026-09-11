import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CoffeeDnaService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCoffeeId(coffeeId: string) {
    return { coffeeId, profile: 'Coffee DNA profile shell' };
  }
}
