"use server";
import { signIn } from "next-auth/react";
import { buyerSignUpSchema } from "@/store/schemas/buyerSignUpSchema";
import { getApiUrl } from "@/utils";
import { OtpType } from "@/api/auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: true,
      redirectTo: "/",
    });
  } catch (error) {
    console.log("error", error);
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

export async function buyerSignUpAction(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const validate = buyerSignUpSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!validate.success) {
      return {
        errors: validate.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Create Invoice.",
      };
    }
    const { email, password, name, phoneNumber } = validate.data;
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

interface VerifyEmailApiInput {
  token?: string;
  email?: string;
  emailVerification?: boolean;
  otp?: string;
  type?: OtpType;
}

export interface VerifyEmailApiOutput {
  verified: boolean;
  message: string;
  token?: string;
  name?: string;
  email?: string;
  expiresAt?: string;
}

export const verifyOtpApi = async (
  payload: VerifyEmailApiInput,
): Promise<VerifyEmailApiOutput | null> => {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const res = await fetch(getApiUrl("/auth/verify-otp"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response;
  }
};
