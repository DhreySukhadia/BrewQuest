export class BeaniiChatEntity {
  id!: string;
  userId!: string;
  prompt!: string;
  completion!: string;
  recommendedCoffeeIds?: string[];
  createdAt!: Date;
}
