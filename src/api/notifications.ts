"use server";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { Notification } from "@/interface/Notification";
import { getApiUrl } from "@/utils";
import { User } from "@/interface/user";
import { $http } from "@/service/axios";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import {
  revalidatePath,
  revalidateTag,
  unstable_noStore as noStore,
} from "next/cache";

export const findAllNotificationsApi = async ({
  page,
  limit,
}: SearchQuery): Promise<{
  meta: FetchMeta;
  data: Notification[];
  userData: User;
}> => {
  try {
    noStore();
    const session = await getServerSession(authConfig);
    const response = await fetch(
      getApiUrl(`/notifications?page=${page}&limit=${limit})`),
      {
        headers: { Authorization: "Bearer " + session?.token },
        cache: "no-cache",
      },
    );
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
): Promise<{
  message: string;
}> => {
  try {
    const response = await $http.put("/notifications/read/" + id);
    revalidatePath("/notifications");
    revalidateTag("user_tag");
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const readAllNotificationApi = async (): Promise<{
  message: string;
}> => {
  try {
    const response = await $http.put("/notifications/read-all");
    revalidatePath("/notifications");
    revalidateTag("user_tag");
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
