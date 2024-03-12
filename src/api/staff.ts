"use server";

import { FetchMeta } from "@/interface/general";
import { User } from "@/interface/user";
import { fetchData } from "@/api/_helper";
import { IGrade, IGradeTransaction } from "@/interface/grade";
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

export const getSellersUnderStaffApi =
  async (): Promise<IGetSellersUnderStaffeApi> => {
    return fetchData("/staff/sellers");
  };

export const bonusApi = async ({ userId }: { userId: string }) => {
  return fetchData(`/bonus/${userId}`);
};

interface IGetGrades {
  grades: IGrade[];
  message?: string;
  success?: boolean;
  isError?: boolean;
  data: IGradeTransaction;
  statsOverView: PerformanceOverview;
  bonuses: Array<[string, BonusTransaction | null]>;
  staffAnalytics: {
    month: string;
    sales: number;
    gradePoint: number;
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
}): Promise<IGetGrades> => {
  const params = new URLSearchParams();

  if (month) {
    params.append("month", month || "");
  }
  return fetchData(`/staff/performance/${staffId}?${params.toString()}`);
};
