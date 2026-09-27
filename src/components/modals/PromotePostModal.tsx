"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/molecule/Modal";
import Button from "@/components/atom/Button";
import { formatPrice, showToast } from "@/utils";
import { createPaystackConfig, openPaystackModal } from "@/utils/payment";
import {
  getPromotionSettingsApi,
  getSingleProductPromotionCredentialsApi,
  PromotionSettings,
  verifySingleProductPromotionPaymentApi,
} from "@/api/payment.client";
import { validatePromoCodeApi } from "@/api/promo.client";
// import { Sparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName?: string;
  isAlreadyPromoted?: boolean;
  onSuccessRedirect?: () => void;
}

export default function PromotePostModal({
  isOpen,
  onClose,
  productId,
  productName,
  isAlreadyPromoted,
  onSuccessRedirect,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  const [settings, setSettings] = useState<PromotionSettings>({
    id: 1,
    amount: 8700,
    durationDays: 14,
    isEnabled: true,
    badgeLabel: "Mini",
  });

  useEffect(() => {
    if (isOpen) {
      getPromotionSettingsApi()
        .then((res) => {
          if (res?.settings) {
            setSettings(res.settings);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    try {
      const res = await validatePromoCodeApi(promoInput.trim(), productId);
      if (res.valid) {
        setAppliedPromo({
          code: res.code,
          discountAmount: res.discountAmount,
          finalAmount: res.finalAmount,
        });
        showToast(`Promo code '${res.code}' applied! You save ${formatPrice(res.discountAmount)}`, "success");
      }
    } catch (err: any) {
      setAppliedPromo(null);
      showToast(err?.message || "Invalid promo code", "destructive");
    } finally {
      setValidatingPromo(false);
    }
  };

  const handlePromoteYes = async () => {
    setLoading(true);
    try {
      const { paystackConfig, settings: currentSettings } =
        await getSingleProductPromotionCredentialsApi(
          productId,
          appliedPromo?.code,
        );

      if (currentSettings) {
        setSettings(currentSettings);
      }

      const config = createPaystackConfig({
        credentials: { paystackConfig } as any,
        onSuccess: async (response) => {
          setLoading(true);
          const paymentRef =
            response.reference ||
            response.trxref ||
            paystackConfig?.reference ||
            paystackConfig?.ref ||
            "";
          try {
            await verifySingleProductPromotionPaymentApi(paymentRef);
            showToast(
              `Product promoted successfully! Your product now has a '${settings.badgeLabel}' badge in Trending.`,
              "success",
            );
            onClose();
            if (onSuccessRedirect) onSuccessRedirect();
          } catch (err: any) {
            showToast(
              err?.message || "Payment verification failed",
              "destructive",
            );
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
          showToast("Payment cancelled", "destructive");
        },
      });

      openPaystackModal(config);
    } catch (error: any) {
      setLoading(false);
      showToast(
        error?.message || "Failed to initialize payment credentials",
        "destructive",
      );
    }
  };

  const handleNotNow = () => {
    onClose();
    if (onSuccessRedirect) onSuccessRedirect();
  };

  if (!settings.isEnabled) {
    return null;
  }

  const finalPayAmount = appliedPromo
    ? appliedPromo.finalAmount
    : settings.amount;

  return (
    <Modal
      isShown={isOpen}
      setIsShown={(show) => {
        if (!show) handleNotNow();
      }}
      preventOverlayClose={false}
      hideCloseButton
      contentClass="max-w-[460px] p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="flex flex-col items-center text-center gap-y-4 py-2">
        {/* <div className={`w-12 h-12 rounded-full ${isAlreadyPromoted ? "bg-emerald-100 text-emerald-600" : "bg-purple-100 text-primary"} flex items-center justify-center mb-1`}>
          <Sparkles className="w-6 h-6" />
        </div> */}

        <h3 className="text-xl font-bold text-gray-900">
          {isAlreadyPromoted ? "Extend Post Promotion" : "Promote only this post?"}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          {isAlreadyPromoted ? (
            productName ? (
              <span>
                <strong>"{productName}"</strong> is currently promoted! Extend your promotion for an additional{" "}
                <strong>{settings.durationDays} days</strong>.
              </span>
            ) : (
              `This post is currently promoted! Extend your promotion for an additional ${settings.durationDays} days.`
            )
          ) : productName ? (
            <span>
              Promote <strong>"{productName}"</strong> exclusively for{" "}
              {settings.durationDays} days!
            </span>
          ) : (
            `Promote this post exclusively for ${settings.durationDays} days!`
          )}
          <br />
          Your product will carry the <strong>"{settings.badgeLabel}"</strong>{" "}
          badge and appear in the Trending section.
        </p>

        {/* Promo Code Input Section */}
        <div className="w-full mt-2 text-left bg-gray-50 p-3 rounded-xl border border-gray-200">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Have a Promo Code?
          </label>
          <div className="flex gap-x-2">
            <input
              type="text"
              placeholder="e.g. WELCOME50"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                if (appliedPromo) setAppliedPromo(null);
              }}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-primary uppercase font-mono"
            />
            <Button
              format="secondary"
              type="button"
              onClick={handleApplyPromo}
              disabled={validatingPromo || !promoInput.trim() || !!appliedPromo}
              className={`py-1.5 px-3 text-xs ${appliedPromo ? "!bg-emerald-600 !text-white" : ""}`}
            >
              {validatingPromo ? "..." : appliedPromo ? "Applied" : "Apply"}
            </Button>
          </div>
          {appliedPromo && (
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ✓ Promo '{appliedPromo.code}' applied: -{formatPrice(appliedPromo.discountAmount)} off
            </p>
          )}
        </div>

        {/* Price Display */}
        <div className="flex items-center gap-x-2 mt-1">
          {appliedPromo && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(settings.amount)}
            </span>
          )}
          <span className="text-lg font-bold text-gray-900">
            Total: {formatPrice(finalPayAmount)}
          </span>
        </div>

        <div className="flex flex-col gap-y-3 w-full mt-2">
          <Button
            format="primary"
            className={`w-full h-12 text-base font-semibold ${isAlreadyPromoted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"} text-white rounded-xl`}
            onClick={handlePromoteYes}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isAlreadyPromoted
              ? `Extend for ${formatPrice(finalPayAmount)}`
              : `YES - Pay ${formatPrice(finalPayAmount)}`}
          </Button>

          <Button
            format="secondary"
            className="w-full h-12 text-base font-medium text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl"
            onClick={handleNotNow}
            disabled={loading}
          >
            Not Now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
