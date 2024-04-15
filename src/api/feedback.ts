"use server";

import {
  FeedbackType,
  ICustomerFeedback,
  IFeedback,
} from "@/interface/feedback";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { SwitchedRoleQueries } from "@/interface/switchedRole";
import { $http } from "@/service/axios";
import { appendQueryParams, getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

interface MessageLataApiInput {
  message: string;
  queries?: SwitchedRoleQueries;
}

export const messageLataApi = async ({
  message,
  queries,
}: MessageLataApiInput): Promise<{
  message: string;
}> => {
  const params = appendQueryParams(queries || {});
  const payload = {
    message,
  };
  try {
    const response = await $http.post(
      `/feedbacks/message-lata?${params}`,
      payload,
    );
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const saveCustomerFeedback = async (
  payload: ICustomerFeedback,
  queries: SwitchedRoleQueries,
) => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/feedbacks?${params}`), {
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
  queries: IFeedbackQuery,
): Promise<{
  data: IFeedback[];
  meta: FetchMeta;
  totalReceived?: number;
  totalSent?: number;
  isEmpty?: boolean;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/feedbacks?${params}`), {
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

interface IGetProductFeedbackQueries extends SwitchedRoleQueries, SearchQuery {}

export const getProductFeedback = async (
  productId: string,
  queries: IGetProductFeedbackQueries,
): Promise<{
  data: IFeedback[];
  meta: FetchMeta;
  isEmpty?: boolean;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(
      getApiUrl(`/feedbacks/product/${productId}?${params}`),
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
