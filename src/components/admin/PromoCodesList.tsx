"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/atom/Button";
import Modal from "@/components/molecule/Modal";
import TextInput from "@/components/input/TextInput";
import { NumberTextInput } from "@/components/input/NumberTextInput";
import { SelectInput } from "@/components/input/SelectInput";
import { formatPrice, showToast } from "@/utils";
import {
  createAdminPromoCodeApi,
  getAdminPromoCodesApi,
  PromoCode,
  sendPromoBroadcastEmailApi,
  updateAdminPromoCodeApi,
} from "@/api/promo.client";
import { useCategory } from "@/hooks/useCategory";

export const PromoCodesList = () => {
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingBroadcastId, setSendingBroadcastId] = useState<string | null>(null);

  const { categoriesSelectData } = useCategory();

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [targetType, setTargetType] = useState<
    "ALL" | "FIRST_TIME_POSTERS" | "SUBSCRIBED_SELLERS" | "CATEGORY_SELLERS" | "SPECIFIC_USER"
  >("ALL");
  const [targetCategoryId, setTargetCategoryId] = useState("");
  const [targetUserEmail, setTargetUserEmail] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const res = await getAdminPromoCodesApi();
      if (res?.data) {
        setPromoCodes(res.data);
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to fetch promo codes", "destructive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    if (targetType === "SPECIFIC_USER" && !targetUserEmail.trim()) {
      showToast("Please enter the user's email address", "destructive");
      return;
    }

    setSubmitting(true);
    try {
      await createAdminPromoCodeApi({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        targetType,
        targetCategoryId: targetType === "CATEGORY_SELLERS" ? targetCategoryId : undefined,
        targetUserEmail: targetType === "SPECIFIC_USER" ? targetUserEmail.trim() : undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });

      showToast("Promo code created successfully!", "success");
      setIsModalOpen(false);
      resetForm();
      fetchPromoCodes();
    } catch (err: any) {
      showToast(err?.message || "Failed to create promo code", "destructive");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (promo: PromoCode) => {
    try {
      await updateAdminPromoCodeApi(promo.id, { isActive: !promo.isActive });
      showToast(`Promo code '${promo.code}' updated!`, "success");
      fetchPromoCodes();
    } catch (err: any) {
      showToast(err?.message || "Failed to update promo code", "destructive");
    }
  };

  const handleSendBroadcast = async (promo: PromoCode) => {
    const targetLabel = promo.targetType === "SPECIFIC_USER" 
      ? `user (${promo.targetUser?.email || "target user"})`
      : "targeted sellers";

    if (!confirm(`Are you sure you want to send an email broadcast & notification for code '${promo.code}' to ${targetLabel}?`)) {
      return;
    }

    setSendingBroadcastId(promo.id);
    try {
      const res = await sendPromoBroadcastEmailApi(promo.id);
      showToast(res.message || "Broadcast sent successfully!", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to send email broadcast", "destructive");
    } finally {
      setSendingBroadcastId(null);
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setTargetType("ALL");
    setTargetCategoryId("");
    setTargetUserEmail("");
    setMaxUses("");
    setExpiresAt("");
  };

  const getTargetBadge = (promo: PromoCode) => {
    switch (promo.targetType) {
      case "FIRST_TIME_POSTERS":
        return <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">First-Time Posters</span>;
      case "SUBSCRIBED_SELLERS":
        return <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold">Subscribed Sellers</span>;
      case "CATEGORY_SELLERS":
        return <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold">Category Sellers</span>;
      case "SPECIFIC_USER":
        return (
          <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold truncate max-w-[150px] inline-block">
            User: {promo.targetUser?.email || promo.targetUserId || "Specific User"}
          </span>
        );
      default:
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">All Users</span>;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-y-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promo Codes Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, manage, and broadcast discount promo codes to targeted sellers or individual users.
          </p>
        </div>

        <Button format="primary" onClick={() => setIsModalOpen(true)}>
          + Create Promo Code
        </Button>
      </div>

      {/* Promo Codes Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Target Audience</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading promo codes...
                  </td>
                </tr>
              ) : promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No promo codes created yet. Click <strong>+ Create Promo Code</strong> to create one.
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">
                      {promo.code}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {promo.discountType === "PERCENTAGE"
                        ? `${promo.discountValue}% OFF`
                        : `${formatPrice(promo.discountValue)} OFF`}
                    </td>

                    <td className="px-6 py-4">{getTargetBadge(promo)}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {promo.usesCount} {promo.maxUses ? `/ ${promo.maxUses}` : "uses"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {promo.expiresAt
                        ? new Date(promo.expiresAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never"}
                    </td>

                    <td className="px-6 py-4">
                      {promo.isActive ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Expired / Disabled
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-x-2">
                        <Button
                          format="tertiary"
                          className="py-1 px-3 text-xs"
                          onClick={() => handleSendBroadcast(promo)}
                          disabled={sendingBroadcastId === promo.id}
                        >
                          {sendingBroadcastId === promo.id ? "Sending..." : "📧 Broadcast"}
                        </Button>

                        <Button
                          format="secondary"
                          className="py-1 px-3 text-xs"
                          onClick={() => handleToggleActive(promo)}
                        >
                          {promo.isActive ? "Expire Now" : "Reactivate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promo Code Modal */}
      <Modal
        isShown={isModalOpen}
        setIsShown={setIsModalOpen}
        contentClass="max-w-[500px] p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="flex flex-col gap-y-4">
          <h3 className="text-xl font-bold text-gray-900">Create New Promo Code</h3>
          <p className="text-xs text-gray-500">
            Set targeting rules, discounts, and expiration dates for promo redemptions.
          </p>

          <form onSubmit={handleCreatePromoCode} className="flex flex-col gap-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Promo Code String
              </label>
              <TextInput
                placeholder="e.g. WELCOME50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="flex gap-x-4 items-start">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Discount Type
                </label>
                <SelectInput
                  placeholder="Select Type"
                  options={[
                    { label: "Percentage (%)", value: "PERCENTAGE" },
                    { label: "Fixed Amount (₦)", value: "FIXED_AMOUNT" },
                  ]}
                  value={discountType}
                  onValueChange={(val: any) => setDiscountType(val)}
                />
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {discountType === "PERCENTAGE" ? "Discount (%)" : "Discount Amount (₦)"}
                </label>
                <NumberTextInput
                  placeholder={discountType === "PERCENTAGE" ? "e.g. 50" : "e.g. 3000"}
                  value={discountValue}
                  setValue={setDiscountValue}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Target Audience
              </label>
              <SelectInput
                placeholder="Select Target Audience"
                options={[
                  { label: "All Users", value: "ALL" },
                  { label: "First-Time Product Uploaders", value: "FIRST_TIME_POSTERS" },
                  { label: "Active Subscribed Sellers", value: "SUBSCRIBED_SELLERS" },
                  { label: "Sellers in Specific Category", value: "CATEGORY_SELLERS" },
                  { label: "Single Specific User", value: "SPECIFIC_USER" },
                ]}
                value={targetType}
                onValueChange={(val: any) => setTargetType(val)}
              />
            </div>

            {targetType === "CATEGORY_SELLERS" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Target Product Category
                </label>
                <SelectInput
                  placeholder="Select Category"
                  options={categoriesSelectData}
                  value={targetCategoryId}
                  onValueChange={(val) => setTargetCategoryId(val)}
                />
              </div>
            )}

            {targetType === "SPECIFIC_USER" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Target User Email Address
                </label>
                <TextInput
                  placeholder="seller@example.com"
                  value={targetUserEmail}
                  onChange={(e) => setTargetUserEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex gap-x-4 items-start">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Max Total Uses
                </label>
                <NumberTextInput
                  placeholder="e.g. 100 (Optional)"
                  value={maxUses}
                  setValue={setMaxUses}
                />
              </div>

              <div className="w-1/2 flex flex-col">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full h-[2.5rem] sm:h-12 px-4 text-xs sm:text-sm text-grey9 border border-grey5 rounded-md outline-none hover:border-grey7 focus:border-primary bg-white transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-x-3 mt-4">
              <Button
                format="tertiary"
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button format="primary" type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Promo Code"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
