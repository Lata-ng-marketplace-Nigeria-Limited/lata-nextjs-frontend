import {  SubCategory } from "@/interface/products";
import { getApiUrl } from "@/utils";

export const getAllSubcategoriesApi = async (): Promise<SubCategory[]> => {
  try {
    const res = await fetch(getApiUrl("/sub-categories"), {
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
