import { createFormData } from "@/utils";
import { $http } from "@/service/axios";
import { User } from "@/interface/user";

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

interface StaffRegisterApiInput {
  role: "STAFF";
  phoneNumber?: string;
  position: string;
  address: string;
  file?: File;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

type RegisterApiInput = {
  name: string;
  email: string;
  password: string;
} & (BuyerRegisterApiInput | SellerRegisterApiInput | StaffRegisterApiInput);

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

export const adminOrStaffAddUserApi = async (
  data: RegisterApiInput,
): Promise<{
  message: string;
  authorized?: boolean;
  isEmailVerified?: boolean;
  publicToken?: string;
}> => {
  try {
    const formData = createFormData(data);
    const response = await $http.post("/auth/register/add", formData);
    return response.data;
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

interface IChangeManagerApi {
  sellerId: string;
  managerId: string;
}

export const changeManagerApi = async (
  data: IChangeManagerApi,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const formData = createFormData(data);
    const response = await $http.put("/admin/change-manager", formData);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const deleteFeedbackApi = async (
  id: string,
): Promise<{
  message: string;
  success: boolean;
}> => {
  try {
    const response = await $http.delete("/feedbacks/" + id);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};

export const blockUserApi = async ({
  userId,
}: {
  userId: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await $http.get(`/users/block/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response;
  }
};
