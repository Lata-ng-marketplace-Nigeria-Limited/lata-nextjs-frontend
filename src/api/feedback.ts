"use server";

import { ICustomerFeedback } from "@/interface/feedback";
import { $http } from "@/service/axios";
import { getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";

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



export const saveCustomerFeedback = async (payload: ICustomerFeedback) => {
  if (!payload) throw new Error("Payload is required");
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl("/feedbacks"), {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    if (!res.ok) throw await res.json();
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
