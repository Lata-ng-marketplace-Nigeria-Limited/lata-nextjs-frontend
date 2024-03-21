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

export const blockUserApi = async (payload: {
  userId: string;
  block: boolean;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await $http.post("/block", payload);
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

export const createCategoryApi = async (payload: {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
  file: File;
}) => {
  try {
    const formData = createFormData(payload);
    const response = await $http.post("/categories", formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteCategoryApi = async (id: string) => {
  try {
    const response = await $http.delete(`/categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteSubcategoryApi = async (id: string) => {
  try {
    const response = await $http.delete(`/sub-categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const createSubCategoryApi = async (payload: {
  categoryName: string;
  categoryId: string;
  name: string;
}) => {
  try {
    const response = await $http.post(`/sub-categories`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
