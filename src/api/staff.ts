"use server";

import { FetchMeta, SearchQuery } from "@/interface/general";
import { User } from "@/interface/user";
import { fetchData } from "@/api/_helper";
import { ITarget, ITargetTransaction } from "@/interface/target";
import { BonusTransaction, PerformanceOverview } from "@/interface/staff";

interface IGetStaffApi {
  data: User;
  admin: User;
  message?: string;
  success?: boolean;
  totalSellers?: number;
}
export const getStaffApi = async ({
  staffId,
}: {
  staffId: string;
}): Promise<IGetStaffApi> => {
  return fetchData(`/staff/profile/${staffId}`);
};

interface IGetSellersUnderStaffeApi {
  data: User[];
  staff?: User;
  meta: FetchMeta;
  message?: string;
  success?: boolean;
}

export const getSellersUnderStaffApi = async ({
  page,
  limit,
}: SearchQuery): Promise<IGetSellersUnderStaffeApi> => {
  const params = new URLSearchParams();

  params.append("page", String(page || 1));
  params.append("limit", String(limit || 10));

  return fetchData(`/staff/sellers?${params.toString()}`);
};

export const bonusApi = async ({ userId }: { userId: string }) => {
  return fetchData(`/bonus/${userId}`);
};

export interface IGetTargets {
  targets: ITarget[];
  message?: string;
  success?: boolean;
  isError?: boolean;
  data: ITargetTransaction;
  statsOverView: PerformanceOverview;
  bonuses: Array<[string, BonusTransaction | null]>;
  staffAnalytics: {
    month: string;
    totalSales: number;
    targetPoint: number;
  }[];
}

// bonuses: [
//   [ 'week1', null ],
//   [ 'week2', [Object] ],
//   [ 'week3', null ],
//   [ 'week4', null ]
// ]
export const staffPerformance = async ({
  staffId,
  month,
}: {
  staffId: string;
  month?: string;
}): Promise<IGetTargets> => {
  const params = new URLSearchParams();

  if (month) {
    params.append("month", month || "");
  }
  return fetchData(`/staff/performance/${staffId}?${params.toString()}`);
};
