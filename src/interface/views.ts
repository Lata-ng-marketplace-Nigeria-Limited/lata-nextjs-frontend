export type ViewTypes =
  | "PRODUCT"
  | "PROFILE"
  | "VIEW"
  | "MESSAGE"
  | "PHONE"
  | "OTHER";

export interface CreateViewTypes {
  type: ViewTypes;
  productId: string;
  userId: string;
}
