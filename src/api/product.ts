"use server";
import {
  FindAProductData,
  IProductStatusCount,
  Product,
  SavedProduct,
} from "@/interface/products";
import { appendQueryParams, createFormData, getApiUrl } from "@/utils";
import { FetchMeta, SearchQuery } from "@/interface/general";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { revalidatePath, revalidateTag, unstable_noStore } from "next/cache";
import { $http, $httpFile } from "@/service/axios";
import { User } from "@/interface/user";
import { ADMIN_REVIEW_PRODUCTS_ROUTE } from "@/constants/routes";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

export const getDashboardProductsApi = async (
  query?: string,
  subcategory?: string,
): Promise<{
  message: string;
  isTrending: boolean;
  trendingProducts: Product[];
  otherProducts: Product[];
} | null> => {
  // noStore();
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const params = new URLSearchParams();
    if (query) {
      params.append("category", query || "");
    }
    if (subcategory) {
      params.append("subcategory", subcategory || "");
    }

    const url = `/products/trending?${params.toString()}`;

    const res = await fetch(getApiUrl(url), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 * 10,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Fetch error:");
    return null;
  }
};

export const findAProductApi = async (
  productId: string,
  queries?: SwitchedRoleQueries,
): Promise<FindAProductData | null> => {
  const params = appendQueryParams(queries || {});

  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);
    const res = await fetch(
      getApiUrl(`/products/${productId}?${params.toString()}`),
      {
        headers: {
          Authorization: "Bearer " + session?.token,
        },
      },
    );
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export interface SearchProductsApiInput {
  search: string;
  location?: string;
  page?: string;
  limit?: string;
  token?: string;
}

export const searchProductsApi = async ({
  page,
  limit,
  token,
  ...payload
}: SearchProductsApiInput): Promise<{
  data: Product[];
  meta: FetchMeta;
  message: string;
  isEmpty: boolean;
} | null> => {
  try {
    const params = new URLSearchParams({
      page: page || "1",
      limit: limit || "10",
    });
    const resp = await fetch(
      getApiUrl(`/products/search?${params.toString()}`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!resp.ok) {
      return null;
    }
    revalidateTag("get_recent_searches_api");
    return await resp.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IFindAllMyProductsApiQueries extends SwitchedRoleQueries {
  page?: number | string;
  limit?: number | string;
  tab?: string;
}

export const findAllMyProductsApi = async (
  queries?: IFindAllMyProductsApiQueries,
): Promise<{
  data: Product[];
  meta: FetchMeta;
  message: string;
  isEmpty: boolean;
  statusCounts: IProductStatusCount;
}> => {
  try {
    unstable_noStore();
    const session = await getServerSession(authConfig);
    const params = appendQueryParams(queries || {});

    console.log("params", params);

    const res = await fetch(getApiUrl(`/products/my?${params.toString()}`), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      throw await res.json();
    }

    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

interface IFindMySavedProductsApi extends SwitchedRoleQueries {
  page?: number | string;
  limit?: number | string;
}

export const findMySavedProductsApi = async (
  queries: IFindMySavedProductsApi,
): Promise<{
  meta: FetchMeta;
  data: SavedProduct[];
  message: string;
  isEmpty: boolean;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/products/saved?${params.toString()}`), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      throw await res.json();
    }

    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const deleteAProductApi = async (
  id: string,
  queries?: SwitchedRoleQueries,
) => {
  const params = appendQueryParams(queries || {});

  try {
    const res = await $http.delete(`products/${id}?${params}`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const initializeFileUploadApi = async (): Promise<{
  message: string;
  isLive: boolean;
}> => {
  try {
    const res = await $httpFile.get("");
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export interface CreateProductApiInput {
  name: string;
  location: string;
  price: number;
  description: string;
  categoryId: string;
  files: FileList;
  selectedImage?: string;
  deleteImages?: string;
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
  payload: FormData,
  queries?: SwitchedRoleQueries,
): Promise<CreateProductApiOutput> => {
  const params = appendQueryParams(queries || {});

  try {
    const res = await $httpFile.post(`products?${params}`, payload);
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

export const saveAProductApi = async (
  productId: string,
  queries?: SwitchedRoleQueries,
): Promise<{
  message: string;
  userData: User;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const res = await $http.get(`products/save/${productId}?${params}`);
    revalidatePath("/saved");
    revalidateTag("user_tag");
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const unSaveAProductApi = async (
  productId: string,
  queries?: SwitchedRoleQueries,

): Promise<{
  message: string;
  userData: User;
}> => {
  const params = appendQueryParams(queries || {});

  try {
    const res = await $http.get(`products/un-save/${productId}?${params}`);
    revalidatePath("/saved");
    revalidateTag("user_tag");
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getRecentSearchesApi = async (queries?: SwitchedRoleQueries,): Promise<Array<string>> => {
  const params = appendQueryParams(queries || {});

  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`products/searches?${params}`), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
      next: {
        tags: ["get_recent_searches_api"],
      },
    });

    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (error: any) {
    return [];
  }
};

export interface SearchProductsApiInput extends SearchQuery {
  search: string;
  location?: string;
}

export interface GetNewProductsApiInput extends SearchQuery {
  search?: string;
}

export const getNewProductsApi = async (
  payload: GetNewProductsApiInput,
  // queries?: SwitchedRoleQueries,
): Promise<{
  data: Product[];
  meta: FetchMeta;
}> => {
  // const params = appendQueryParams(queries || {});

  try {
    const query = new URLSearchParams(payload as any).toString();
    const res = await $http.get(`products/new-products?${query}`);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const activateProductApi = async (
  id: string,
): Promise<{
  message: string;
}> => {
  try {
    const res = await $http.get(`products/activate/${id}`);
    revalidatePath(ADMIN_REVIEW_PRODUCTS_ROUTE);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const deactivateProductApi = async (
  id: string,
): Promise<{
  message: string;
}> => {
  try {
    const res = await $http.get(`products/deactivate/${id}`);
    revalidatePath(ADMIN_REVIEW_PRODUCTS_ROUTE);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
export const cancelProductApi = async (
  id: string,
): Promise<{
  message: string;
}> => {
  try {
    const res = await $http.get(`products/cancel/${id}`);
    revalidatePath(ADMIN_REVIEW_PRODUCTS_ROUTE);
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
