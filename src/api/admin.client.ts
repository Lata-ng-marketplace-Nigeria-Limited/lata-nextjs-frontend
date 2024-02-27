import { $http } from "@/service/axios";
import { createFormData } from "@/utils";

interface IChangeManagerApi {
  sellerId: string;
  managerId: string;
}

export const changeManagerApi = async (
  data: IChangeManagerApi,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const formData = createFormData(data);
    const response = await $http.put("/admin/change-manager", formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteFeedbackApi = async (
  id: string,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const response = await $http.delete("/feedbacks/" + id);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const blockUserApi = async ({
  userId,
}: {
  userId: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await $http.get(`/users/block/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteUserApi = async ({
  id,
}: {
  id: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await $http.delete(`/users/delete/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
