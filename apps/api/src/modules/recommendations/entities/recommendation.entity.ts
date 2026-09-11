export class RecommendationEntity {
  id!: string;
  userId!: string;
  coffeeId!: string;
  matchScore!: number; // 0 - 100 percentage match
  reasoning!: string; // AI explanation for match
  createdAt!: Date;
}
