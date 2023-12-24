export interface Notification {
  id: string;
  userId: string;
  data: NotificationData;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  action: NotificationAction;
  image: string;
  title?: string;
  url?: string;
  modal?: NotificationModel;
  name?: string,
  phoneNumber?: string,
  email?: string,
  userId?: string,
  productId?: string,
  [key: string]: any;
}
export type NotificationAction = "NAVIGATE" | "OPEN_URL" | "MODAL" | "NONE";

export type NotificationModel = 'PRODUCT_VIEW'
