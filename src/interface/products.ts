import { FileData } from "./file";
import { Status } from "./general";
import { User } from "./user";

export interface FindAProductData {
  message: string;
  product: Product;
  similarProducts?: Product[];
  viewed?: boolean;
  isOwner: boolean;
  userData?: User;
}

export interface Product {
  id: string;
  name: string;
  location: string;
  price: number;
  description: string;
  meta: {
    planName?: string;
    selectedImage?: string;
    [key: string]: any;
  };
  userId: string;
  status: Status;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  files: FileData[];
  user: User;
  category: Category;
  views?: number;
  saved?: number;
  planName?: string;
}

export interface Category {
  id: string;
  name: string;
  description: null | string;
  meta: null | Record<string, any>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedProduct {
  id: string;
  userId: string;
  productId: string;
  productOwnerId: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}
