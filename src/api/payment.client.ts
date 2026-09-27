import { $http } from "@/service/axios";
import { Transaction } from "@/interface/payment";
import { User } from "@/interface/user";

export interface PromotionSettings {
  id: number;
  amount: number;
  durationDays: number;
  isEnabled: boolean;
  badgeLabel: string;
  modalDescription?: string | null;
  cashbackPercentage?: number;
  isCashbackEnabled?: boolean;
}

export const getPromotionSettingsApi = async (): Promise<{
  message: string;
  settings: PromotionSettings;
}> => {
  try {
    const res = await $http.get("/payments/promotion-settings");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updatePromotionSettingsApi = async (payload: {
  amount?: number;
  durationDays?: number;
  isEnabled?: boolean;
  badgeLabel?: string;
  modalDescription?: string;
  cashbackPercentage?: number;
  isCashbackEnabled?: boolean;
}): Promise<{
  message: string;
  settings: PromotionSettings;
}> => {
  try {
    const res = await $http.put("/admin/promotion-settings", payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getSingleProductPromotionCredentialsApi = async (
  productId: string,
  promoCode?: string,
): Promise<{
  message: string;
  amountToPay: number;
  originalAmount?: number;
  discountApplied?: number;
  settings?: PromotionSettings;
  paystackConfig: any;
}> => {
  try {
    const res = await $http.post("/payments/single-product-promotion", {
      productId,
      promoCode,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const verifySingleProductPromotionPaymentApi = async (
  reference: string,
): Promise<{ message: string; transaction: Transaction; userData: User }> => {
  try {
    const res = await $http.post("/transactions", { reference });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
