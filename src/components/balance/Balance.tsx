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

        <Button
          className={"w-[180px] sm:w-[240px]"}
          format={"primary"}
          onClick={() => setShowModal(true)}
        >
          Recharge
        </Button>
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
    </>
  );
};
