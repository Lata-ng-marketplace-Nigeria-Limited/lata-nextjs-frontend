"use server";

import {
  PaystackConfig,
  Transaction,
  TransactionType,
} from "@/interface/payment";
import { User } from "@/interface/user";
import { $http } from "@/service/axios";
import { FetchMeta } from "@/interface/general";
import { getApiUrl } from "@/utils";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";

export interface GetSubscriptionPaymentCredentialsInput {
  planId: string;
  useWallet?: boolean;
  type: "transfer" | "paystack";
}

export interface PaymentCredentials {
  isPaid: false;
  amountToPay: number;
  walletAmountToPay: number;
  discountPercentage?: number;
  actualTotalAmount: number;
  paystackConfig: PaystackConfig;
  reference?: string;
  expiresAt?: string | null;
  bankName?: string;
  acctNumber?: string;
  acctName?: string;
  walletBalance?: number;
  transaction?: Transaction;
  pdfUrl?: string;
  planName?: string;
  planDuration?: string;
}

export const getSubscriptionPaymentCredentialsApi = async (
  payload?: GetSubscriptionPaymentCredentialsInput,
): Promise<{
  credentials: PaymentCredentials;
  userData?: User;
}> => {
  if (!payload) throw new Error("Payload is required");
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl("/payments/subscribe"), {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    if (!res.ok) throw await res.json();
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getWalletPaymentCredentialsApi = async (payload: {
  amount: number;
}): Promise<{
  message: string;
  credentials: PaymentCredentials;
}> => {
  try {
    // const session = await getServerSession(authConfig);
    const res = await $http.post("/payments/wallet", payload, {
      // headers: {
      //   Authorization: `Bearer ${session?.token}`,
      // },
    });
    return res.data;
  } catch (error: any) {
    return error.response?.data || error.response || error;
  }
};

export const verifyPaymentApi = async (
  reference: string,
): Promise<{
  message: string;
  transaction: Transaction;
  userData: User;
}> => {
  try {
    const session = await getServerSession(authConfig);
    const res = await $http.post(
      `/transactions`,
      { reference },
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};

export const findTransactionApi = async (
  transactionId: string,
): Promise<{
  message: string;
  transaction: Transaction;
}> => {
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/transactions/${transactionId}`), {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    if (!res.ok) throw await res.json();
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const findAllTransactionsApi = async ({
  page,
  limit,
  type,
}: {
  page: number;
  limit: number;
  type?: TransactionType;
}): Promise<{
  message: string;
  meta: FetchMeta;
  data: Transaction[];
}> => {
  try {
    const res = await $http.get(
      `/transactions?page=${page}&limit=${limit}&type=${type}`,
    );
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
