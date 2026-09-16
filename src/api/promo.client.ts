import { $http } from "@/service/axios";

export interface PromoCode {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  targetType:
    | "ALL"
    | "FIRST_TIME_POSTERS"
    | "SUBSCRIBED_SELLERS"
    | "CATEGORY_SELLERS"
    | "SPECIFIC_USER";
  targetCategoryId?: string | null;
  targetUserId?: string | null;
  targetUser?: any;
  applicableTo: "SINGLE_PRODUCT_PROMOTION" | "SUBSCRIPTION" | "BOTH";
  maxUses?: number | null;
  usesCount: number;
  maxUsesPerUser: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const validatePromoCodeApi = async (
  code: string,
  productId?: string,
): Promise<{
  message: string;
  valid: boolean;
  discountAmount: number;
  finalAmount: number;
  code: string;
}> => {
  try {
    const res = await $http.post("/payments/validate-promo-code", {
      code,
      productId,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getAdminPromoCodesApi = async (
  page = 1,
  status?: string,
): Promise<{
  message: string;
  meta: any;
  data: PromoCode[];
}> => {
  try {
    const res = await $http.get(
      `/admin/promo-codes?page=${page}&status=${status || ""}`,
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const createAdminPromoCodeApi = async (payload: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  targetType:
    | "ALL"
    | "FIRST_TIME_POSTERS"
    | "SUBSCRIBED_SELLERS"
    | "CATEGORY_SELLERS"
    | "SPECIFIC_USER";
  targetCategoryId?: string;
  targetUserId?: string;
  targetUserEmail?: string;
  applicableTo?: "SINGLE_PRODUCT_PROMOTION" | "SUBSCRIPTION" | "BOTH";
  maxUses?: number;
  maxUsesPerUser?: number;
  expiresAt?: string;
  isActive?: boolean;
}): Promise<{
  message: string;
  promoCode: PromoCode;
}> => {
  try {
    const res = await $http.post("/admin/promo-codes", payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateAdminPromoCodeApi = async (
  id: string,
  payload: Partial<PromoCode>,
): Promise<{
  message: string;
  promoCode: PromoCode;
}> => {
  try {
    const res = await $http.put(`/admin/promo-codes/${id}`, payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const deleteAdminPromoCodeApi = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const res = await $http.delete(`/admin/promo-codes/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const sendPromoBroadcastEmailApi = async (
  id: string,
): Promise<{ message: string; recipientCount: number }> => {
  try {
    const res = await $http.post(`/admin/promo-codes/${id}/broadcast`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
