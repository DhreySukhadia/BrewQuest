export class CoffeeDnaEntity {
  id!: string;
  coffeeId!: string;
  acidity!: number; // 1 - 10
  body!: number; // 1 - 10
  sweetness!: number; // 1 - 10
  bitterness!: number; // 1 - 10
  aromaScore!: number; // 1 - 10
  flavorNotes!: string[]; // e.g. ['jasmine', 'citrus', 'chocolate']
  vectorEmbedding?: number[]; // Vector embedding for AI similarity search
  createdAt!: Date;
}
