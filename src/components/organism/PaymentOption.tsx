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
    [handlePaymentSuccess, setShowModal, toast, updateUser],
  );

  const onCancel = useCallback(() => {
    setPaymentResponse(undefined);
    setLoading(false);
    toast({
      variant: "warning",
      title: "Payment Cancelled",
      description: "You can try again",
    });
  }, [toast]);

  const onBankTransferConfirmationPending = useCallback(() => {
    toast({
      variant: "warning",
      title: "Payment Pending",
      description: "Please confirm your balance in a few minutes or contact us",
    });
  }, [toast]);

  const subscriptionPayment = useCallback(
    async (isTransfer?: boolean) => {
      if (!plan) return;
      setLoading(true);
      const { credentials } = await getSubscriptionPaymentCredentialsApi({
        type: isTransfer ? "transfer" : "paystack",
        planId: plan.id,
        useWallet,
      }, queries);
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
      onBankTransferConfirmationPending,
      onCancel,
      onSuccess,
      plan,
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
