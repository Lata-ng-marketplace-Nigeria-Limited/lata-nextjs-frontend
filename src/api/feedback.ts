"use server";

import {
  FeedbackType,
  ICustomerFeedback,
  IFeedback,
} from "@/interface/feedback";
import { FetchMeta } from "@/interface/general";
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

export const getCustomerFeedback = async (
  type: FeedbackType,
  page: string,
  limit: string = "10",
  viewing: string
): Promise<{
  data: IFeedback[];
  meta: FetchMeta;
  totalReceived?: number;
  totalSent?: number;
  isEmpty?: boolean;
}> => {
  try {
    const params = new URLSearchParams({
      viewing,
      type,
      page: String(page) || "1",
      limit: String(limit) || "10",
    });

    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/feedbacks?${params.toString()}`), {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-cache",
    });
    if (!res.ok) {
      throw await res.json();
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
