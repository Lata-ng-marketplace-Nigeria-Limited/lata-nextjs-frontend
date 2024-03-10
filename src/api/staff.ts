"use server";

import { FetchMeta } from "@/interface/general";
import { User } from "@/interface/user";
import { fetchData } from "./_helper";

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
