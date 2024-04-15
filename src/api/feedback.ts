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
import { revalidateTag } from "next/cache";

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
    revalidateTag("product-feedback");
    return await res.json();
  } catch (error: any) {
    console.log(error);
    if (error.isOwnProduct) {
      return error.response || error;
    }
    throw error.response || error;
  }
};

export interface IFeedbackQuery {
  tab: string;
  type: FeedbackType;
  page: string;
  uid: string;
  sessionSwitch: string;
  role: string;
}

export const getAllSellerFeedbacks = async (
  query: IFeedbackQuery,
): Promise<{
  data: IFeedback[];
  meta: FetchMeta;
  totalReceived?: number;
  totalSent?: number;
  isEmpty?: boolean;
}> => {
  try {
    const params = new URLSearchParams();
    params.append("page", query?.page);
    if (query?.tab) {
      params.append("tab", query?.tab);
    }
    if (query?.type) {
      params.append("type", query?.type);
    }

    if (query?.uid) {
      params.append("uid", query?.uid);
    }
    if (query?.sessionSwitch) {
      params.append("sessionSwitch", query?.sessionSwitch);
    }

    if (query?.role) {
      params.append("role", query?.role);
    }

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

export interface IGetProductFeedback {
  data: IFeedback[];
  meta: FetchMeta;
  isEmpty?: boolean;
}

export const getProductFeedback = async (
  productId: string,
  page?: string,
): Promise<{
  data: IFeedback[];
  meta: FetchMeta;
  isEmpty?: boolean;
}> => {
  try {
    const params = new URLSearchParams({
      page: String(page) || "1",
    });

    const session = await getServerSession(authConfig);
    const res = await fetch(
      getApiUrl(`/feedbacks/product/${productId}?${params.toString()}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-cache",
        next: {
          tags: ["product-feedback"],
        },
      },
    );
    if (!res.ok) {
      throw await res.json();
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
