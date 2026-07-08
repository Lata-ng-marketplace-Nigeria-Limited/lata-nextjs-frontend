import { $httpFile } from "@/service/axios";

export interface CreateReelInput {
  title: string;
  description?: string;
  file: File;
}

export const createReelApi = async (
  payload: CreateReelInput
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    if (payload.description) {
      formData.append("description", payload.description);
    }
    formData.append("file", payload.file);

    const res = await $httpFile.post("reels", formData, {
      headers: {
        "X-Client-Platform": "web",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error creating reel:", error?.response?.data);
    throw error.response || error;
  }
};

export const deleteReelApi = async (id: string, deleteReason?: string): Promise<any> => {
  try {
    const params: Record<string, string> = {};
    if (deleteReason) {
      params.delete_reason = deleteReason;
    }
    const res = await $httpFile.delete(`reels/${id}`, { params });
    return res.data;
  } catch (error: any) {
    console.error("Error deleting reel:", error?.response?.data);
    throw error.response || error;
  }
};
