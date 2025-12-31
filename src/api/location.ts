"use server";

import { State } from "@/interface/location";
import { getApiUrl } from "@/utils";

interface IGetStatesApi {
  data: State[];
  message?: string;
  success?: boolean;
}
export const getAllStatesApi = async (): Promise<IGetStatesApi> => {
  try {
    const res = await fetch(getApiUrl("/states"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 86400, // 24 hours
        tags: ["all_states"],
      },
    });

    if (!res.ok) {
      return {
        data: [],
        message: "Failed to fetch states",
        success: false,
      };
    }
    return await res.json();
  } catch (error: any) {
    throw error.response;
  }
};
