export class CoffeeEntity {
  id!: string;
  name!: string;
  roaster!: string;
  origin!: string;
  roastLevel!: string;
  processMethod?: string;
  altitude?: number;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
