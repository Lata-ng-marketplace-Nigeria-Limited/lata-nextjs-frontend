"use client";

import React, { useEffect, useState } from "react";
import TextInput from "@components/input/TextInput";
import { NumberTextInput } from "@components/input/NumberTextInput";
import Button from "@atom/Button";
import { showToast } from "@/utils";
import {
  getPromotionSettingsApi,
  PromotionSettings,
  updatePromotionSettingsApi,
} from "@/api/payment.client";

export const EditSingleProductPromotion = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [amount, setAmount] = useState("8700");
  const [durationDays, setDurationDays] = useState("14");
  const [badgeLabel, setBadgeLabel] = useState("Mini");
  const [isEnabled, setIsEnabled] = useState(true);
  const [cashbackPercentage, setCashbackPercentage] = useState("5");
  const [isCashbackEnabled, setIsCashbackEnabled] = useState(true);

  useEffect(() => {
    getPromotionSettingsApi()
      .then((res) => {
        if (res?.settings) {
          setAmount(String(res.settings.amount ?? 8700));
          setDurationDays(String(res.settings.durationDays ?? 14));
          setBadgeLabel(res.settings.badgeLabel || "Mini");
          setIsEnabled(res.settings.isEnabled ?? true);
          setCashbackPercentage(String(res.settings.cashbackPercentage ?? 5));
          setIsCashbackEnabled(res.settings.isCashbackEnabled ?? true);
        }
      })
      .catch((err) => {
        showToast(
          err?.message || "Failed to load promotion settings",
          "destructive",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updatePromotionSettingsApi({
        amount: Number(amount),
        durationDays: Number(durationDays),
        badgeLabel,
        isEnabled,
        cashbackPercentage: Number(cashbackPercentage),
        isCashbackEnabled,
      });

      showToast("Promotion & cashback settings updated successfully!", "success");
      if (res?.settings) {
        setAmount(String(res.settings.amount));
        setDurationDays(String(res.settings.durationDays));
        setBadgeLabel(res.settings.badgeLabel);
        setIsEnabled(res.settings.isEnabled);
        setCashbackPercentage(String(res.settings.cashbackPercentage ?? 5));
        setIsCashbackEnabled(res.settings.isCashbackEnabled ?? true);
      }
    } catch (error: any) {
      showToast(
        error?.message || "Failed to update promotion settings",
        "destructive",
      );
    } finally {
      setUpdating(false);
    }
  };

  const sampleSubAmount = 10000;
  const calculatedSampleCashback = isCashbackEnabled
    ? Math.round((sampleSubAmount * (Number(cashbackPercentage) || 0)) / 100)
    : 0;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200 w-full max-w-[700px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-8">
        {/* Single-Product Promotion Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Single-Product Promotion Settings
              </h3>
              <p className="text-sm text-grey6 mt-1">
                Configure price, duration, and badge label for individual product promotions.
              </p>
            </div>

            <label className="flex items-center gap-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-800">
                {isEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-y-6 mt-4">
            <div className="flex flex-col sm:flex-row gap-6">
              <NumberTextInput
                placeholder="e.g. 8700"
                label="Promotion Price (₦)"
                wrapperClass="w-full"
                disabled={loading || updating}
                value={amount}
                setValue={setAmount}
              />

              <NumberTextInput
                placeholder="e.g. 14"
                label="Duration (Days)"
                wrapperClass="w-full"
                disabled={loading || updating}
                value={durationDays}
                setValue={setDurationDays}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <TextInput
                placeholder="e.g. Mini"
                label="Badge Tag Label"
                wrapperClass="w-full"
                disabled={loading || updating}
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Subscription Cashback Section */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Subscription Cashback Rewards
              </h3>
              <p className="text-sm text-grey6 mt-1">
                Reward subscribers with cash back added directly into their wallet balance upon payment.
              </p>
            </div>

            <label className="flex items-center gap-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCashbackEnabled}
                onChange={(e) => setIsCashbackEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-800">
                {isCashbackEnabled ? "Cashback Active" : "Disabled"}
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-4 items-start">
            <NumberTextInput
              placeholder="e.g. 5"
              label="Cashback Percentage (%)"
              wrapperClass="w-full sm:w-1/2"
              disabled={loading || updating || !isCashbackEnabled}
              value={cashbackPercentage}
              setValue={setCashbackPercentage}
            />

            <div className="w-full sm:w-1/2 p-4 bg-purple-50/60 rounded-xl border border-purple-100 flex flex-col justify-center">
              <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Live Reward Preview
              </span>
              <p className="text-xs text-gray-600 mt-1">
                On a <strong>₦10,000</strong> subscription payment, the subscriber will instantly receive:
              </p>
              <p className="text-lg font-bold text-purple-900 mt-1">
                {isCashbackEnabled ? `₦${calculatedSampleCashback.toLocaleString()} Wallet Credit (${cashbackPercentage}%)` : "No Cashback (Disabled)"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button format="primary" disabled={loading || updating} type="submit">
            {updating ? "Saving Settings..." : "Save Promotion & Cashback Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};
