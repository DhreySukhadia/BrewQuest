/**
 * Shared global frontend TypeScript definitions placeholder.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
