import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttributeCategory, Prisma } from '@brewquest/db';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAttributeDto } from '../dto/create-attribute.dto';

export const publicAttributeSelect = {
  id: true,
  name: true,
  category: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: AttributeCategory) {
    const where = category ? { category } : {};
    return this.prisma.client.attribute.findMany({
      where,
      select: publicAttributeSelect,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    const attribute = await this.prisma.client.attribute.findUnique({
      where: { id },
      select: publicAttributeSelect,
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID '${id}' not found`);
    }

    return attribute;
  }

  async findByCategory(category: AttributeCategory) {
    return this.findAll(category);
  }

  async create(dto: CreateAttributeDto) {
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new BadRequestException('Attribute name cannot be empty');
    }

    const existing = await this.prisma.client.attribute.findFirst({
      where: { name: { equals: trimmedName, mode: 'insensitive' } },
    });

    if (existing) {
      throw new ConflictException(`Attribute with name '${trimmedName}' already exists`);
    }

    try {
      return await this.prisma.client.attribute.create({
        data: {
          name: trimmedName,
          category: dto.category,
          description: dto.description?.trim() || null,
        },
        select: publicAttributeSelect,
      });
    } catch (error) {
      // Attribute.name is @unique; a concurrent create can pass the check above.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Attribute with name '${trimmedName}' already exists`);
      }
      throw error;
    }
  }
}
