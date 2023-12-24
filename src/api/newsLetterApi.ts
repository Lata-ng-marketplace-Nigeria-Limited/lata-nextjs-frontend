import { $http } from "@/service/axios";

export const joinNewsLetterApi = async (
  email: string,
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await $http.post("newsletters", { email });
    return data;
  } catch (error: any) {
    throw error.response || error;
  }
};
