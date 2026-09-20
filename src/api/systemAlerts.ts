import { $http } from "@/service/axios";

export type AlertType = "banner" | "modal" | "toast";
export type AlertSeverity = "promo" | "info" | "warning" | "success";
export type AlertTargetAudience =
  | "all"
  | "guests"
  | "logged_in"
  | "sellers"
  | "buyers"
  | "subscribed_users"
  | "non_subscribed_users";

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  severity: AlertSeverity;
  targetAudience: AlertTargetAudience;
  ctaLabel?: string | null;
  ctaLink?: string | null;
  promoCode?: string | null;
  isActive: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getAdminAlertsApi = async (params?: { page?: number; limit?: number; status?: string }) => {
  try {
    const response = await $http.get("/admin/alerts", { params });
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};

export const createAdminAlertApi = async (payload: Partial<SystemAlert>) => {
  try {
    const response = await $http.post("/admin/alerts", payload);
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};

export const updateAdminAlertApi = async (id: string, payload: Partial<SystemAlert>) => {
  try {
    const response = await $http.put(`/admin/alerts/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};

export const toggleAdminAlertApi = async (id: string) => {
  try {
    const response = await $http.patch(`/admin/alerts/${id}/toggle`);
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};

export const deleteAdminAlertApi = async (id: string) => {
  try {
    const response = await $http.delete(`/admin/alerts/${id}`);
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};

export const getActiveAlertsApi = async (audience?: string) => {
  try {
    const response = await $http.get("/alerts/active", { params: { audience } });
    return response.data;
  } catch (error: any) {
    throw error?.data || error;
  }
};
