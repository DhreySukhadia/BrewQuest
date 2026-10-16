import { AttributeCategory } from '@brewquest/db';

export class CoffeeAttributeDetailEntity {
  id!: string;
  name!: string;
  category!: AttributeCategory;
  description!: string | null;
}

export class CoffeeAttributeEntity {
  coffeeId!: string;
  attributeId!: string;
  strength!: number | null;
  createdAt!: Date;
  attribute!: CoffeeAttributeDetailEntity;
}
