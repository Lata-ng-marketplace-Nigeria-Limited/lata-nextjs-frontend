"use server";

import { $http } from "@/service/axios";

interface CreateChatInput {
  message: string;
  productId?: string;
  senderId?: string; //formerly buyerId
  receiverId?: string; //formerly sellerId
}

export const createChatApi = async (payload: CreateChatInput) => {
  try {
    const res = await $http.post(`chats`, payload);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
