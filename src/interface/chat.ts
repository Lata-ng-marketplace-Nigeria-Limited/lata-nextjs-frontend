import { Product } from "./products";

export interface Chat {
  id: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  lastMessage?: string | null;
  isArchived: boolean;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageId?: string | null;
  lastMessageSenderId?: string | null;
  seller?: ChatUser;
  buyer?: ChatUser;
  product?: Omit<Product, "user" | "category" | "files">;
  messages?: ChatMessage[];
  lastMessageData?: ChatMessage;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string | null;
  email: string;
  phoneNumber?: string | null;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  message: string;
  isRead: boolean;
  isEdited: boolean;
  fileId?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
