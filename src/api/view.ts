import { getApiUrl } from "@/utils";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { unstable_noStore } from "next/cache";
import {
  GetSellerAnalyticsResponse,
  MonthlyAnalyticsResponse,
} from "@/interface/views";

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
