"use server";

import { ITarget, ITargetTransaction } from "@/interface/target";
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

interface IGetTarget {
  targets: ITarget[];
  message?: string;
  success?: boolean;
  isError?: boolean;
  data: ITargetTransaction;
  statsOverView: {
    totalSales: number;
    highestSales: number;
    lowestSales: number;
    bestMonth: string;
    worstMonth: string;
  };
}
// export const staffPerformance = async ({
//   staffId,
// }: {
//   staffId: string;
// }): Promise<IGetGrades> => {
//   return fetchData(`/grades/${staffId}`);
// };
