import { $http } from "@/service/axios";
import { createFormData } from "@/utils";

export interface IMakeAppealApiInput {
  fileType: string;
  file: File;
  userId: string;
}

export const makeAppealApi = async (
  payload: IMakeAppealApiInput,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const formData = createFormData(payload);
    const response = await $http.post(`/blocked-accounts/appeal`, formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
