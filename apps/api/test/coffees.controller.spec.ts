import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GUARDS_METADATA } from '@nestjs/common/constants.js';
import { CoffeesController } from '../dist/modules/coffees/controllers/coffees.controller.js';
import { AuthGuard } from '../dist/common/guards/auth.guard.js';
import type { CoffeesService } from '../dist/modules/coffees/services/coffees.service.js';
import type { AuthUser } from '../dist/lib/auth.js';

function createMockCoffeesService(overrides: Partial<CoffeesService> = {}): CoffeesService {
  return {
    findAll: overrides.findAll ?? (async () => []),
    findById: overrides.findById ?? (async () => ({} as never)),
    findByRoaster: overrides.findByRoaster ?? (async () => []),
    findAttributes: overrides.findAttributes ?? (async () => []),
    create: overrides.create ?? (async () => ({} as never)),
  } as unknown as CoffeesService;
}

const mockUser: AuthUser = {
  id: 'user-456',
  email: 'barista@brewquest.io',
  emailVerified: true,
  name: 'Barista Bob',
  firstName: 'Bob',
  lastName: 'Barista',
  username: 'bobbarista',
  role: 'USER',
  status: 'ACTIVE',
  experienceTier: 'EXPLORER',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CoffeesController', () => {
  it('should have AuthGuard metadata configured on create endpoint', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, CoffeesController.prototype.create);
    assert.ok(guards, 'Expected guards metadata on create');
    assert.ok(guards.includes(AuthGuard), 'Expected AuthGuard in guards metadata on create');
  });

  describe('findAll', () => {
    it('should delegate to coffeesService.findAll', async () => {
      const mockCoffees = [{ id: 'c-1', name: 'Ethiopia Sidama' }];
      const service = createMockCoffeesService({
        findAll: async () => mockCoffees as never,
      });
      const controller = new CoffeesController(service);

      const result = await controller.findAll();
      assert.deepStrictEqual(result, mockCoffees);
    });
  });

  describe('findById', () => {
    it('should delegate to coffeesService.findById with param id', async () => {
      const mockCoffee = { id: 'c-123', name: 'Colombia Huila' };
      let capturedId: string | null = null;
      const service = createMockCoffeesService({
        findById: async (id: string) => {
          capturedId = id;
          return mockCoffee as never;
        },
      });
      const controller = new CoffeesController(service);

      const result = await controller.findById('c-123');
      assert.strictEqual(capturedId, 'c-123');
      assert.deepStrictEqual(result, mockCoffee);
    });
  });

  describe('findByRoaster', () => {
    it('should delegate to coffeesService.findByRoaster with param roasterId', async () => {
      const mockCoffees = [{ id: 'c-1', name: 'House Blend' }];
      let capturedRoasterId: string | null = null;
      const service = createMockCoffeesService({
        findByRoaster: async (roasterId: string) => {
          capturedRoasterId = roasterId;
          return mockCoffees as never;
        },
      });
      const controller = new CoffeesController(service);

      const result = await controller.findByRoaster('r-999');
      assert.strictEqual(capturedRoasterId, 'r-999');
      assert.deepStrictEqual(result, mockCoffees);
    });
  });

  describe('findAttributes', () => {
    it('should delegate to coffeesService.findAttributes with param id', async () => {
      const mockAttributes = [
        {
          coffeeId: 'c-123',
          attributeId: 'a-1',
          strength: 4.0,
          createdAt: new Date(),
          attribute: { id: 'a-1', name: 'Berry' },
        },
      ];
      let capturedId: string | null = null;
      const service = createMockCoffeesService({
        findAttributes: async (id: string) => {
          capturedId = id;
          return mockAttributes as never;
        },
      });
      const controller = new CoffeesController(service);

      const result = await controller.findAttributes('c-123');
      assert.strictEqual(capturedId, 'c-123');
      assert.deepStrictEqual(result, mockAttributes);
    });
  });

  describe('create', () => {
    it('should delegate to coffeesService.create with dto and authenticated user.id', async () => {
      const mockCreated = { id: 'c-new', name: 'Kenya Nyeri' };
      let capturedDto: unknown = null;
      let capturedUserId: string | null = null;

      const service = createMockCoffeesService({
        create: async (dto, userId) => {
          capturedDto = dto;
          capturedUserId = userId;
          return mockCreated as never;
        },
      });
      const controller = new CoffeesController(service);

      const dto = { name: 'Kenya Nyeri', origin: 'Kenya' };
      const result = await controller.create(dto, mockUser);

      assert.deepStrictEqual(capturedDto, dto);
      assert.strictEqual(capturedUserId, 'user-456');
      assert.deepStrictEqual(result, mockCreated);
    });
  });
});
