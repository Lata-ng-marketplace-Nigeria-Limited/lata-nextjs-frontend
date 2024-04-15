"use server";

import { Plan, Subscription } from "@/interface/payment";
import { User } from "@/interface/user";
import { appendQueryParams, getApiUrl } from "@/utils";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { $http } from "@/service/axios";
import { revalidatePath, revalidateTag } from "next/cache";
import { ADMIN_EDIT_PLAN_ROUTE } from "@/constants/routes";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const getAllSubscriptionsApi = async (
  queries?: SwitchedRoleQueries,
): Promise<{
  subscriptions: Subscription[];
  userData: User;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/subscriptions?${params}`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session?.token,
      },
      next: {
        tags: ["getAllSubscriptionsApi"],
      },
    });

    if (!res.ok) {
      throw await res.json();
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const updatePlanApi = async (params: {
  id: string;
  price: number;
  discount: number;
  queries?: SwitchedRoleQueries;
}): Promise<Plan> => {
  try {
    const { id, price, discount, queries } = params;
    const parameters = appendQueryParams(queries || {});

    const res = await $http.put(`/plans/${id}?${parameters}`, { price, discount });
    revalidatePath(ADMIN_EDIT_PLAN_ROUTE);
    revalidateTag("getAllSubscriptionsApi");
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
