"use server";

import { FetchMeta } from "@/interface/general";
import { User } from "@/interface/user";
import { getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";

interface IGetStaffApi {
  data: User;
  admin: User;
  message?: string;
  success?: boolean;
  isError?: boolean;
  totalSellers?: number;
}
export const getStaffApi = async ({
  staffId,
}: {
  staffId: string;
}): Promise<IGetStaffApi> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl(`/staff/${staffId}`), {
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
      } as IGetStaffApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IGetSellersUnderStaffeApi {
  data: User[];
  staff?: User;
  meta: FetchMeta;
  message?: string;
  success?: boolean;
  isError?: boolean;
}

export const getSellersUnderStaffApi = async ({
  staffId,
}: {
  staffId: string;
}): Promise<IGetSellersUnderStaffeApi> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);

    if (!staffId) {
      return {
        isError: true,
        message: "Staff Id is required",
      } as IGetSellersUnderStaffeApi;
    }

    const res = await fetch(getApiUrl(`/staff/${staffId}/sellers`), {
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
      } as IGetSellersUnderStaffeApi;
    }
  } catch (error: any) {
    throw error.response || error;
  }
};
