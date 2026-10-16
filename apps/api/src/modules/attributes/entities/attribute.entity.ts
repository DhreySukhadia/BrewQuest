import { AttributeCategory } from '@brewquest/db';

export class AttributeEntity {
  id!: string;
  name!: string;
  category!: AttributeCategory;
  description!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
