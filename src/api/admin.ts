"use server";

import { IFeedback } from "@/interface/feedback";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { IProductStatusCount, Product } from "@/interface/products";
import { ISubscribedUser, User } from "@/interface/user";
import { getApiUrl, getMonthInGMTPlus1 } from "@/utils";
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
  recentPosts: {
    data: Product[];
    meta: FetchMeta;
  };
  sales: {
    totalSales: number;
    monthlySales: number;
    month: string;
  };
  isError?: boolean;
  message?: string;
}

export const getAdminAnalyticsApi = async (
  selectedMonth?: string,
): Promise<IAdminAnalytics> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const month = selectedMonth || getMonthInGMTPlus1().toString();

    const res = await fetch(getApiUrl(`/admin/analytics?month=${month}`), {
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
  countVerifiedSellers: number;
  countUnVerifiedSellers: number;
  usersWithNoUploadsCount: number;
}

export const getAllSellersAdminApi = async ({
  page,
  limit,
  verified,
}: SearchQuery & { verified: string }): Promise<IGetAllSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (verified) {
    params.append("verified", verified);
  }

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl(`/admin/sellers?${params.toString()}`), {
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

    const res = await fetch(getApiUrl(`/admin/staff?${params.toString()}`), {
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllSellersAdminApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IGetAllPaidSellersAdminApi {
  isError?: boolean;
  message?: string;
  data: ISubscribedUser[];
  meta: FetchMeta;
  activeSubscriptionCount: number;
  dueSubscriptionCount: number;
  newSubscriptionCount: number;
  unSubscribedUsersCount: number;
  returningSubscribersCount: number;
}

export const getAllPaidSellersAdminApi = async ({
  page,
  limit,
  transactionStatus,
}: SearchQuery & {
  transactionStatus: string;
}): Promise<IGetAllPaidSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (transactionStatus) {
    params.append("transactionStatus", transactionStatus);
  }

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(
      getApiUrl(`/admin/paid-sellers?${params.toString()}`),
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
      } as IGetAllPaidSellersAdminApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IGetAllBuyersAdminApi {
  isError?: boolean;
  message?: string;
  data: User[];
  meta: FetchMeta;
  countVerifiedBuyers: number;
  countUnverifiedBuyers: number;
}

export const getAllBuyersAdminApi = async ({
  page,
  limit,
  verified,
}: SearchQuery & { verified: string }): Promise<IGetAllBuyersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (verified) {
    params.append("verified", verified);
  }

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl(`/admin/buyers?${params.toString()}`), {
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllBuyersAdminApi;
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

    const res = await fetch(getApiUrl(`/admin/posts?${params.toString()}`), {
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetAllPosts;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IGetProtectedSellerApi {
  data: User & {
    approvedPosts: number;
    cancelledPosts: number;
    totalPosts: number;
    planDuration: string;
    planName: string;
    managerName: string;
  };
  isError?: boolean;
  message?: string;
  feedbacks?: IFeedback[];
  managers?: User[];
}
export const getProtectedSellerApi = async ({
  sellerId,
}: {
  sellerId: string;
}): Promise<IGetProtectedSellerApi> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl(`/admin/seller/${sellerId}`), {
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
      return {
        isError: true,
        message: "Empty response",
      } as IGetProtectedSellerApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IFindAllSellerProductsApi {
  data: Product[];
  seller: User;
  meta: FetchMeta;
  message: string;
  isEmpty: boolean;
  statusCounts: IProductStatusCount;
}

export const findAllSellerProductsApi = async ({
  page,
  limit,
  status,
  sellerId,
}: SearchQuery & {
  sellerId: string;
  status?: string;
}): Promise<IFindAllSellerProductsApi> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);
    const params = new URLSearchParams();

    if (status) {
      params.append("status", status || "");
    }
    params.append("page", String(page || 1));
    params.append("limit", String(limit || 10));

    const res = await fetch(
      getApiUrl(`/admin/seller-shop/${sellerId}?${params.toString()}`),
      {
        headers: {
          Authorization: "Bearer " + session?.token,
        },
        cache: "no-cache",
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
