import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AttributeCategory, Prisma } from '@brewquest/db';
import {
  AttributesService,
  publicAttributeSelect,
} from '../dist/modules/attributes/services/attributes.service.js';
import type { PrismaService } from '../dist/prisma/prisma.service.js';

function createMockPrismaService(overrides: {
  findMany?: (args?: { where?: { category?: AttributeCategory } }) => Promise<unknown[]>;
  findUnique?: (args: { where: { id: string } }) => Promise<unknown | null>;
  findFirst?: (args: { where: { name: { equals: string; mode: string } } }) => Promise<unknown | null>;
  create?: (args: { data: Record<string, unknown> }) => Promise<unknown>;
} = {}): PrismaService {
  return {
    client: {
      attribute: {
        findMany: overrides.findMany ?? (async () => []),
        findUnique: overrides.findUnique ?? (async () => null),
        findFirst: overrides.findFirst ?? (async () => null),
        create: overrides.create ?? (async (args) => ({ id: 'attr-new', ...args.data })),
      },
    },
  } as unknown as PrismaService;
}

describe('AttributesService', () => {
  describe('publicAttributeSelect', () => {
    it('should select explicit public fields', () => {
      assert.strictEqual(publicAttributeSelect.id, true);
      assert.strictEqual(publicAttributeSelect.name, true);
      assert.strictEqual(publicAttributeSelect.category, true);
      assert.strictEqual(publicAttributeSelect.description, true);
      assert.strictEqual(publicAttributeSelect.createdAt, true);
      assert.strictEqual(publicAttributeSelect.updatedAt, true);
    });
  });

  describe('findAll', () => {
    it('should return all attributes ordered by category and name', async () => {
      const mockAttributes = [
        {
          id: 'attr-1',
          name: 'Floral',
          category: AttributeCategory.AROMA,
          description: 'Flowery scent',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'attr-2',
          name: 'Jasmine',
          category: AttributeCategory.FLAVOR,
          description: 'Sweet floral jasmine note',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      let capturedArgs: unknown = null;
      const prisma = createMockPrismaService({
        findMany: async (args) => {
          capturedArgs = args;
          return mockAttributes;
        },
      });
      const service = new AttributesService(prisma);

      const result = await service.findAll();
      assert.deepStrictEqual(result, mockAttributes);
      assert.deepStrictEqual((capturedArgs as { where: Record<string, unknown> }).where, {});
    });

    it('should filter attributes by category when category parameter is supplied', async () => {
      let capturedWhere: unknown = null;
      const prisma = createMockPrismaService({
        findMany: async (args) => {
          capturedWhere = args?.where;
          return [];
        },
      });
      const service = new AttributesService(prisma);

      await service.findAll(AttributeCategory.FLAVOR);
      assert.deepStrictEqual(capturedWhere, { category: AttributeCategory.FLAVOR });
    });
  });

  describe('findById', () => {
    it('should return the attribute when found', async () => {
      const mockAttribute = {
        id: 'attr-123',
        name: 'Citrus',
        category: AttributeCategory.FLAVOR,
        description: 'Bright citrus note',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const prisma = createMockPrismaService({
        findUnique: async ({ where }) => (where.id === 'attr-123' ? mockAttribute : null),
      });
      const service = new AttributesService(prisma);

      const result = await service.findById('attr-123');
      assert.strictEqual(result.id, 'attr-123');
      assert.strictEqual(result.name, 'Citrus');
    });

    it('should throw NotFoundException when attribute does not exist', async () => {
      const prisma = createMockPrismaService({
        findUnique: async () => null,
      });
      const service = new AttributesService(prisma);

      await assert.rejects(
        async () => {
          await service.findById('missing-id');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Attribute with ID 'missing-id' not found");
          return true;
        },
      );
    });
  });

  describe('findByCategory', () => {
    it('should delegate to findAll with category filter', async () => {
      const mockList = [{ id: 'a-1', name: 'Chocolate', category: AttributeCategory.FLAVOR }];
      let capturedCategory: unknown = null;
      const prisma = createMockPrismaService({
        findMany: async (args) => {
          capturedCategory = args?.where?.category;
          return mockList;
        },
      });
      const service = new AttributesService(prisma);

      const result = await service.findByCategory(AttributeCategory.FLAVOR);
      assert.strictEqual(capturedCategory, AttributeCategory.FLAVOR);
      assert.deepStrictEqual(result, mockList);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if name is blank', async () => {
      const prisma = createMockPrismaService();
      const service = new AttributesService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: '   ', category: AttributeCategory.ACIDITY });
        },
        (err: unknown) => {
          assert.ok(err instanceof BadRequestException);
          assert.strictEqual(err.message, 'Attribute name cannot be empty');
          return true;
        },
      );
    });

    it('should throw ConflictException if attribute name already exists (case-insensitive)', async () => {
      const prisma = createMockPrismaService({
        findFirst: async () => ({ id: 'existing-1', name: 'Berry' }),
      });
      const service = new AttributesService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: 'berry', category: AttributeCategory.FLAVOR });
        },
        (err: unknown) => {
          assert.ok(err instanceof ConflictException);
          assert.strictEqual(err.message, "Attribute with name 'berry' already exists");
          return true;
        },
      );
    });

    it('maps a concurrent unique-name violation (P2002) to ConflictException', async () => {
      const prisma = createMockPrismaService({
        findFirst: async () => null,
        create: async () => {
          throw new Prisma.PrismaClientKnownRequestError('db error', { code: 'P2002', clientVersion: '5.22.0' });
        },
      });
      const service = new AttributesService(prisma);
      const err = await service
        .create({ name: 'Blueberry', category: AttributeCategory.FLAVOR })
        .catch((e: unknown) => e);
      assert.ok(err instanceof ConflictException);
      assert.strictEqual((err as ConflictException).message, "Attribute with name 'Blueberry' already exists");
    });

    it('should trim name and create attribute successfully', async () => {
      let createdData: unknown = null;
      const prisma = createMockPrismaService({
        findFirst: async () => null,
        create: async (args) => {
          createdData = args.data;
          return { id: 'attr-new', ...args.data };
        },
      });
      const service = new AttributesService(prisma);

      const result = await service.create({
        name: '  Nutty  ',
        category: AttributeCategory.FLAVOR,
        description: '  Rich hazelnut aroma  ',
      });

      assert.strictEqual((createdData as Record<string, unknown>).name, 'Nutty');
      assert.strictEqual((createdData as Record<string, unknown>).category, AttributeCategory.FLAVOR);
      assert.strictEqual((createdData as Record<string, unknown>).description, 'Rich hazelnut aroma');
      assert.strictEqual(result.name, 'Nutty');
    });
  });
});
