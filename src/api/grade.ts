"use server";

import { FetchMeta } from "@/interface/general";
import { IGrade } from "@/interface/grade";
import { getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";

interface IGetGrades {
  data: IGrade[];
  meta: FetchMeta;
}
export const getGradesApi = async (): Promise<IGetGrades> => {
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl("/grades"), {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "no-cache",
    });
    if (!res.ok) {
      throw await res.json();
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
