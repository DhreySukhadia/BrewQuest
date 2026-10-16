import { CoffeeSource } from '@brewquest/db';

export class CoffeeRoasterEntity {
  id!: string;
  name!: string;
}

export class CoffeeEntity {
  id!: string;
  name!: string;
  roasterId!: string | null;
  roaster!: CoffeeRoasterEntity | null;
  origin!: string | null;
  region!: string | null;
  farm!: string | null;
  altitude!: string | null;
  variety!: string | null;
  processing!: string | null;
  roast!: string | null;
  source!: CoffeeSource;
  createdAt!: Date;
  updatedAt!: Date;
}
