import { $http } from "@/service/axios";
import { createFormData } from "@/utils";

interface TargetUpdateInput {
  amount: number;
  salary: number;
  staffCategory: string;
  email?: string;
  level: string;
}

export const updateTarget = async (
  data: TargetUpdateInput,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const formData = createFormData(data);
    const response = await $http.put("/targets", formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
