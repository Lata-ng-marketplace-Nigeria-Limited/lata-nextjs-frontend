import { $http } from "@/service/axios";
import { createFormData } from "@/utils";

export type EmailBroadcastCategory =
  | "all"
  | "sellers"
  | "buyers"
  | "sellers_with_properties"
  | "sellers_without_properties"
  | "verified_users"
  | "unverified_users"
  | "active_subscribers"
  | "expired_subscribers"
  | "never_subscribed";

export type EmailTemplateType = "custom" | "announcement" | "promotion";

export const getUserCountByCategoryApi = async (
  category: EmailBroadcastCategory,
): Promise<{
  success: boolean;
  message: string;
  data: { category: EmailBroadcastCategory; count: number };
}> => {
  try {
    const response = await $http.get("/admin/email-broadcast/user-count", {
      params: { category },
    });
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const sendBroadcastEmailApi = async (payload: {
  category: EmailBroadcastCategory;
  subject: string;
  message: string;
  templateType?: EmailTemplateType;
}): Promise<{
  success: boolean;
  message: string;
  data: { totalRecipients: number; category: EmailBroadcastCategory };
}> => {
  try {
    const response = await $http.post("/admin/email-broadcast/send", payload);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

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
    const response = await $http.post("/blocked-accounts", payload);
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

export const createStateApi = async (payload: {
  name: string;
  countryName: string;
  isActive: boolean;
}) => {
  try {
    const response = await $http.post(`/states`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

interface CreateCityInput {
  name: string;
  stateId: string;
  isActive: boolean;
}

export const createCityApi = async (payload: CreateCityInput) => {
  try {
    const response = await $http.post(`/cities`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteStateApi = async (id: string) => {
  try {
    const response = await $http.delete(`/states/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteCityApi = async (id: string) => {
  try {
    const response = await $http.delete(`/cities/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
