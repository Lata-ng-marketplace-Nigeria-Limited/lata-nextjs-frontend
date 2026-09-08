"use server";

import { getApiUrl } from "@/utils";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface ProductRequestUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber?: string;
  role?: string;
}

export interface ProductRequestCategory {
  id: string;
  name: string;
  image?: string;
}

export interface ProductRequestSubCategory {
  id: string;
  name: string;
}

export interface ProductRequest {
  id: string;
  userId: string;
  categoryId: string;
  subCategoryId?: string | null;
  title: string;
  description?: string | null;
  budget?: number | null;
  state?: string | null;
  city?: string | null;
  status: "OPEN" | "FULFILLED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  user: ProductRequestUser;
  category: ProductRequestCategory;
  subCategory?: ProductRequestSubCategory | null;
}

export interface ProductRequestsResponse {
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
  };
  data: ProductRequest[];
}

export const getProductRequestsApi = async (queries?: {
  page?: number | string;
  limit?: number | string;
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
  state?: string;
  status?: string;
}): Promise<ProductRequestsResponse | null> => {
  try {
    const params = new URLSearchParams();
    if (queries?.page) params.append("page", String(queries.page));
    if (queries?.limit) params.append("limit", String(queries.limit));
    if (queries?.categoryId) params.append("categoryId", queries.categoryId);
    if (queries?.subCategoryId) params.append("subCategoryId", queries.subCategoryId);
    if (queries?.search) params.append("search", queries.search);
    if (queries?.state) params.append("state", queries.state);
    if (queries?.status) params.append("status", queries.status);

    const url = `/product-requests?${params.toString()}`;
    const session = await auth();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.token) {
      headers["Authorization"] = `Bearer ${session.token}`;
    }

    const res = await fetch(getApiUrl(url), {
      method: "GET",
      headers,
      next: {
        revalidate: 0,
        tags: ["product_requests"],
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error: any) {
    if (error && (error.digest === "DYNAMIC_SERVER_USAGE" || error.message?.includes("Dynamic server usage"))) {
      throw error;
    }
    console.error("Error in getProductRequestsApi:", error);
    return null;
  }
};

export const createProductRequestApi = async (payload: {
  title: string;
  description?: string;
  categoryId: string;
  subCategoryId?: string;
  budget?: number;
  state?: string;
  city?: string;
}) => {
  try {
    const session = await auth();
    if (!session || !session.token) {
      throw new Error("You must be logged in to create a product request");
    }

    const res = await fetch(getApiUrl("/product-requests"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create product request");
    }

    revalidatePath("/requests");
    return data;
  } catch (error: any) {
    console.error("Error in createProductRequestApi:", error);
    throw error;
  }
};

export const respondToProductRequestApi = async (requestId: string) => {
  try {
    const session = await auth();
    if (!session || !session.token) {
      throw new Error("You must be logged in to chat with the buyer");
    }

    const res = await fetch(getApiUrl(`/product-requests/${requestId}/respond`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to respond to product request");
    }

    return data;
  } catch (error: any) {
    console.error("Error in respondToProductRequestApi:", error);
    throw error;
  }
};

export const closeProductRequestApi = async (requestId: string) => {
  try {
    const session = await auth();
    if (!session || !session.token) {
      throw new Error("Unauthorized");
    }

    const res = await fetch(getApiUrl(`/product-requests/${requestId}/close`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to close product request");
    }

    revalidatePath("/requests");
    return data;
  } catch (error: any) {
    console.error("Error in closeProductRequestApi:", error);
    throw error;
  }
};
