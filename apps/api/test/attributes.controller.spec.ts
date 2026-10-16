import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BadRequestException } from '@nestjs/common';
import { AttributeCategory } from '@brewquest/db';
import { AttributesController } from '../dist/modules/attributes/controllers/attributes.controller.js';
import type { AttributesService } from '../dist/modules/attributes/services/attributes.service.js';

function createMockAttributesService(overrides: Partial<AttributesService> = {}): AttributesService {
  return {
    findAll: overrides.findAll ?? (async () => []),
    findById: overrides.findById ?? (async () => ({} as never)),
    findByCategory: overrides.findByCategory ?? (async () => []),
    create: overrides.create ?? (async () => ({} as never)),
  } as unknown as AttributesService;
}

describe('AttributesController', () => {
  it('should not expose a create or POST endpoint for attributes (disabled pending policy decision)', () => {
    assert.strictEqual(
      (AttributesController.prototype as unknown as Record<string, unknown>).create,
      undefined,
      'Attribute creation endpoint must not be exposed on the controller',
    );
  });

  it('should only expose public read operations (findAll, findByCategory, findById)', () => {
    const methods = Object.getOwnPropertyNames(AttributesController.prototype)
      .filter((prop) => prop !== 'constructor');
    assert.deepStrictEqual(methods.sort(), ['findAll', 'findByCategory', 'findById'].sort());
  });

  describe('findAll', () => {
    it('should delegate to attributesService.findAll with query category', async () => {
      const mockAttributes = [{ id: 'a-1', name: 'Caramel', category: AttributeCategory.SWEETNESS }];
      let capturedCategory: unknown = null;
      const service = createMockAttributesService({
        findAll: async (cat) => {
          capturedCategory = cat;
          return mockAttributes as never;
        },
      });
      const controller = new AttributesController(service);

      const result = await controller.findAll({ category: AttributeCategory.SWEETNESS });
      assert.strictEqual(capturedCategory, AttributeCategory.SWEETNESS);
      assert.deepStrictEqual(result, mockAttributes);
    });
  });

  describe('findByCategory', () => {
    it('should normalize valid category parameter case-insensitively and delegate', async () => {
      const mockAttributes = [{ id: 'a-2', name: 'Bright', category: AttributeCategory.ACIDITY }];
      let capturedCategory: unknown = null;
      const service = createMockAttributesService({
        findByCategory: async (cat) => {
          capturedCategory = cat;
          return mockAttributes as never;
        },
      });
      const controller = new AttributesController(service);

      const result = await controller.findByCategory('acidity');
      assert.strictEqual(capturedCategory, AttributeCategory.ACIDITY);
      assert.deepStrictEqual(result, mockAttributes);
    });

    it('should throw BadRequestException when an invalid category parameter is provided', () => {
      const service = createMockAttributesService();
      const controller = new AttributesController(service);

      assert.throws(
        () => {
          controller.findByCategory('not-a-category');
        },
        (err: unknown) => {
          assert.ok(err instanceof BadRequestException);
          assert.ok(
            (err as BadRequestException).message.includes("Invalid attribute category 'not-a-category'"),
          );
          return true;
        },
      );
    });
  });

  describe('findById', () => {
    it('should delegate to attributesService.findById with param id', async () => {
      const mockAttribute = { id: 'attr-99', name: 'Honey', category: AttributeCategory.SWEETNESS };
      let capturedId: string | null = null;
      const service = createMockAttributesService({
        findById: async (id) => {
          capturedId = id;
          return mockAttribute as never;
        },
      });
      const controller = new AttributesController(service);

      const result = await controller.findById('attr-99');
      assert.strictEqual(capturedId, 'attr-99');
      assert.deepStrictEqual(result, mockAttribute);
    });
  });
});
