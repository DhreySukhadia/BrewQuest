import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCoffeeDto } from '../dist/modules/coffees/dto/create-coffee.dto.js';
import { UpdateCoffeeDto } from '../dist/modules/coffees/dto/update-coffee.dto.js';
import { CreateRoasterDto } from '../dist/modules/roasters/dto/create-roaster.dto.js';
import { UpdateRoasterDto } from '../dist/modules/roasters/dto/update-roaster.dto.js';
import { CreateAttributeDto } from '../dist/modules/attributes/dto/create-attribute.dto.js';
import { AttributeQueryDto } from '../dist/modules/attributes/dto/attribute-query.dto.js';
import { AssignCoffeeAttributeDto } from '../dist/modules/coffees/dto/assign-coffee-attribute.dto.js';
import { AttributeCategory } from '@brewquest/db';

describe('DTO Validation', () => {
  describe('CreateCoffeeDto', () => {
    it('should validate valid CreateCoffeeDto successfully', async () => {
      const plain = {
        name: 'Ethiopia Yirgacheffe',
        roasterId: 'roaster-123',
        origin: 'Ethiopia',
        region: 'Gedeo',
        farm: 'Halo Beriti',
        altitude: '2000-2200m',
        variety: 'Kurume, Dega',
        processing: 'Washed',
        roast: 'Light',
      };
      const dto = plainToInstance(CreateCoffeeDto, plain);
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail when name is missing', async () => {
      const plain = { origin: 'Colombia' };
      const dto = plainToInstance(CreateCoffeeDto, plain);
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });

    it('should fail when name is empty string', async () => {
      const plain = { name: '' };
      const dto = plainToInstance(CreateCoffeeDto, plain);
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });
  });

  describe('UpdateCoffeeDto', () => {
    it('should validate empty update payload as valid (all fields optional)', async () => {
      const dto = plainToInstance(UpdateCoffeeDto, {});
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail if name is empty string when provided', async () => {
      const dto = plainToInstance(UpdateCoffeeDto, { name: '' });
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });
  });

  describe('CreateRoasterDto', () => {
    it('should validate valid CreateRoasterDto successfully', async () => {
      const dto = plainToInstance(CreateRoasterDto, { name: 'Square Mile Coffee Roasters' });
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail when name is missing', async () => {
      const dto = plainToInstance(CreateRoasterDto, {});
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });

    it('should fail when name is empty string', async () => {
      const dto = plainToInstance(CreateRoasterDto, { name: '' });
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });
  });

  describe('UpdateRoasterDto', () => {
    it('should validate empty payload as valid', async () => {
      const dto = plainToInstance(UpdateRoasterDto, {});
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should validate valid name update', async () => {
      const dto = plainToInstance(UpdateRoasterDto, { name: 'Updated Roaster Name' });
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });
  });

  describe('CreateAttributeDto', () => {
    it('should validate valid CreateAttributeDto successfully', async () => {
      const plain = {
        name: 'Bergamot',
        category: AttributeCategory.FLAVOR,
        description: 'Delicate citrus aroma',
      };
      const dto = plainToInstance(CreateAttributeDto, plain);
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail when name is missing', async () => {
      const plain = { category: AttributeCategory.FLAVOR };
      const dto = plainToInstance(CreateAttributeDto, plain);
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });

    it('should fail when name is empty string', async () => {
      const plain = { name: '', category: AttributeCategory.FLAVOR };
      const dto = plainToInstance(CreateAttributeDto, plain);
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'name'));
    });

    it('should fail when category is invalid', async () => {
      const plain = { name: 'Valid Name', category: 'INVALID_CATEGORY' };
      const dto = plainToInstance(CreateAttributeDto, plain);
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'category'));
    });
  });

  describe('AttributeQueryDto', () => {
    it('should validate empty query as valid (optional category)', async () => {
      const dto = plainToInstance(AttributeQueryDto, {});
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should validate valid category query', async () => {
      const dto = plainToInstance(AttributeQueryDto, { category: AttributeCategory.BODY });
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail when category query is not a valid enum value', async () => {
      const dto = plainToInstance(AttributeQueryDto, { category: 'UNKNOWN' });
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'category'));
    });
  });

  describe('AssignCoffeeAttributeDto', () => {
    it('should validate valid AssignCoffeeAttributeDto with strength', async () => {
      const dto = plainToInstance(AssignCoffeeAttributeDto, {
        attributeId: 'attr-123',
        strength: 4.5,
      });
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should validate valid AssignCoffeeAttributeDto without strength (nullable strength)', async () => {
      const dto = plainToInstance(AssignCoffeeAttributeDto, {
        attributeId: 'attr-123',
      });
      const errors = await validate(dto);
      assert.strictEqual(errors.length, 0);
    });

    it('should fail when attributeId is missing', async () => {
      const dto = plainToInstance(AssignCoffeeAttributeDto, { strength: 3.0 });
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'attributeId'));
    });

    it('should fail when strength is not a number', async () => {
      const dto = plainToInstance(AssignCoffeeAttributeDto, {
        attributeId: 'attr-123',
        strength: 'not-a-number' as unknown as number,
      });
      const errors = await validate(dto);
      assert.ok(errors.some((e) => e.property === 'strength'));
    });
  });
});
