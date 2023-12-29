import { getApiUrl } from "@/utils";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { unstable_noStore } from "next/cache";
import { CreateViewTypes, ViewTypes } from "@/interface/views";
import { $http } from "@/service/axios";
import {
  GetSellerAnalyticsResponse,
  MonthlyAnalyticsResponse,
} from "@/interface/views";

export async function generateSellerAnalyticsApi(
  type: ViewTypes,
  productId: string,
  userId: string
) {
  try {
    const viewDetails: CreateViewTypes = {
      type,
      productId,
      userId,
    };
    const res = await $http.post("views", viewDetails);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const getSellerAnalyticsApi = async (
  month?: string
): Promise<GetSellerAnalyticsResponse> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(
      getApiUrl(month ? `/views/month/${month}` : "/views"),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    if (!res.ok) {
      const data = await res.json();
      return {
        ...data,
        isError: true,
      };
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getAnalyticsClicksAndViews =
  async (): Promise<MonthlyAnalyticsResponse> => {
    try {
      const session = await getServerSession(authConfig);
      const res = await fetch(getApiUrl("/views/all"), {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        return {
          ...data,
          isError: true,
        };
      }

      return await res.json();
    } catch (error: any) {
      throw error.response || error;
    }
  };
