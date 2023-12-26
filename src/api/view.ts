import { getApiUrl } from "@/utils";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { unstable_noStore } from "next/cache";

interface AnalyticsClicksData {
  clicks: number;
}
export interface GetSellerAnalyticsResponse {
  isError?: boolean;
  message?: string;
  data: {
    phone: AnalyticsClicksData;
    product: AnalyticsClicksData;
    message: AnalyticsClicksData;
    month?: string;
  };
}

export const getSellerAnalyticsApi = async (
  month?: string
): Promise<GetSellerAnalyticsResponse> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(month ? `/views/${month}` : "/views"), {
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
