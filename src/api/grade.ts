"use server";

import { FetchMeta } from "@/interface/general";
import { IGrade } from "@/interface/grade";
import { getApiUrl } from "@/utils";
import { authConfig } from "@authConfig";
import { getServerSession } from "next-auth";

const fetchData = async (url: string) => {
  try {
    const session = await getServerSession(authConfig);

    const res = await fetch(getApiUrl(url), {
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

interface IGetGrades {
  grades: IGrade[];
  monthlySales: number;
  meta: FetchMeta;
}
export const monthlySales = async ({
  staffId,
}: {
  staffId: string;
}): Promise<IGetGrades> => {
  return fetchData(`/grades/${staffId}`);
};
