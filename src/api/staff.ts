"use server";

import { FetchMeta } from "@/interface/general";
import { User } from "@/interface/user";
import { fetchData } from "@/api/_helper";
import { IGrade, IGradeTransaction } from "@/interface/grade";

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
  statsOverView: {
    allTimeTotalSales: number;
    highestSales: number | null;
    lowestSales: number | null;
    bestMonth: string | null;
    worstMonth: string | null;
    month: string | null;
    monthlySales: number;
  };
}
export const staffPerformance = async ({
  staffId,
}: {
  staffId: string;
}): Promise<IGetGrades> => {
  return fetchData(`/staff/performance/${staffId}`);
};
