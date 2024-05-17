"use server";

import { BlockedAccount } from "@/interface/blockedAccounts";
import { getApiUrl } from "@/utils";

interface IGetBlockedUserDetailsApi {
  data?: BlockedAccount;
  message: string;
  success: boolean;
}

export const getBlockedUserDetailsApi = async (
  userId: string,
): Promise<IGetBlockedUserDetailsApi> => {
  try {
    const res = await fetch(getApiUrl(`/blocked-accounts/${userId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      return {
        message: "Error fetching blocked user details",
        success: false,
      };
    }
    return await res.json();
  } catch (error: any) {
    throw error.response;
  }
};
