import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AttributeCategory, CoffeeReviewStatus, CoffeeSource, Prisma } from '@brewquest/db';
import {
  CoffeesService,
  publicCoffeeAttributeSelect,
  publicCoffeeSelect,
  publicCoffeeWhere,
} from '../dist/modules/coffees/services/coffees.service.js';
import type { PrismaService } from '../dist/prisma/prisma.service.js';

function createMockPrismaService(
  overrides: {
    coffee?: {
      findMany?: (args?: unknown) => Promise<unknown[]>;
      findFirst?: (args: {
        where: Record<string, unknown>;
        select?: unknown;
      }) => Promise<unknown | null>;
      findUnique?: (args: { where: { id: string }; select?: unknown }) => Promise<unknown | null>;
      create?: (args: { data: Record<string, unknown>; select?: unknown }) => Promise<unknown>;
    };
    roaster?: {
      findUnique?: (args: { where: { id: string }; select?: unknown }) => Promise<unknown | null>;
    };
    attribute?: {
      findUnique?: (args: { where: { id: string }; select?: unknown }) => Promise<unknown | null>;
    };
    coffeeAttribute?: {
      findMany?: (args?: unknown) => Promise<unknown[]>;
      findUnique?: (args: {
        where: { coffeeId_attributeId: { coffeeId: string; attributeId: string } };
      }) => Promise<unknown | null>;
      create?: (args: { data: Record<string, unknown>; select?: unknown }) => Promise<unknown>;
      delete?: (args: {
        where: { coffeeId_attributeId: { coffeeId: string; attributeId: string } };
      }) => Promise<unknown>;
    };
  } = {},
): PrismaService {
  return {
    client: {
      coffee: {
        findMany: overrides.coffee?.findMany ?? (async () => []),
        findFirst: overrides.coffee?.findFirst ?? (async () => null),
        findUnique: overrides.coffee?.findUnique ?? (async () => null),
        create: overrides.coffee?.create ?? (async (args) => ({ id: 'c-new', ...args.data })),
      },
      roaster: {
        findUnique: overrides.roaster?.findUnique ?? (async () => null),
      },
      attribute: {
        findUnique: overrides.attribute?.findUnique ?? (async () => null),
      },
      coffeeAttribute: {
        findMany: overrides.coffeeAttribute?.findMany ?? (async () => []),
        findUnique: overrides.coffeeAttribute?.findUnique ?? (async () => null),
        create:
          overrides.coffeeAttribute?.create ?? (async (args) => ({ createdAt: new Date(), ...args.data })),
        delete: overrides.coffeeAttribute?.delete ?? (async (args) => ({ ...args.where.coffeeId_attributeId })),
      },
    },
  } as unknown as PrismaService;
}

describe('CoffeesService', () => {
  describe('publicCoffeeSelect data security', () => {
    it('should include safe public fields and exclude all internal moderation/admin metadata', () => {
      // Must include public fields
      assert.strictEqual(publicCoffeeSelect.id, true);
      assert.strictEqual(publicCoffeeSelect.name, true);
      assert.strictEqual(publicCoffeeSelect.roasterId, true);
      assert.ok(publicCoffeeSelect.roaster);
      assert.strictEqual(publicCoffeeSelect.source, true);

      // Must NOT include sensitive/internal fields
      const selectKeys = Object.keys(publicCoffeeSelect);
      const prohibitedKeys = [
        'reviewStatus',
        'confidenceScore',
        'addedByAdminId',
        'addedByAdmin',
        'submittedByUserId',
        'submittedByUser',
        'reviewedByAdminId',
        'reviewedByAdmin',
        'reviewedAt',
        'reviewNotes',
        'duplicateOfId',
        'duplicateOf',
        'duplicates',
      ];

      for (const prohibited of prohibitedKeys) {
        assert.ok(
          !selectKeys.includes(prohibited),
          `Security violation: publicCoffeeSelect exposes internal field '${prohibited}'`,
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return coffees projected with publicCoffeeSelect', async () => {
      const mockCoffees = [
        {
          id: 'coffee-1',
          name: 'Geisha Panama',
          roasterId: 'roaster-1',
          roaster: { id: 'roaster-1', name: 'Hacienda La Esmeralda' },
          origin: 'Panama',
          region: 'Boquete',
          farm: 'Jaramillo',
          altitude: '1600m',
          variety: 'Geisha',
          processing: 'Washed',
          roast: 'Light',
          source: CoffeeSource.OFFICIAL,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      let capturedSelect: unknown = null;
      const prisma = createMockPrismaService({
        coffee: {
          findMany: async (args: { select?: unknown } = {}) => {
            capturedSelect = args.select;
            return mockCoffees;
          },
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.findAll();
      assert.deepStrictEqual(result, mockCoffees);
      assert.deepStrictEqual(capturedSelect, publicCoffeeSelect);
    });
  });

  describe('findById', () => {
    it('should return a coffee when found', async () => {
      const mockCoffee = {
        id: 'coffee-123',
        name: 'Yirgacheffe',
        roasterId: null,
        roaster: null,
        origin: 'Ethiopia',
        region: 'Yirgacheffe',
        farm: null,
        altitude: '1900m',
        variety: 'Heirloom',
        processing: 'Natural',
        roast: 'Medium-Light',
        source: CoffeeSource.COMMUNITY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const prisma = createMockPrismaService({
        coffee: {
          findFirst: async ({ where }) => (where.id === 'coffee-123' ? mockCoffee : null),
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.findById('coffee-123');
      assert.strictEqual(result.id, 'coffee-123');
      assert.strictEqual(result.name, 'Yirgacheffe');
    });

    it('should throw NotFoundException when coffee is not found', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findFirst: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.findById('non-existent');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Coffee with ID 'non-existent' not found");
          return true;
        },
      );
    });
  });

  describe('findByRoaster', () => {
    it('should throw NotFoundException if roaster does not exist', async () => {
      const prisma = createMockPrismaService({
        roaster: {
          findUnique: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.findByRoaster('missing-roaster');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Roaster with ID 'missing-roaster' not found");
          return true;
        },
      );
    });

    it('should return coffees for the specified roaster', async () => {
      const mockCoffees = [{ id: 'c-1', name: 'Kenya AA', roasterId: 'roaster-1' }];
      const prisma = createMockPrismaService({
        roaster: {
          findUnique: async () => ({ id: 'roaster-1' }),
        },
        coffee: {
          findMany: async () => mockCoffees,
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.findByRoaster('roaster-1');
      assert.deepStrictEqual(result, mockCoffees);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if coffee name is blank', async () => {
      const prisma = createMockPrismaService();
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: '   ' }, 'user-1');
        },
        (err: unknown) => {
          assert.ok(err instanceof BadRequestException);
          assert.strictEqual(err.message, 'Coffee name cannot be empty');
          return true;
        },
      );
    });

    it('should throw NotFoundException if provided roasterId does not exist', async () => {
      const prisma = createMockPrismaService({
        roaster: {
          findUnique: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.create({ name: 'Valid Coffee', roasterId: 'invalid-roaster' }, 'user-1');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Roaster with ID 'invalid-roaster' not found");
          return true;
        },
      );
    });

    it('should create coffee with safe DRAFT status, COMMUNITY source, and current user ID', async () => {
      let capturedData: Record<string, unknown> | null = null;
      let capturedSelect: unknown = null;

      const prisma = createMockPrismaService({
        roaster: {
          findUnique: async ({ where }) => (where.id === 'r-valid' ? { id: 'r-valid' } : null),
        },
        coffee: {
          create: async (args) => {
            capturedData = args.data;
            capturedSelect = args.select;
            return {
              id: 'c-created-1',
              name: args.data.name,
              roasterId: args.data.roasterId,
              origin: args.data.origin,
              region: args.data.region,
              farm: args.data.farm,
              altitude: args.data.altitude,
              variety: args.data.variety,
              processing: args.data.processing,
              roast: args.data.roast,
              source: args.data.source,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          },
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.create(
        {
          name: '  Ethiopia Guji  ',
          roasterId: 'r-valid',
          origin: '  Ethiopia  ',
          roast: '  Light  ',
        },
        'user-submitting-1',
      );

      assert.strictEqual(capturedData?.name, 'Ethiopia Guji');
      assert.strictEqual(capturedData?.origin, 'Ethiopia');
      assert.strictEqual(capturedData?.roast, 'Light');
      assert.strictEqual(capturedData?.source, CoffeeSource.COMMUNITY);
      assert.strictEqual(capturedData?.reviewStatus, CoffeeReviewStatus.DRAFT);
      assert.strictEqual(capturedData?.submittedByUserId, 'user-submitting-1');
      assert.deepStrictEqual(capturedSelect, publicCoffeeSelect);
      assert.strictEqual(result.id, 'c-created-1');
      assert.strictEqual(result.name, 'Ethiopia Guji');
    });
  });
});

/**
 * Visibility tests evaluate the `where` clause the service actually sends, against rows covering
 * every source x reviewStatus combination, so a missing or weakened filter fails these tests.
 */
describe('CoffeesService public visibility', () => {
  type Row = Record<string, unknown> & { id: string; roasterId: string | null };
  const rows: Row[] = [];
  for (const source of Object.values(CoffeeSource)) {
    for (const reviewStatus of Object.values(CoffeeReviewStatus)) {
      for (const roasterId of ['r-1', 'r-2']) {
        rows.push({
          id: `${source}-${reviewStatus}-${roasterId}`,
          name: `${source} ${reviewStatus} ${roasterId}`,
          roasterId,
          source,
          reviewStatus,
          submittedByUserId: 'user-1',
          reviewNotes: 'internal note',
        });
      }
    }
  }

  const matches = (row: Row, where: Record<string, unknown> = {}) =>
    Object.entries(where).every(([key, condition]) =>
      condition !== null && typeof condition === 'object' && 'in' in condition
        ? (condition as { in: unknown[] }).in.includes(row[key])
        : row[key] === condition,
    );
  const project = (row: Row, select: Record<string, unknown>) =>
    Object.fromEntries(
      Object.keys(select)
        .filter((k) => k in row)
        .map((k) => [k, row[k]]),
    );

  const prisma = {
    client: {
      coffee: {
        findMany: async ({
          where,
          select,
        }: {
          where?: Record<string, unknown>;
          select: Record<string, unknown>;
        }) => rows.filter((r) => matches(r, where)).map((r) => project(r, select)),
        findFirst: async ({
          where,
          select,
        }: {
          where: Record<string, unknown>;
          select: Record<string, unknown>;
        }) => {
          const row = rows.find((r) => matches(r, where));
          return row ? project(row, select) : null;
        },
      },
      roaster: {
        findUnique: async ({ where }: { where: { id: string } }) =>
          ['r-1', 'r-2', 'r-empty'].includes(where.id) ? { id: where.id } : null,
      },
      coffeeAttribute: {
        findMany: async ({ where }: { where: { coffeeId: string } }) => [
          { coffeeId: where.coffeeId, attributeId: 'a-1', strength: null },
        ],
      },
    },
  } as unknown as PrismaService;
  const service = new CoffeesService(prisma);

  const isPublic = (r: Row) =>
    r.reviewStatus === CoffeeReviewStatus.VERIFIED &&
    (r.source === CoffeeSource.OFFICIAL || r.source === CoffeeSource.COMMUNITY);
  const publicRows = rows.filter(isPublic);
  const hiddenRows = rows.filter((r) => !isPublic(r));

  it('policy: only VERIFIED OFFICIAL/COMMUNITY coffees are publicly discoverable', () => {
    assert.deepStrictEqual(publicCoffeeWhere, {
      reviewStatus: CoffeeReviewStatus.VERIFIED,
      source: { in: [CoffeeSource.OFFICIAL, CoffeeSource.COMMUNITY] },
    });
    assert.strictEqual(publicRows.length, 4); // 2 sources x 2 roasters
    assert.strictEqual(hiddenRows.length, rows.length - 4);
  });

  it('findAll returns only public coffees', async () => {
    const result = (await service.findAll()) as { id: string }[];
    assert.deepStrictEqual(result.map((c) => c.id).sort(), publicRows.map((r) => r.id).sort());
  });

  it('findAll excludes DRAFT, PENDING_REVIEW, REJECTED, MERGED and USER_CUSTOM coffees', async () => {
    const ids = new Set(((await service.findAll()) as { id: string }[]).map((c) => c.id));
    for (const status of ['DRAFT', 'PENDING_REVIEW', 'REJECTED', 'MERGED']) {
      assert.ok(![...ids].some((id) => id.includes(`-${status}-`)), `${status} coffee was listed`);
    }
    assert.ok(
      ![...ids].some((id) => id.startsWith('USER_CUSTOM-')),
      'USER_CUSTOM coffee was listed',
    );
  });

  it('findById returns a public coffee', async () => {
    const target = publicRows[0];
    const result = (await service.findById(target.id)) as { id: string };
    assert.strictEqual(result.id, target.id);
  });

  it('findById does not disclose any non-public coffee (same 404 as a missing ID)', async () => {
    const missing = await service.findById('does-not-exist').catch((e: unknown) => e);
    assert.ok(missing instanceof NotFoundException);
    for (const row of hiddenRows) {
      const err = await service.findById(row.id).catch((e: unknown) => e);
      assert.ok(err instanceof NotFoundException, `non-public coffee ${row.id} was returned`);
      assert.strictEqual(
        (err as NotFoundException).message,
        `Coffee with ID '${row.id}' not found`,
        'non-public coffee must be indistinguishable from a missing one',
      );
    }
  });

  it('findByRoaster applies the same visibility policy and scopes to the roaster', async () => {
    const result = (await service.findByRoaster('r-1')) as { id: string; roasterId: string }[];
    assert.deepStrictEqual(
      result.map((c) => c.id).sort(),
      publicRows
        .filter((r) => r.roasterId === 'r-1')
        .map((r) => r.id)
        .sort(),
    );
    assert.ok(result.every((c) => c.roasterId === 'r-1'));
  });

  it('findByRoaster returns an empty list for a roaster with no public coffees', async () => {
    assert.deepStrictEqual(await service.findByRoaster('r-empty'), []);
  });

  it('findAttributes returns associations only for public coffees', async () => {
    for (const row of publicRows) {
      const result = (await service.findAttributes(row.id)) as { coffeeId: string }[];
      assert.deepStrictEqual(
        result.map((a) => a.coffeeId),
        [row.id],
      );
    }
  });

  it('findAttributes does not disclose any non-public coffee (same 404 as a missing ID)', async () => {
    for (const row of hiddenRows) {
      const err = await service.findAttributes(row.id).catch((e: unknown) => e);
      assert.ok(err instanceof NotFoundException, `attributes of non-public coffee ${row.id} returned`);
      assert.strictEqual((err as NotFoundException).message, `Coffee with ID '${row.id}' not found`);
    }
  });

  it('public responses keep the safe field selection (no moderation/audit metadata)', async () => {
    const results = [
      ...((await service.findAll()) as Record<string, unknown>[]),
      (await service.findById(publicRows[0].id)) as Record<string, unknown>,
      ...((await service.findByRoaster('r-2')) as Record<string, unknown>[]),
    ];
    for (const coffee of results) {
      for (const key of ['reviewStatus', 'submittedByUserId', 'reviewNotes']) {
        assert.ok(!(key in coffee), `public response exposed '${key}'`);
      }
    }
  });
});

describe('CoffeesService Coffee Attributes', () => {
  describe('publicCoffeeAttributeSelect security', () => {
    it('should select safe attribute projection and never expose moderation or audit metadata', () => {
      assert.strictEqual(publicCoffeeAttributeSelect.coffeeId, true);
      assert.strictEqual(publicCoffeeAttributeSelect.attributeId, true);
      assert.strictEqual(publicCoffeeAttributeSelect.strength, true);
      assert.ok(publicCoffeeAttributeSelect.attribute);

      const prohibitedKeys = [
        'confidenceScore',
        'reviewStatus',
        'addedByAdminId',
        'submittedByUserId',
        'reviewedByAdminId',
        'reviewedAt',
        'reviewNotes',
        'duplicateOfId',
      ];
      const keys = Object.keys(publicCoffeeAttributeSelect);
      for (const p of prohibitedKeys) {
        assert.ok(!keys.includes(p), `Leaked moderation/audit field: ${p}`);
      }
    });
  });

  describe('findAttributes public visibility', () => {
    const mockCoffeeAttributes = [
      {
        coffeeId: 'c-pub-1',
        attributeId: 'a-1',
        strength: 4.5,
        createdAt: new Date(),
        attribute: {
          id: 'a-1',
          name: 'Blueberry',
          category: AttributeCategory.FLAVOR,
          description: 'Ripe blueberry note',
        },
      },
      {
        coffeeId: 'c-pub-1',
        attributeId: 'a-2',
        strength: null,
        createdAt: new Date(),
        attribute: {
          id: 'a-2',
          name: 'Jasmine',
          category: AttributeCategory.AROMA,
          description: null,
        },
      },
    ];

    it('returns attributes for a public verified coffee', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findFirst: async ({ where }) =>
            where.id === 'c-pub-1' && where.reviewStatus === CoffeeReviewStatus.VERIFIED
              ? { id: 'c-pub-1' }
              : null,
        },
        coffeeAttribute: {
          findMany: async () => mockCoffeeAttributes,
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.findAttributes('c-pub-1');
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].attribute.name, 'Blueberry');
      assert.strictEqual(result[0].strength, 4.5);
      assert.strictEqual(result[1].strength, null);
    });

    it('does not disclose non-public coffees (throws 404 identical to missing ID)', async () => {
      // Simulate non-public coffee (fails publicCoffeeWhere)
      const prisma = createMockPrismaService({
        coffee: {
          findFirst: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.findAttributes('draft-or-custom-coffee');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Coffee with ID 'draft-or-custom-coffee' not found");
          return true;
        },
      );
    });

    it('returns empty array when public coffee has no attributes associated', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findFirst: async () => ({ id: 'c-empty' }),
        },
        coffeeAttribute: {
          findMany: async () => [],
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.findAttributes('c-empty');
      assert.deepStrictEqual(result, []);
    });
  });

  describe('addAttribute', () => {
    it('creates association using composite key and preserves nullable strength', async () => {
      let createdPayload: unknown = null;
      const prisma = createMockPrismaService({
        coffee: {
          findUnique: async () => ({ id: 'c-1' }),
        },
        attribute: {
          findUnique: async () => ({ id: 'a-1' }),
        },
        coffeeAttribute: {
          findUnique: async () => null,
          create: async (args) => {
            createdPayload = args.data;
            return {
              coffeeId: args.data.coffeeId,
              attributeId: args.data.attributeId,
              strength: args.data.strength,
              createdAt: new Date(),
              attribute: { id: 'a-1', name: 'Chocolate', category: AttributeCategory.FLAVOR, description: null },
            };
          },
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.addAttribute('c-1', 'a-1', 3.0);
      assert.strictEqual((createdPayload as Record<string, unknown>).coffeeId, 'c-1');
      assert.strictEqual((createdPayload as Record<string, unknown>).attributeId, 'a-1');
      assert.strictEqual((createdPayload as Record<string, unknown>).strength, 3.0);
      assert.strictEqual(result.strength, 3.0);
    });

    it('preserves strength as null when strength is omitted (does not invent default)', async () => {
      let createdPayload: unknown = null;
      const prisma = createMockPrismaService({
        coffee: {
          findUnique: async () => ({ id: 'c-1' }),
        },
        attribute: {
          findUnique: async () => ({ id: 'a-1' }),
        },
        coffeeAttribute: {
          findUnique: async () => null,
          create: async (args) => {
            createdPayload = args.data;
            return { ...args.data, createdAt: new Date() };
          },
        },
      });
      const service = new CoffeesService(prisma);

      await service.addAttribute('c-1', 'a-1');
      assert.strictEqual((createdPayload as Record<string, unknown>).strength, null);
    });

    it('throws NotFoundException when referenced coffee does not exist', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findUnique: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.addAttribute('missing-c', 'a-1');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Coffee with ID 'missing-c' not found");
          return true;
        },
      );
    });

    it('throws NotFoundException when referenced attribute does not exist', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findUnique: async () => ({ id: 'c-1' }),
        },
        attribute: {
          findUnique: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.addAttribute('c-1', 'missing-a');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(err.message, "Attribute with ID 'missing-a' not found");
          return true;
        },
      );
    });

    it('throws ConflictException when association already exists (composite primary key uniqueness)', async () => {
      const prisma = createMockPrismaService({
        coffee: {
          findUnique: async () => ({ id: 'c-1' }),
        },
        attribute: {
          findUnique: async () => ({ id: 'a-1' }),
        },
        coffeeAttribute: {
          findUnique: async () => ({ coffeeId: 'c-1', attributeId: 'a-1', strength: 2.0 }),
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.addAttribute('c-1', 'a-1', 4.0);
        },
        (err: unknown) => {
          assert.ok(err instanceof ConflictException);
          assert.strictEqual(
            err.message,
            "Association between coffee 'c-1' and attribute 'a-1' already exists",
          );
          return true;
        },
      );
    });
  });

  describe('addAttribute concurrency (database constraint is authoritative)', () => {
    const racingService = (error: unknown) =>
      new CoffeesService(
        createMockPrismaService({
          coffee: { findUnique: async () => ({ id: 'c-1' }) },
          attribute: { findUnique: async () => ({ id: 'a-1' }) },
          coffeeAttribute: {
            findUnique: async () => null, // pre-check passes, then a concurrent insert wins
            create: async () => {
              throw error;
            },
          },
        }),
      );

    it('maps a composite-key violation (P2002) to ConflictException', async () => {
      const err = await racingService(new Prisma.PrismaClientKnownRequestError('db error', { code: 'P2002', clientVersion: '5.22.0' }))
        .addAttribute('c-1', 'a-1', null)
        .catch((e: unknown) => e);
      assert.ok(err instanceof ConflictException);
      assert.strictEqual(
        (err as ConflictException).message,
        "Association between coffee 'c-1' and attribute 'a-1' already exists",
      );
    });

    it('maps a foreign-key violation (P2003) to NotFoundException', async () => {
      const err = await racingService(new Prisma.PrismaClientKnownRequestError('db error', { code: 'P2003', clientVersion: '5.22.0' }))
        .addAttribute('c-1', 'a-1')
        .catch((e: unknown) => e);
      assert.ok(err instanceof NotFoundException);
    });

    it('rethrows unrelated errors unchanged', async () => {
      const boom = new Error('connection lost');
      const err = await racingService(boom).addAttribute('c-1', 'a-1').catch((e: unknown) => e);
      assert.strictEqual(err, boom);
    });
  });

  describe('removeAttribute concurrency', () => {
    it('maps a concurrently deleted association (P2025) to NotFoundException', async () => {
      const service = new CoffeesService(
        createMockPrismaService({
          coffeeAttribute: {
            findUnique: async () => ({ coffeeId: 'c-1', attributeId: 'a-1' }),
            delete: async () => {
              throw new Prisma.PrismaClientKnownRequestError('db error', { code: 'P2025', clientVersion: '5.22.0' });
            },
          },
        }),
      );
      const err = await service.removeAttribute('c-1', 'a-1').catch((e: unknown) => e);
      assert.ok(err instanceof NotFoundException);
      assert.strictEqual(
        (err as NotFoundException).message,
        "Association between coffee 'c-1' and attribute 'a-1' not found",
      );
    });
  });

  describe('removeAttribute', () => {
    it('deletes association using composite primary key', async () => {
      let deletedWhere: unknown = null;
      const prisma = createMockPrismaService({
        coffeeAttribute: {
          findUnique: async ({ where }) =>
            where.coffeeId_attributeId.coffeeId === 'c-1' && where.coffeeId_attributeId.attributeId === 'a-1'
              ? { coffeeId: 'c-1', attributeId: 'a-1' }
              : null,
          delete: async (args) => {
            deletedWhere = args.where;
            return { coffeeId: 'c-1', attributeId: 'a-1' };
          },
        },
      });
      const service = new CoffeesService(prisma);

      const result = await service.removeAttribute('c-1', 'a-1');
      assert.deepStrictEqual(deletedWhere, {
        coffeeId_attributeId: { coffeeId: 'c-1', attributeId: 'a-1' },
      });
      assert.strictEqual((result as { coffeeId: string }).coffeeId, 'c-1');
    });

    it('throws NotFoundException when association does not exist', async () => {
      const prisma = createMockPrismaService({
        coffeeAttribute: {
          findUnique: async () => null,
        },
      });
      const service = new CoffeesService(prisma);

      await assert.rejects(
        async () => {
          await service.removeAttribute('c-1', 'nonexistent-a');
        },
        (err: unknown) => {
          assert.ok(err instanceof NotFoundException);
          assert.strictEqual(
            err.message,
            "Association between coffee 'c-1' and attribute 'nonexistent-a' not found",
          );
          return true;
        },
      );
    });
  });
});

