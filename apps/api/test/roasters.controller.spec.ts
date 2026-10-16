import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RoastersController } from '../dist/modules/roasters/controllers/roasters.controller.js';
import type { RoastersService } from '../dist/modules/roasters/services/roasters.service.js';

function createMockRoastersService(overrides: Partial<RoastersService> = {}): RoastersService {
  return {
    findAll: overrides.findAll ?? (async () => []),
    findById: overrides.findById ?? (async () => ({} as never)),
    create: overrides.create ?? (async () => ({} as never)),
  } as unknown as RoastersService;
}

describe('RoastersController', () => {
  it('should not expose a create or POST endpoint for roasters (disabled pending policy decision)', () => {
    assert.strictEqual(
      (RoastersController.prototype as unknown as Record<string, unknown>).create,
      undefined,
      'Roaster creation endpoint must not be exposed on the controller',
    );
  });

  it('should only expose public read operations (findAll and findById)', () => {
    const methods = Object.getOwnPropertyNames(RoastersController.prototype)
      .filter((prop) => prop !== 'constructor');
    assert.deepStrictEqual(methods.sort(), ['findAll', 'findById'].sort());
  });

  describe('findAll', () => {
    it('should delegate to roastersService.findAll', async () => {
      const mockRoasters = [
        { id: '1', name: 'Blue Bottle', createdAt: new Date(), updatedAt: new Date() },
      ];
      const service = createMockRoastersService({
        findAll: async () => mockRoasters,
      });
      const controller = new RoastersController(service);

      const result = await controller.findAll();
      assert.deepStrictEqual(result, mockRoasters);
    });
  });

  describe('findById', () => {
    it('should delegate to roastersService.findById with param id', async () => {
      const mockRoaster = { id: 'roaster-1', name: 'Stumptown', createdAt: new Date(), updatedAt: new Date() };
      let calledId: string | null = null;
      const service = createMockRoastersService({
        findById: async (id: string) => {
          calledId = id;
          return mockRoaster;
        },
      });
      const controller = new RoastersController(service);

      const result = await controller.findById('roaster-1');
      assert.strictEqual(calledId, 'roaster-1');
      assert.deepStrictEqual(result, mockRoaster);
    });
  });
});
