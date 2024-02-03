import { User } from "next-auth";
import { Product } from "./products";

export type FeedbackType = "PRODUCT" | "SUPPORT" | "TRANSACTION" | "OTHER";
export type FeedbackRating = 3 | 2 | 1;
export interface ICustomerFeedback {
  id?: string;
  productId: string;
  transactionId?: string;
  description: string;
  rating: number;
  reference?: string;
  type: FeedbackType;
  userId?: string;
  sender?: string;
  meta?: string;
}

export interface IFeedback {
  id: string | null;
  userId: string | null;
  productId: string | null;
  sellerId: string | null;
  transactionId: string | null;
  type: FeedbackType;
  description: string;
  rating: FeedbackRating;
  meta: null | null;
  reference: string | null;
  responseComment: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  product?: Product;
  sender?: string;
  user?: User;
}
