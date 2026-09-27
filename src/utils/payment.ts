import {
  PaystackMainConfig,
  PaystackSuccessResponse,
} from "@/interface/payment";
import { PaymentCredentials } from "@/api/payment";

export const openPaystackModal = (config: PaystackMainConfig | any) => {
  const url =
    config?.paymentUrl ||
    config?.authorization_url ||
    config?.paystackConfig?.paymentUrl ||
    config?.paystackConfig?.authorization_url;
  console.log("openPaystackModal config", config, url);

  if (url) {
    window.location.href = url;
    return;
  }

  if (typeof window !== "undefined" && (window as any).PaystackPop) {
    const paystack = new (window as any).PaystackPop();
    paystack.newTransaction(config);
  }
};

export const createPaystackConfig = ({
  credentials,
  onCancel,
  onBankTransferConfirmationPending,
  onSuccess,
}: {
  credentials: PaymentCredentials;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onCancel: () => void;
  onBankTransferConfirmationPending?: () => void;
}): PaystackMainConfig => {
  const pKey =
    credentials?.paystackConfig?.publicKey ||
    credentials?.paystackConfig?.key ||
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    "";

  const ref =
    credentials?.paystackConfig?.ref ||
    credentials?.paystackConfig?.reference ||
    `PROM_${Date.now()}`;

  const email = credentials?.paystackConfig?.email || "customer@lata.ng";

  return {
    ...credentials?.paystackConfig,
    key: pKey,
    publicKey: pKey,
    ref,
    reference: ref,
    email,
    onSuccess,
    onCancel,
    onBankTransferConfirmationPending,
  };
};
