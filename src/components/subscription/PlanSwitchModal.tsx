import React from "react";
import Modal from "@molecule/Modal";
import Button from "@atom/Button";
import { Plan } from "@/interface/payment";
import { formatPrice } from "@/utils";
import { User } from "@/interface/user";

interface Props {
  isShown: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedPlan?: Plan;
  activePlan?: Plan;
  userData?: User | null;
  targetPrice: number;
}

export const PlanSwitchModal = ({
  isShown,
  onClose,
  onConfirm,
  selectedPlan,
  activePlan,
  userData,
  targetPrice,
}: Props) => {
  if (!selectedPlan) return null;

  // Determine switch type: UPGRADE vs DOWNGRADE vs CHANGE_DURATION
  const currentPrice = activePlan?.price || 0;
  let switchType: "UPGRADE" | "DOWNGRADE" | "CHANGE_DURATION" = "UPGRADE";

  if (targetPrice < currentPrice) {
    switchType = "DOWNGRADE";
  } else if (targetPrice > currentPrice) {
    switchType = "UPGRADE";
  } else {
    switchType = "CHANGE_DURATION";
  }

  const isUpgrade = switchType === "UPGRADE";
  const isDowngrade = switchType === "DOWNGRADE";

  return (
    <Modal isShown={isShown} setIsShown={onClose}>
      <div className="p-4 sm:p-6 max-w-md w-full">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-grey10">
            Confirm Plan Change
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
              isUpgrade
                ? "bg-green-100 text-green-800"
                : isDowngrade
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {switchType === "CHANGE_DURATION" ? "Change Duration" : switchType}
          </span>
        </div>

        {/* Plan Comparison Box */}
        <div className="bg-grey1 rounded-lg p-4 mb-4 border border-grey3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-grey7">Current Plan:</span>
            <span className="font-medium text-grey9">
              {activePlan?.name || "Active Tier"} ({activePlan?.duration || 1}{" "}
              {activePlan?.duration === 1 ? "month" : "months"})
            </span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-grey3">
            <span className="text-grey7">New Selected Plan:</span>
            <span className="font-semibold text-purp5">
              {selectedPlan.name} ({selectedPlan.duration}{" "}
              {selectedPlan.duration === 1 ? "month" : "months"})
            </span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-grey3 mt-2">
            <span className="text-grey7">New Plan Price:</span>
            <span className="font-bold text-grey10">
              {formatPrice(targetPrice)}
            </span>
          </div>
        </div>

        {/* Information Callout */}
        <div className="text-xs text-grey8 leading-relaxed mb-6 bg-blue-50 p-3 rounded-md border border-blue-100">
          {isUpgrade && (
            <p>
              💡 <strong>Upgrading:</strong> Unused value from your remaining days on your current plan will automatically be deducted as a prorated discount from your total.
            </p>
          )}
          {isDowngrade && (
            <p>
              ℹ️ <strong>Downgrading:</strong> Your new plan will take effect immediately. Any excess prorated balance from your previous plan will be credited directly to your wallet.
            </p>
          )}
          {!isUpgrade && !isDowngrade && (
            <p>
              🔄 <strong>Changing Duration:</strong> Switching billing duration will apply unused value from your current plan to your new cycle.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button format="secondary" onClick={onClose} className="px-4 py-2">
            Cancel
          </Button>
          <Button
            format="primary"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="px-5 py-2"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
};
