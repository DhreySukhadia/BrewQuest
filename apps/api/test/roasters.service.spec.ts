import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { RoastersService } from '../dist/modules/roasters/services/roasters.service.js';
import type { PrismaService } from '../dist/prisma/prisma.service.js';

function createMockPrismaService(overrides: {
  findMany?: () => Promise<unknown[]>;
  findUnique?: (args: { where: { id: string } }) => Promise<unknown | null>;
  findFirst?: (args: { where: { name: { equals: string; mode: string } } }) => Promise<unknown | null>;
  create?: (args: { data: { name: string } }) => Promise<unknown>;
} = {}): PrismaService {
  return {
    client: {
      roaster: {
        findMany: overrides.findMany ?? (async () => []),
        findUnique: overrides.findUnique ?? (async () => null),
        findFirst: overrides.findFirst ?? (async () => null),
        create: overrides.create ?? (async (args: { data: { name: string } }) => ({
          id: 'roaster-1',
          name: args.data.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      },
    },
  } as unknown as PrismaService;
}

describe('RoastersService', () => {
  describe('findAll', () => {
    it('should return all roasters ordered by name', async () => {
      const mockRoasters = [
        { id: '1', name: 'Blue Bottle', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Counter Culture', createdAt: new Date(), updatedAt: new Date() },
      ];
      const prisma = createMockPrismaService({
        findMany: async () => mockRoasters,
      });
      const service = new RoastersService(prisma);

      const result = await service.findAll();
      assert.deepStrictEqual(result, mockRoasters);
    });
  });

  describe('findById', () => {
    it('should return a roaster when found', async () => {
      const mockRoaster = { id: 'roaster-123', name: 'Stumptown', createdAt: new Date(), updatedAt: new Date() };
      const prisma = createMockPrismaService({
        findUnique: async ({ where }) => (where.id === 'roaster-123' ? mockRoaster : null),
      });
      const service = new RoastersService(prisma);

      const result = await service.findById('roaster-123');
      assert.strictEqual(result.id, 'roaster-123');
      assert.strictEqual(result.name, 'Stumptown');
    });

    it('should throw NotFoundException when roaster does not exist', async () => {
      const prisma = createMockPrismaService({
        findUnique: async () => null,
      });
      const service = new RoastersService(prisma);

      await assert.rejects(
        async () => {
          await service.findById('non-existent');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Roaster with ID 'non-existent' not found");
          return true;
        },
      );
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if roaster name is empty or only whitespace', async () => {
      const prisma = createMockPrismaService();
      const service = new RoastersService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: '   ' });
        },
        (err: unknown) => {
          assert.ok(err instanceof BadRequestException);
          assert.strictEqual(err.message, 'Roaster name cannot be empty');
          return true;
        },
      );
    });

    it('should throw ConflictException if roaster name already exists (case-insensitive)', async () => {
      const prisma = createMockPrismaService({
        findFirst: async () => ({ id: 'existing-1', name: 'Onyx Coffee Lab' }),
      });
      const service = new RoastersService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: 'onyx coffee lab' });
        },
        (err: unknown) => {
          assert.ok(err instanceof ConflictException);
          assert.strictEqual(err.message, "Roaster with name 'onyx coffee lab' already exists");
          return true;
        },
      );
    });

    it('should trim name and create a new roaster record', async () => {
      let createdData: { name: string } | null = null;
      const prisma = createMockPrismaService({
        findFirst: async () => null,
        create: async (args) => {
          createdData = args.data;
          return {
            id: 'roaster-new',
            name: args.data.name,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        },
      });
      const service = new RoastersService(prisma);

      const result = await service.create({ name: '  Intelligentsia  ' });
      assert.strictEqual(createdData?.name, 'Intelligentsia');
      assert.strictEqual(result.name, 'Intelligentsia');
      assert.strictEqual(result.id, 'roaster-new');
    });
  });
});
