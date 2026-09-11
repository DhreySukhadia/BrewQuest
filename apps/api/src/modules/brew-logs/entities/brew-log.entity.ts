export class BrewLogEntity {
  id!: string;
  userId!: string;
  coffeeId!: string;
  brewMethod!: string; // e.g. V60, Chemex, Espresso, Aeropress
  grindSize!: string; // e.g. Medium-Fine
  coffeeDoseGrams!: number;
  waterAmountMl!: number;
  waterTempCelsius?: number;
  brewTimeSeconds?: number;
  rating!: number; // 1 - 5 stars
  tastingNotes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
