export class AnalyticsEventEntity {
  id!: string;
  userId?: string;
  eventName!: string; // e.g., 'coffee_view', 'recommendation_click', 'brew_logged'
  metadata?: Record<string, unknown>;
  createdAt!: Date;
}
