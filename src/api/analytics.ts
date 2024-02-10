"use server";

import { Product } from "@/interface/products";
import { getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";

export interface IAdminAnalytics {
  success: boolean;
  counts: {
    sellers: number;
    paidSellersCount: number;
    totalPosts: number;
    staff: number;
  };
  recentPosts: Product[];
  sales: {
    totalSales: number;
    monthlySales: number;
    month: string;
  };
  isError?: boolean;
  message?: string;
}

export const getAdminAnalyticsApi = async (): Promise<IAdminAnalytics> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl("/analytics/admin"), {
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
    const json = await res.text();

    if (json) {
      return JSON.parse(json);
    } else {
      return { isError: true, message: "Empty response" } as IAdminAnalytics;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};
