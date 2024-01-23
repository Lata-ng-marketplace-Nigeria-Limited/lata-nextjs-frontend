import { $httpFile } from "@/service/axios";
import { Product } from "@/interface/products";
import { createFormData } from "@/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";

export interface CreateProductApiInput {
  name: string;
  state: string;
  city: string;
  price: number;
  description: string;
  discount?: string;
  categoryId: string;
  subCategoryId: string;
  files: FileList;
  selectedImage?: string;
  deleteImages?: string;
  selectedCategory?: string;
}

interface CreateProductApiOutput {
  message: string;
  product: Product;
  limitRemaining: number;
  planName: string;
  subscriptionName: string;
  msg: string;
}
export const createAProductApi = async (
  payload: CreateProductApiInput,
): Promise<CreateProductApiOutput> => {
  try {
    const formData = createFormData(payload);
    const res = await $httpFile.post(`products`, formData);
    return res.data;
  } catch (error: any) {
    console.log(error?.response?.data?.error);
    throw error.response || error;
  }
};

export const updateAProductApi = async (
  id: string,
  payload: Partial<CreateProductApiInput>,
): Promise<{
  message: string;
  product: Product;
}> => {
  try {
    const formData = createFormData(payload);
    const res = await $httpFile.put(`products/${id}`, formData);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
