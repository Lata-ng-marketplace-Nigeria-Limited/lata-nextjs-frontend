import React, { SetStateAction, useEffect, useState } from "react";
import { Plan, PlanName } from "@/interface/payment";
import { useUser } from "@hooks/useUser";
import { cn } from "@/utils";
import MobileBorderArea from "@atom/MobileBorderArea";
import Button from "@atom/Button";
import Modal from "@molecule/Modal";
import { XCancelIcon } from "@atom/icons/XCancel";
import { CheckCircleIcon } from "@atom/icons/CheckCircle";
import { PlanFeature } from "@components/subscription/PlanFeature";
import { DiscountButton } from "@molecule/DiscountButton";
import PaymentOption from "@organism/PaymentOption";

interface Props {
  months: number[];
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<SetStateAction<number>>;
  selectedPlans: Plan[] | undefined;
  planName: PlanName;
}

export const PlanDetails = ({
  planName,
  selectedPlans,
  setSelectedMonth,
  months,
  selectedMonth,
}: Props) => {
  const [features, setFeatures] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [text, setText] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [preventOverlayClose, setPreventOverlayClose] = useState(false);
  const [plan, setPlan] = useState<Plan>();
  const [disableClick, setDisableClick] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const feat = selectedPlans?.[0]?.features || [];
    setFeatures([]);
    setFeatures(feat);
  }, [selectedPlans]);

  useEffect(() => {
    setDisableClick(false);
    setText("");
    const selectedPlan = selectedPlans?.find(
      (plan) => plan.duration === selectedMonth,
    );
    setPlan(selectedPlan);

    const priceAmt = selectedPlan?.price;
    const discountAmt = selectedPlan?.discountPercentage;
    setPrice(priceAmt || 0);
    setDiscount(discountAmt || 0);

    if (user?.subscriptionStatus === "ACTIVE") {
      if (user?.planId === selectedPlan?.id) {
        setText("Active");
        setDiscount(0);
        setDisableClick(true);
      }
    }

    if (planName === "Free") {
      setDisableClick(true);
      if (user?.subscriptionStatus !== "ACTIVE") {
        setText("Active");
      } else {
        setText(`Inactive`);
      }
    }
  }, [selectedPlans, selectedMonth, planName, user]);

  return (
    <MobileBorderArea
      className={cn(`
        max-w-[375px]
        py-6
        px-4
        sm:px-6
        tablet:py-6
        tablet:px-8
    `)}
      removePadding
      showBorderInDesktop
    >
      {months.length ? (
        <div className={"flex gap-x-1 sm:gap-x-2 mb-6"}>
          {months.map((month, i) => (
            <Button
              format={"secondary"}
              key={i}
              className={cn(
                `
                  w-full 
                  p-0 
                  sm:p-0 
                  py-1 
                  px-1
                  xxs:px-1.5
                  sm:px-2 
                  w-fit 
                  border-[#AE8CD0]
                  rounded-[4px]
                  font-normal
                  text-[10px]
                  sm:text-[12px]
                  text-grey9
                `,
                {
                  "bg-[#D6C3E9] border-[#D6C3E9] hover:bg-[#D6C3E9]":
                    selectedMonth === month,
                },
              )}
              onClick={() => setSelectedMonth(month)}
            >
              {month} {month === 1 ? "month" : "months"}
            </Button>
          ))}
        </div>
      ) : null}

      <div className={" mb-10"}>
        <div className={" flex flex-col gap-y-4"}>
          {features.map((feature, i) => (
            <PlanFeature
              key={i}
              title={feature}
              icon={planName !== "Free" ? <CheckCircleIcon /> : <XCancelIcon />}
            />
          ))}
        </div>
      </div>

      <DiscountButton
        format={"primary"}
        amount={price}
        discount={discount}
        text={text}
        onClick={() => (!disableClick ? setShowModal(true) : null)}
      />

      <Modal
        isShown={showModal}
        setIsShown={setShowModal}
        preventOverlayClose={preventOverlayClose}
      >
        <PaymentOption
          setPreventOverlayClose={setPreventOverlayClose}
          setShowModal={setShowModal}
          plan={plan}
        />
      </Modal>
    </MobileBorderArea>
  );
};
