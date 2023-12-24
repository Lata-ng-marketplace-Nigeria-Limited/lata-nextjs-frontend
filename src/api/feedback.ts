"use server";

import { $http } from "@/service/axios";

interface MessageLataApiInput {
  message: string;
}

export const messageLataApi = async (
  payload: MessageLataApiInput,
): Promise<{
  message: string;
}> => {
  try {
    const response = await $http.post("/feedbacks/message-lata", payload);
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
