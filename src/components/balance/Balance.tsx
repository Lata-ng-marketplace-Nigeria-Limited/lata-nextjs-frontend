"use client";

import { formatPrice } from "@/utils";
import Button from "@atom/Button";
import { useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import Modal from "@molecule/Modal";
import PaymentOption from "@organism/PaymentOption";

interface Props {
  balance?: number;
}
export const Balance = ({ balance }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [preventOverlayClose, setPreventOverlayClose] = useState(false);
  const [hasUpdatedBalance, setHasUpdatedBalance] = useState(false);
  const { user, updateUser } = useUser();

  // useEffect(() => {
  //   console.log("here");
  //   if (!user?.wallet) return;
  //   if (!user?.wallet?.balance && user?.wallet?.balance !== 0) return;
  //   if (hasUpdatedBalance) return;
  //   if (user.wallet.balance !== balance) {
  //     (async () => {
  //       await updateUser(user);
  //       setHasUpdatedBalance(true);
  //     })();
  //   }
  // }, [balance, hasUpdatedBalance]);
  return (
    <>
      <div className={"mt-6 "}>
        <div className={"bg-purp2 px-6 py-3 sm:px-[40px] sm:py-6 w-max mb-6"}>
          <p className={"text-[10px] sm:text-xs text-grey8"}>
            Available balance
          </p>
          <p
            className={
              "text-base sm:text-[20px] text-grey10 mt-3 font-semibold"
            }
          >
            {formatPrice(user?.wallet?.balance || balance || 0, "#")}
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button
            className={"w-[180px] sm:w-[240px]"}
            format={"primary"}
            onClick={() => setShowModal(true)}
          >
            Recharge
          </Button>

          <Button
            className={"w-[180px] sm:w-[240px] border-grey3 hover:border-primary text-grey9"}
            format={"secondary"}
            onClick={() => setShowLoanModal(true)}
          >
            Request Loan
          </Button>
        </div>
      </div>

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        preventOverlayClose={preventOverlayClose}
      >
        <PaymentOption
          setPreventOverlayClose={setPreventOverlayClose}
          setShowModal={setShowModal}
          isWalletCredit
        />
      </Modal>

      <Modal isShown={showLoanModal} setIsShown={setShowLoanModal}>
        <div className="p-6 text-center max-w-[360px] mx-auto bg-white rounded-xl">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-grey10 mb-2">Not Eligible Yet</h3>
          <p className="text-xs text-grey6 leading-relaxed mb-6">
            You are not qualified for a loan yet. Please maintain active shop operations, subscriptions, and transaction history to become eligible.
          </p>
          <Button
            format="primary"
            className="w-full py-2 text-sm font-semibold rounded-lg"
            onClick={() => setShowLoanModal(false)}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </>
  );
};
