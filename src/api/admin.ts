"use server";

import { IFeedback } from "@/interface/feedback";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { Category, IProductStatusCount, Product } from "@/interface/products";
import { ISubscribedUser, User } from "@/interface/user";
import { getMonthInGMTPlus1 } from "@/utils";
import { fetchData } from "./_helper";

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
}

export const getAdminAnalyticsApi = async (
  selectedMonth?: string,
): Promise<IAdminAnalytics> => {
  const month = selectedMonth || getMonthInGMTPlus1().toString();
  return fetchData(`/admin/analytics?month=${month}`);
};

interface IGetAllSellersAdminApi {
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
  query,
}: SearchQuery & {
  verified: string;
  query: string;
}): Promise<IGetAllSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (verified) {
    params.append("verified", verified);
  }
  if (query) {
    params.append("query", query);
  }
  return fetchData(`/admin/sellers?${params.toString()}`);
};

export const getAllStaffAdminApi = async ({
  page,
  limit,
  query,
}: SearchQuery & { query: string }): Promise<IGetAllSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  if (query) {
    params.append("query", query);
  }

  return fetchData(`/admin/staff?${params.toString()}`);
};

interface IGetAllPaidSellersAdminApi {
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
  staffId,
  query,
}: SearchQuery & {
  transactionStatus: string;
  staffId?: string;
  query?: string;
}): Promise<IGetAllPaidSellersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (transactionStatus) {
    params.append("transactionStatus", transactionStatus);
  }
  if (staffId) {
    params.append("staffId", staffId);
  }

  if (query) {
    params.append("query", query);
  }

  return fetchData(`/admin/paid-sellers?${params.toString()}`);
};

interface IGetAllBuyersAdminApi {
  data: User[];
  meta: FetchMeta;
  countVerifiedBuyers: number;
  countUnverifiedBuyers: number;
}

export const getAllBuyersAdminApi = async ({
  page,
  limit,
  verified,
  query,
}: SearchQuery & {
  verified: string;
  query: string;
}): Promise<IGetAllBuyersAdminApi> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));
  if (verified) {
    params.append("verified", verified);
  }
  if (query) {
    params.append("query", query);
  }

  return fetchData(`/admin/buyers?${params.toString()}`);
};

interface IGetAllPosts {
  meta: FetchMeta;
  data: Product[];
}

export const getAllPosts = async ({
  page,
  limit,
  query,
}: SearchQuery & { query: string }): Promise<IGetAllPosts> => {
  const params = new URLSearchParams();
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  if (query) {
    params.append("query", query);
  }

  return fetchData(`/admin/posts?${params.toString()}`);
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
  feedbacks?: IFeedback[];
  managers?: User[];
}
export const getProtectedSellerApi = async ({
  sellerId,
}: {
  sellerId: string;
}): Promise<IGetProtectedSellerApi> => {
  return fetchData(`/admin/seller/${sellerId}`);
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
  const params = new URLSearchParams();

  if (status) {
    params.append("status", status || "");
  }
  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  return fetchData(`/admin/seller-shop/${sellerId}?${params.toString()}`);
};

interface IAdminFetchSellersUnderStaffeApi {
  data: User[];
  staff?: User;
  meta: FetchMeta;
  message?: string;
  success?: boolean;
}

export const adminFetchSellersUnderStaff = async ({
  staffId,
  limit,
  page,
}: SearchQuery & {
  staffId: string;
}): Promise<IAdminFetchSellersUnderStaffeApi> => {
  const params = new URLSearchParams();

  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  return fetchData(`/admin/${staffId}/sellers?${params.toString()}`);
};

export const fetchCategoriesApi = async ({
  limit,
  page,
}: SearchQuery): Promise<Category[]> => {
  const params = new URLSearchParams();

  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  return fetchData(`/categories`);
};

export const fetchSubCategoriesApi = async ({
  limit,
  page,
}: SearchQuery): Promise<Category[]> => {
  const params = new URLSearchParams();

  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  return fetchData(`/categories`);
};
