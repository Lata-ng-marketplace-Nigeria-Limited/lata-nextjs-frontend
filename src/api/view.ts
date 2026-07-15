import { appendQueryParams, getApiUrl } from "@/utils";
import { auth } from "@/auth";
import { CreateViewTypes, ViewTypes } from "@/interface/views";
import { $http } from "@/service/axios";
import {
  GetSellerAnalyticsResponse,
  MonthlyAnalyticsResponse,
} from "@/interface/views";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export async function generateSellerAnalyticsApi(
  type: ViewTypes,
  productId: string | undefined,
  userId: string,
  queries?: Partial<SwitchedRoleQueries>,
  reelId?: string,
) {
  const params = appendQueryParams(queries || {});
  try {
    const viewDetails: CreateViewTypes = {
      type,
      productId,
      reelId,
      userId,
    };
    const res = await $http.post(`views?${params}`, viewDetails);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const getSellerAnalyticsApi = async ({
  month,
  queries,
}: {
  month?: string;
  queries?: SwitchedRoleQueries;
}): Promise<GetSellerAnalyticsResponse> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await auth();

    const res = await fetch(
      getApiUrl(month ? `/views/month/${month}?${params}` : `/views?${params}`),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          revalidate: 120, // 2 minutes for analytics
          tags: ["seller_analytics"],
        },
      },
    );
    if (!res.ok) {
      const data = await res.json();
      return {
        ...data,
        isError: true,
      };
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getAnalyticsClicksAndViews = async (
  queries?: SwitchedRoleQueries,
): Promise<MonthlyAnalyticsResponse> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await auth();
    const res = await fetch(getApiUrl(`/views/all?${params}`), {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      next: {
        revalidate: 120, // 2 minutes for analytics
        tags: ["analytics_clicks_views"],
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return {
        ...data,
        isError: true,
      };
    }

    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
