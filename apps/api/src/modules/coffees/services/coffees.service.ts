import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CoffeeReviewStatus, CoffeeSource, Prisma } from '@brewquest/db';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCoffeeDto } from '../dto/create-coffee.dto';

export const publicCoffeeAttributeSelect = {
  coffeeId: true,
  attributeId: true,
  strength: true,
  createdAt: true,
  attribute: {
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
    },
  },
} as const;

export const publicCoffeeSelect = {
  id: true,
  name: true,
  roasterId: true,
  roaster: {
    select: {
      id: true,
      name: true,
    },
  },
  origin: true,
  region: true,
  farm: true,
  altitude: true,
  variety: true,
  processing: true,
  roast: true,
  source: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Coffees eligible for public discovery: reviewed, shared-catalog records only.
 * - reviewStatus VERIFIED: DRAFT / PENDING_REVIEW are unreviewed, REJECTED was declined, and
 *   MERGED is a duplicate whose canonical record is listed instead.
 * - source OFFICIAL or COMMUNITY: USER_CUSTOM coffees are personal entries, not catalog records.
 * Owner access to non-public coffees (e.g. for journaling) is a separate, future query path.
 */
export const publicCoffeeWhere = {
  reviewStatus: CoffeeReviewStatus.VERIFIED,
  source: { in: [CoffeeSource.OFFICIAL, CoffeeSource.COMMUNITY] },
} satisfies Prisma.CoffeeWhereInput;

@Injectable()
export class CoffeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.coffee.findMany({
      where: publicCoffeeWhere,
      select: publicCoffeeSelect,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    // Non-public coffees get the same 404 as missing ones, so their existence is not disclosed.
    const coffee = await this.prisma.client.coffee.findFirst({
      where: { id, ...publicCoffeeWhere },
      select: publicCoffeeSelect,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID '${id}' not found`);
    }

    return coffee;
  }

  async findByRoaster(roasterId: string) {
    const roaster = await this.prisma.client.roaster.findUnique({
      where: { id: roasterId },
      select: { id: true },
    });

    if (!roaster) {
      throw new NotFoundException(`Roaster with ID '${roasterId}' not found`);
    }

    return this.prisma.client.coffee.findMany({
      where: { roasterId, ...publicCoffeeWhere },
      select: publicCoffeeSelect,
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateCoffeeDto, userId: string) {
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new BadRequestException('Coffee name cannot be empty');
    }

    if (dto.roasterId) {
      const roaster = await this.prisma.client.roaster.findUnique({
        where: { id: dto.roasterId },
        select: { id: true },
      });

      if (!roaster) {
        throw new NotFoundException(`Roaster with ID '${dto.roasterId}' not found`);
      }
    }

    return this.prisma.client.coffee.create({
      data: {
        name: trimmedName,
        roasterId: dto.roasterId || null,
        origin: dto.origin?.trim() || null,
        region: dto.region?.trim() || null,
        farm: dto.farm?.trim() || null,
        altitude: dto.altitude?.trim() || null,
        variety: dto.variety?.trim() || null,
        processing: dto.processing?.trim() || null,
        roast: dto.roast?.trim() || null,
        source: CoffeeSource.COMMUNITY,
        reviewStatus: CoffeeReviewStatus.DRAFT,
        submittedByUserId: userId,
      },
      select: publicCoffeeSelect,
    });
  }

  async findAttributes(coffeeId: string) {
    // Non-public coffees get the same 404 as missing ones, preserving public visibility rules.
    const coffee = await this.prisma.client.coffee.findFirst({
      where: { id: coffeeId, ...publicCoffeeWhere },
      select: { id: true },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID '${coffeeId}' not found`);
    }

    return this.prisma.client.coffeeAttribute.findMany({
      where: { coffeeId },
      select: publicCoffeeAttributeSelect,
      orderBy: [{ attribute: { category: 'asc' } }, { attribute: { name: 'asc' } }],
    });
  }

  async addAttribute(coffeeId: string, attributeId: string, strength?: number | null) {
    const coffee = await this.prisma.client.coffee.findUnique({
      where: { id: coffeeId },
      select: { id: true },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID '${coffeeId}' not found`);
    }

    const attribute = await this.prisma.client.attribute.findUnique({
      where: { id: attributeId },
      select: { id: true },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID '${attributeId}' not found`);
    }

    // Check for duplicate coffee-attribute pair using the composite primary key
    const existing = await this.prisma.client.coffeeAttribute.findUnique({
      where: {
        coffeeId_attributeId: {
          coffeeId,
          attributeId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Association between coffee '${coffeeId}' and attribute '${attributeId}' already exists`,
      );
    }

    try {
      return await this.prisma.client.coffeeAttribute.create({
        data: {
          coffeeId,
          attributeId,
          strength: strength !== undefined ? strength : null,
        },
        select: publicCoffeeAttributeSelect,
      });
    } catch (error) {
      // The composite primary key and foreign keys stay authoritative when a concurrent request
      // races the checks above.
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Association between coffee '${coffeeId}' and attribute '${attributeId}' already exists`,
          );
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Coffee or attribute not found');
        }
      }
      throw error;
    }
  }

  async removeAttribute(coffeeId: string, attributeId: string) {
    const existing = await this.prisma.client.coffeeAttribute.findUnique({
      where: {
        coffeeId_attributeId: {
          coffeeId,
          attributeId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Association between coffee '${coffeeId}' and attribute '${attributeId}' not found`,
      );
    }

    try {
      return await this.prisma.client.coffeeAttribute.delete({
        where: {
          coffeeId_attributeId: {
            coffeeId,
            attributeId,
          },
        },
      });
    } catch (error) {
      // Deleted by a concurrent request after the check above.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(
          `Association between coffee '${coffeeId}' and attribute '${attributeId}' not found`,
        );
      }
      throw error;
    }
  }
}
