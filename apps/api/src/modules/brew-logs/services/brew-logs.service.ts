import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BrewLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return { userId, brewLogs: [] };
  }
}
