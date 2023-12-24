"use server";

import { User } from "@/interface/user";
import { createFormData, getApiUrl, getCookies } from "@/utils";
import { $http } from "@/service/axios";
import { unstable_noStore as noStore } from "next/cache";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  authorized: boolean;
  isEmailVerified: boolean;
  publicToken?: string;
  message?: string;
  email?: string;
  name?: string;
  error?: any;
}

export interface ApiAuthCallback extends User {
  type: string;
  token: string;
  expires_at: string;
}

export const loginApi = async (data?: LoginInput): Promise<LoginResponse> => {
  try {
    const res = await fetch(getApiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        authorized: false,
        isEmailVerified: false,
        message: "Invalid credentials",
        error: await res.json(),
      };
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const authCallbackApi = async (
  token?: string,
): Promise<ApiAuthCallback | null> => {
  if (!token) {
    return null;
  }

  try {
    const res = await fetch(getApiUrl("/auth/callback"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicToken: token,
      }),
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getUserLatestDataApi = async (): Promise<User | null> => {
  noStore();
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl("/users/me"), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
      cache: "no-store",
      next: {
        tags: ["user_tag"],
      },
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

interface BuyerRegisterApiInput {
  role: "BUYER";
  phoneNumber?: string;
}

interface SellerRegisterApiInput {
  role: "SELLER";
  phoneNumber: string;
  address: string;
  aboutBusiness: string;
  file?: File;
  shouldCompleteProfile?: boolean;
}

type RegisterApiInput = {
  name: string;
  email: string;
  password: string;
} & (BuyerRegisterApiInput | SellerRegisterApiInput);

export const registerApi = async (
  data: RegisterApiInput,
): Promise<{
  message: string;
  authorized?: boolean;
  isEmailVerified?: boolean;
  publicToken?: string;
}> => {
  try {
    const formData = createFormData(data);
    const response = await $http.post("/auth/register", formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

interface ResendOtpApiInput {
  email: string;
  type: OtpType;
}

export type OtpType = "verify-email" | "verify-phone" | "forgot-password";

export const resendOtpApi = async ({ email, type }: ResendOtpApiInput) => {
  try {
    const res = await $http.post("/auth/resend-otp", {
      email,
      type,
    });
    return res.data;
  } catch (error: any) {
    throw error.response;
  }
};

interface ForgetPasswordApiInput {
  email: string;
}

export const forgetPasswordApi = async ({
  email,
}: ForgetPasswordApiInput): Promise<{
  message: string;
}> => {
  try {
    const res = await $http.post("/auth/forgot-password", {
      email,
    });
    return res.data;
  } catch (error: any) {
    throw error.response;
  }
};

interface ResetPasswordApiInput {
  password: string;
  oldPassword?: string;
}

export const resetPasswordApi = async (
  payload: ResetPasswordApiInput,
): Promise<{
  message: string;
  passwordChanged: boolean;
}> => {
  try {
    const res = await $http.post("/auth/change-password", payload);
    return res.data;
  } catch (error: any) {
    throw error.response;
  }
};

export interface UpdateUserProfileInput {
  name: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  address?: string;
  aboutBusiness?: string;
  file?: File;
  feature?: boolean;
  subscription?: boolean;
  message?: boolean;
  feedback?: boolean;
}

export const updateUserProfileApi = async (
  payload: UpdateUserProfileInput,
): Promise<{
  message: string;
  userData: User;
}> => {
  try {
    const formData = createFormData(payload);
    const { data } = await $http.put("users", formData);
    return data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getChangePhoneOtpApi = async (
  phone: string,
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await $http.post("users/get-phone-change-otp", { phone });
    return data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const verifyChangePhoneOtpApi = async (
  otp: string,
): Promise<{
  message: string;
  user: User;
}> => {
  try {
    const { data } = await $http.post("users/verify-phone-change-otp", { otp });
    return data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getSellerProfileApi = async (
  sellerId: string,
): Promise<{
  message: string;
  seller: User;
  userData: User;
  viewed: boolean;
}> => {
  try {
    noStore();
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/users/seller/${sellerId}`), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
    });

    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};
