import { $http } from "@/service/axios";

export interface CreateLoanApiInput {
  amount: number;
  purpose: string;
  duration: number;
  monthlyIncome: number;
  employmentStatus: string;
  bvn?: string;
  additionalInfo?: string;
}

export const createLoanApi = async (
  data: CreateLoanApiInput,
): Promise<{ message: string }> => {
  try {
    const response = await $http.post("/loans", data);
    return response.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
