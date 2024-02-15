import { Status } from "./general";
import { FileData } from "./file";
import { Plan, Transaction, Wallet } from "./payment";
import { Product, SavedProduct } from "./products";
import { Chat } from "./chat";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  aboutBusiness?: string;
  meta?: UserMeta | IAddedUserMeta;
  googleIntegration?: string;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  subscriptionId?: string;
  planId?: string;
  subscriptionStatus?: Status;
  subscriptionExpiryDate?: string;
  subscriptionPaidAt?: string;
  settings: Settings[];
  files: FileData[];
  wallet: Wallet | null;
  plan: Plan | null;
  chats: Chat[];
  profileViews: number;
  productViews: number;
  myOwnProductsSavedCount: number;
  products: Product[];
  savedProducts: SavedProduct[];
  notifications: { id: string; userId: string }[];
  createdAt: string;
  updatedAt: string;
  expires_at: string;
  managedBy: string;
}

export type UserRole = "BUYER" | "SELLER" | "ADMIN" | "STAFF";

export interface UserMeta {
  avatarFileName?: string;
  ip?: string;
  user_agent?: string;
  logged_in_at?: string;
  [key: string]: any;
}

export interface IAddedUserMeta{
  manager: User
}

export interface Settings {
  id: string;
  userId: string;
  columnName: string;
  columnValue: Record<string, any>;
  type: string;
  meta: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizeResponse {
  authorized: boolean;
  isEmailVerified: boolean;
  publicToken?: string;
  message?: string;
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
  token?: string;
  shouldCompleteProfile?: boolean;
}
