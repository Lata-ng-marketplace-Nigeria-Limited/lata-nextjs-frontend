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

export const getChatsApi = async () => {
  try {
    const res = await $http.get(`chats`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getChatByIdApi = async (id: string) => {
  try {
    const res = await $http.get(`chats/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
