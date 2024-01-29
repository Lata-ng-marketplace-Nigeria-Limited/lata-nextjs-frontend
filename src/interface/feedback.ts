export type FeedbackType = "PRODUCT" | "SUPPORT" | "TRANSACTION" | "OTHER";

export interface ICustomerFeedback {
  id?: string;
  productId: string;
  transactionId?: string;
  description: string;
  rating: number;
  reference?: string;
  type: FeedbackType;
  userId?: string;
}