import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRoasterDto } from '../dto/create-roaster.dto';

@Injectable()
export class RoastersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.roaster.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const roaster = await this.prisma.client.roaster.findUnique({
      where: { id },
    });

    if (!roaster) {
      throw new NotFoundException(`Roaster with ID '${id}' not found`);
    }

    return roaster;
  }

  async create(dto: CreateRoasterDto) {
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new BadRequestException('Roaster name cannot be empty');
    }

    const existing = await this.prisma.client.roaster.findFirst({
      where: { name: { equals: trimmedName, mode: 'insensitive' } },
    });

    if (existing) {
      throw new ConflictException(`Roaster with name '${trimmedName}' already exists`);
    }

    return this.prisma.client.roaster.create({
      data: { name: trimmedName },
    });
  }
}
