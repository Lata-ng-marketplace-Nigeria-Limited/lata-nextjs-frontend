import { $httpFile } from "@/service/axios";
import { Product } from "@/interface/products";
import { appendQueryParams, createFormData } from "@/utils";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export interface CreateProductApiInput {
  name: string;
  state: string;
  city: string;
  price: number;
  description: string;
  discount?: number;
  categoryId: string;
  subCategoryId: string;
  files: FileList;
  selectedImage?: string;
  deleteImages?: string;
  selectedCategory?: string;
  userId?: string;
}

interface CreateProductApiOutput {
  message: string;
  product: Product;
  limitRemaining: number;
  planName: string;
  subscriptionName: string;
  msg: string;
  savedInDraft: boolean;
}
export const createAProductApi = async (
  payload: CreateProductApiInput,
  queries?: SwitchedRoleQueries,
): Promise<CreateProductApiOutput> => {
  const params = appendQueryParams(queries || {});

  try {
    const formData = createFormData(payload);
    const res = await $httpFile.post(`products?${params}`, formData);
    return res.data;
  } catch (error: any) {
    console.log(error?.response?.data?.error);
    throw error.response || error;
  }
};

export const updateAProductApi = async (
  id: string,
  payload: Partial<CreateProductApiInput>,
  queries?: SwitchedRoleQueries,
): Promise<{
  message: string;
  product: Product;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const formData = createFormData(payload);
    const res = await $httpFile.put(`products/${id}?${params}`, formData);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
