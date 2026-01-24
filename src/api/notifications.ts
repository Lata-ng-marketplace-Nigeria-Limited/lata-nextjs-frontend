"use server";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { Notification } from "@/interface/Notification";
import { appendQueryParams, getApiUrl } from "@/utils";
import { User } from "@/interface/user";
import { $http } from "@/service/axios";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export interface IFindAllNotificationsApiQueries
  extends SwitchedRoleQueries,
  SearchQuery { }
export const findAllNotificationsApi = async (
  queries: IFindAllNotificationsApiQueries,
): Promise<{
  meta: FetchMeta;
  data: Notification[];
  userData: User;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await auth();
    const response = await fetch(getApiUrl(`/notifications?${params})`), {
      headers: { Authorization: "Bearer " + session?.token },
      next: {
        revalidate: 30, // 30 seconds for notifications
        tags: ["notifications"],
      },
    });
    if (!response.ok) {
      throw JSON.stringify(await response.json());
    }
    return await response.json();
  } catch (error: any) {
    throw error;
  }
};

export const readNotificationApi = async (
  id: string,
  queries?: SwitchedRoleQueries,
): Promise<{
  message: string;
}> => {
  const params = appendQueryParams(queries || {});
  try {
    const response = await $http.put(`/notifications/read?${params}` + id);
    revalidatePath("/notifications");
    revalidateTag("user_tag", "default");
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const readAllNotificationApi = async (queries?: SwitchedRoleQueries,): Promise<{
  message: string;
}> => {
  const params = appendQueryParams(queries || {});
  try {
    const response = await $http.put(`/notifications/read-all?${params}`);
    revalidatePath("/notifications");
    revalidateTag("user_tag", "default");
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
