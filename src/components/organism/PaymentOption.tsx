import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { Plan, Transaction } from "@/interface/payment";
import { useUser } from "@hooks/useUser";
import { useRouter } from "next/navigation";
import {
  getSubscriptionPaymentCredentialsApi,
  getWalletPaymentCredentialsApi,
  PaymentCredentials,
  verifyPaymentApi,
} from "@/api/payment";
import { validatePromoCodeApi } from "@/api/promo.client";
import { useToast } from "@components/ui/use-toast";
import {
  cn,
  createPaystackConfig,
  formatPrice,
  handleSearchSwitchUrl,
  openPaystackModal,
} from "@/utils";
import { Toggle } from "@molecule/Toggle";
import { NumberTextInput } from "@components/input/NumberTextInput";
import Button from "@atom/Button";
import PayWithTransfer from "@organism/PayWithTransfer";
import { TRANSACTION_ROUTE } from "@/constants/routes";
import { User } from "@/interface/user";
import useGetSwitchedRolesQueries from "@/hooks/useGetSwitchedRolesQueries";
import { useRoleSwitchStore } from "@/store/states/localStore";
import posthog from "posthog-js";

interface Props {
  setShowModal?: React.Dispatch<SetStateAction<boolean>>;
  plan?: Plan | undefined;
  setPreventOverlayClose: React.Dispatch<SetStateAction<boolean>>;
  isWalletCredit?: boolean;
}

export default function PaymentOption({
  setPreventOverlayClose,
  plan,
  isWalletCredit,
  setShowModal,
}: Props) {
  const [transfer, setTransfer] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentCredentials>();
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountErrorMsg, setAmountErrorMsg] = useState("");
  const [userDataInfo, setUserDataInfo] = useState<User | null>(null);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [appliedPromoDetails, setAppliedPromoDetails] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    originalAmount: number;
  } | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");
  const [promoErrorMsg, setPromoErrorMsg] = useState("");
  const { push: nav } = useRouter();
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const { sessionSwitched, uid, role } = useGetSwitchedRolesQueries();
  const { sessionUser, searchQuery, isSwitchingRole } = useRoleSwitchStore();

  const queries = { uid, sessionSwitched, role };

  useEffect(() => {
    if (sessionSwitched) {
      setUserDataInfo(sessionUser);
    } else {
      setUserDataInfo(user as User);
    }

    if (transfer) {
      setPreventOverlayClose(true);
    } else {
      setPreventOverlayClose(false);
    }
  }, [setPreventOverlayClose, transfer]);

  const handlePaymentSuccess = useCallback(
    (transaction: Transaction) => {
      setShowModal?.(false);
      nav(
        handleSearchSwitchUrl(
          TRANSACTION_ROUTE + "/" + transaction.id,
          isSwitchingRole,
          searchQuery,
        ),
      );
      toast({
        variant: "success",
        title: "Payment Successful! You are now on " + plan?.name,
        description: "You can now start using all the features of this plan",
      });
    },
    [nav, plan?.name, setShowModal, toast],
  );

  const onSuccess = useCallback(
    async (response: any) => {
      toast({
        title: "Verifying Payment",
        description: "Please wait",
        variant: "info",
        duration: 15000,
      });

      try {
        const { transaction, userData } = await verifyPaymentApi(
          response.reference!,
          queries,
        );
        await updateUser(userData);
        posthog.capture("subscription_payment_completed", {
          plan_name: plan?.name || "",
          plan_duration: plan?.duration,
        });
        handlePaymentSuccess(transaction);
        setShowModal?.(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please Contact support",
        });
      } finally {
        setLoading(false);
      }
    },
    [handlePaymentSuccess, plan, setShowModal, toast, updateUser],
  );

  const onCancel = useCallback(() => {
    setPaymentResponse(undefined);
    setLoading(false);
    posthog.capture("subscription_payment_cancelled", {
      plan_name: plan?.name || "",
    });
    toast({
      variant: "warning",
      title: "Payment Cancelled",
      description: "You can try again",
    });
  }, [plan, toast]);

  const onBankTransferConfirmationPending = useCallback(() => {
    toast({
      variant: "warning",
      title: "Payment Pending",
      description: "Please confirm your balance in a few minutes or contact us",
    });
  }, [toast]);

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingPromo(true);
    setPromoErrorMsg("");
    setPromoSuccessMsg("");
    setAppliedPromoDetails(null);
    try {
      const res = await validatePromoCodeApi(
        promoCodeInput.trim(),
        undefined,
        plan?.id,
      );
      if (res.valid) {
        setAppliedPromoCode(res.code);
        const originalAmount = res.finalAmount + res.discountAmount;
        setAppliedPromoDetails({
          code: res.code,
          discountAmount: res.discountAmount,
          finalAmount: res.finalAmount,
          originalAmount,
        });
        setPromoSuccessMsg(
          `Promo '${res.code}' applied! You save ${formatPrice(res.discountAmount)}`,
        );
      }
    } catch (err: any) {
      setAppliedPromoCode("");
      setAppliedPromoDetails(null);
      setPromoErrorMsg(err?.message || "Invalid promo code");
    } finally {
      setValidatingPromo(false);
    }
  };

  const subscriptionPayment = useCallback(
    async (isTransfer?: boolean) => {
      if (!plan) return;
      setLoading(true);
      posthog.capture("subscription_payment_initiated", {
        plan_name: plan.name,
        plan_duration: plan.duration,
        payment_type: isTransfer ? "transfer" : "paystack",
        use_wallet: useWallet,
      });
      const targetPromo = appliedPromoCode || (promoCodeInput.trim() || undefined);
      const { credentials } = await getSubscriptionPaymentCredentialsApi(
        {
          type: isTransfer ? "transfer" : "paystack",
          planId: plan.id,
          useWallet,
          promoCode: targetPromo,
        },
        queries,
      );
      setLoading(false);
      setPaymentResponse(credentials);

      if (isTransfer) {
        setTransfer(true);
        return;
      } else {
        setTransfer(false);
        setShowModal?.(false);
      }
      const paystackConfig = createPaystackConfig({
        onSuccess,
        credentials,
        onBankTransferConfirmationPending,
        onCancel,
      });
      openPaystackModal(paystackConfig);
    },
    [
      appliedPromoCode,
      onBankTransferConfirmationPending,
      onCancel,
      onSuccess,
      plan,
      promoCodeInput,
      setShowModal,
      useWallet,
    ],
  );

  const walletFunding = useCallback(async () => {
    if (!isWalletCredit) return;
    const amountToPay = Number(amount);
    if (amountToPay < 1000) {
      setAmountErrorMsg("Amount cannot be less than ₦1000");
      return;
    }
    try {
      setLoading(true);
      const { credentials } = await getWalletPaymentCredentialsApi({
        amount: amountToPay,
      });
      setLoading(false);
      setTransfer(false);
      setShowModal?.(false);
      posthog.capture("wallet_funded", { amount: amountToPay });
      const paystackConfig = createPaystackConfig({
        onSuccess,
        credentials,
        onBankTransferConfirmationPending,
        onCancel,
      });

      openPaystackModal(paystackConfig);
    } catch (error) {
      setLoading(false);
    }
  }, [
    amount,
    isWalletCredit,
    onBankTransferConfirmationPending,
    onCancel,
    onSuccess,
    setShowModal,
  ]);

  const pay = useCallback(
    async (isTransfer?: boolean) => {
      if (isWalletCredit) {
        await walletFunding();
        return;
      }

      setPreventOverlayClose(true);
      await subscriptionPayment(isTransfer);
    },
    [
      isWalletCredit,
      setPreventOverlayClose,
      subscriptionPayment,
      walletFunding,
    ],
  );

  const handlePayWithTransfer = useCallback(async () => {
    await pay(true);
  }, [pay]);

  return (
    <div className={""}>
      {!transfer ? (
        <div
          className={cn(`
            w-[220px]
            xms:w-[250px]
            sm:w-[360px]
          `)}
        >
          <h2
            className={cn(`
              mb-6
              text-center
              text-sm
              font-medium
              text-grey10
              sm:text-base
            `)}
          >
            {isWalletCredit
              ? "Enter amount to recharge"
              : "Choose payment method"}
          </h2>
          {isWalletCredit ? (
            <div className={"mb-6"}>
              <NumberTextInput
                value={amount}
                setValue={setAmount}
                label={"Amount"}
                placeholder={`Enter amount`}
                errorMessage={amountErrorMsg}
                onTyping={() => setAmountErrorMsg("")}
              />
            </div>
          ) : (
            <div className={"mb-4 flex flex-col gap-y-2"}>
              <p className={"text-sm"}>
                Account balance:{" "}
                <span className={cn(`font-medium`)}>
                  {formatPrice(userDataInfo?.wallet?.balance || 0)}
                </span>
              </p>

              <Toggle
                label={"Pay with balance"}
                labelClass={"text-grey7"}
                disabled={
                  userDataInfo?.wallet?.balance
                    ? userDataInfo?.wallet?.balance <= 0
                    : true
                }
                checked={useWallet}
                setChecked={setUseWallet}
              />

              <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="block text-xs font-semibold text-grey9 mb-1">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value.toUpperCase());
                      setPromoErrorMsg("");
                      setPromoSuccessMsg("");
                      setAppliedPromoCode("");
                      setAppliedPromoDetails(null);
                    }}
                    className="w-full border border-grey3 rounded px-2.5 py-1.5 text-xs text-grey9 focus:outline-none focus:border-primary uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    disabled={validatingPromo || !promoCodeInput.trim() || !!appliedPromoCode}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded font-semibold shrink-0 transition",
                      appliedPromoCode
                        ? "bg-emerald-600 text-white"
                        : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    )}
                  >
                    {validatingPromo ? "..." : appliedPromoCode ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoSuccessMsg && (
                  <div className="mt-1.5 space-y-1">
                    <p className="text-[11px] text-emerald-600 font-medium">
                      {promoSuccessMsg}
                    </p>
                    {appliedPromoDetails && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-grey7 font-medium">Adjusted Price:</span>
                        <span className="text-grey6 line-through">
                          {formatPrice(appliedPromoDetails.originalAmount)}
                        </span>
                        <span className="text-primary font-bold text-sm">
                          {formatPrice(appliedPromoDetails.finalAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {promoErrorMsg && (
                  <p className="text-[11px] text-red-500 mt-1">{promoErrorMsg}</p>
                )}
              </div>
            </div>
          )}
          <div className={cn(`grid`)}>
            <Button
              format={"primary"}
              disabled={(isWalletCredit && !amount) || loading}
              className={cn(`mb-4`)}
              onClick={() => pay()}
            >
              {isWalletCredit ? "Pay with card" : "Pay now"}
            </Button>

            {!isWalletCredit ? (
              <Button
                format={"secondary"}
                disabled={(isWalletCredit && !amount) || loading}
                onClick={handlePayWithTransfer}
              >
                Pay with transfer
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <PayWithTransfer
          setTransfer={setTransfer}
          paymentResponse={paymentResponse}
        />
      )}
    </div>
  );
}
