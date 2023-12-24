import { Category } from "@/interface/products";
import FetchService from "@/service/fetch";
import { getApiUrl } from "@/utils";

export const getAllCategoriesApi = async (): Promise<Category[]> => {
  try {
    const res = await fetch(getApiUrl("/categories"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (error: any) {
    throw error.response;
  }
};
