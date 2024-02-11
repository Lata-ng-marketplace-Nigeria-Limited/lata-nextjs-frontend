"use server";

import { FetchMeta, SearchQuery } from "@/interface/general";
import { Product } from "@/interface/products";
import { User } from "@/interface/user";
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
      cache: "no-cache",
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

interface IGetAllSellersAdminApi {
  isError?: boolean;
  message?: string;
  data: User[];
  meta: FetchMeta;
}

export const getAllSellersAdminApi = async ({
  page,
  limit,
}: SearchQuery): Promise<IGetAllSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(
      getApiUrl(`/analytics/admin/sellers?${params.toString()}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-cache",
      },
    );
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllSellersAdminApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getAllStaffAdminApi = async ({
  page,
  limit,
}: SearchQuery): Promise<IGetAllSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(
      getApiUrl(`/analytics/admin/staff?${params.toString()}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-cache",
      },
    );
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllSellersAdminApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IGetAllPosts {
  meta: FetchMeta;
  data: Product[];
  isError?: boolean;
  message?: string;
}

export const getAllPosts = async ({
  page,
  limit,
}: SearchQuery): Promise<IGetAllPosts> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(
      getApiUrl(`/analytics/admin/posts?${params.toString()}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        cache: "no-cache",
      },
    );
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllPosts;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};
