import { Product } from "./products";
import { UserRole } from "./user";

export interface Chat {
  id: string;
  productId: string;
  receiverId: string;
  senderId: string;
  lastMessage?: string | null;
  isArchived: boolean;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageId?: string | null;
  lastMessageSenderId?: string | null;
  receiver?: ChatUser;
  sender?: ChatUser;
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
  role?: UserRole
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
