"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/atom/Button";
import Modal from "@/components/molecule/Modal";
import TextInput from "@/components/input/TextInput";
import { NumberTextInput } from "@/components/input/NumberTextInput";
import { SelectInput } from "@/components/input/SelectInput";
import { DatePickerInput } from "@/components/input/DatePickerInput";
import { formatPrice, showToast } from "@/utils";
import {
  createAdminPromoCodeApi,
  deleteAdminPromoCodeApi,
  getAdminPromoCodesApi,
  PromoCode,
  sendPromoBroadcastEmailApi,
  updateAdminPromoCodeApi,
} from "@/api/promo.client";
import { useCategory } from "@/hooks/useCategory";
import { Pencil, Plus, Send, Trash2 } from "lucide-react";

export const PromoCodesList = () => {
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sendingBroadcastId, setSendingBroadcastId] = useState<string | null>(null);
  const [broadcastModalPromo, setBroadcastModalPromo] = useState<PromoCode | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromoCode | null>(null);

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
  const [applicableTo, setApplicableTo] = useState<
    "SINGLE_PRODUCT_PROMOTION" | "SUBSCRIPTION" | "BOTH"
  >("BOTH");
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

  const handleOpenCreateModal = () => {
    resetForm();
    setEditingPromoCode(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo: PromoCode) => {
    setEditingPromoCode(promo);
    setCode(promo.code || "");
    setDiscountType(promo.discountType || "PERCENTAGE");
    setDiscountValue(promo.discountValue ? String(promo.discountValue) : "");
    setTargetType(promo.targetType || "ALL");
    setTargetCategoryId(promo.targetCategoryId || "");
    setTargetUserEmail(promo.targetUser?.email || "");
    setApplicableTo(promo.applicableTo || "BOTH");
    setMaxUses(promo.maxUses ? String(promo.maxUses) : "");
    setExpiresAt(promo.expiresAt ? new Date(promo.expiresAt).toISOString().substring(0, 10) : "");
    setIsModalOpen(true);
  };

  const handleSavePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    if (targetType === "SPECIFIC_USER" && !targetUserEmail.trim()) {
      showToast("Please enter the user's email address", "destructive");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        targetType,
        targetCategoryId: targetType === "CATEGORY_SELLERS" ? targetCategoryId : undefined,
        targetUserEmail: targetType === "SPECIFIC_USER" ? targetUserEmail.trim() : undefined,
        applicableTo,
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };

      if (editingPromoCode) {
        await updateAdminPromoCodeApi(editingPromoCode.id, payload);
        showToast("Promo code updated successfully!", "success");
      } else {
        await createAdminPromoCodeApi(payload);
        showToast("Promo code created successfully!", "success");
      }

      setIsModalOpen(false);
      resetForm();
      fetchPromoCodes();
    } catch (err: any) {
      showToast(err?.message || "Failed to save promo code", "destructive");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePromoCode = async (promo: PromoCode) => {
    setSubmitting(true);
    try {
      await deleteAdminPromoCodeApi(promo.id);
      showToast("Promo code deleted successfully!", "success");
      setDeletingPromo(null);
      fetchPromoCodes();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete promo code", "destructive");
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

  const handleConfirmSendBroadcast = async () => {
    if (!broadcastModalPromo) return;
    setSendingBroadcastId(broadcastModalPromo.id);
    try {
      const res = await sendPromoBroadcastEmailApi(broadcastModalPromo.id);
      showToast(res.message || "Broadcast sent successfully!", "success");
      setBroadcastModalPromo(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to send email broadcast", "destructive");
    } finally {
      setSendingBroadcastId(null);
    }
  };

  const resetForm = () => {
    setEditingPromoCode(null);
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setTargetType("ALL");
    setTargetCategoryId("");
    setTargetUserEmail("");
    setApplicableTo("BOTH");
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

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#5113A1] text-white hover:bg-[#400e82] font-semibold px-4 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Promo Code
        </button>
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
                <th className="px-6 py-4">Applicable To</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Loading promo codes...
                  </td>
                </tr>
              ) : promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No promo codes created yet. Click <strong>Create Promo Code</strong> to create one.
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

                    <td className="px-6 py-4 text-xs font-medium text-gray-700">
                      {promo.applicableTo === "SUBSCRIPTION"
                        ? "Subscriptions Only"
                        : promo.applicableTo === "SINGLE_PRODUCT_PROMOTION"
                        ? "Product Ads Only"
                        : "Both"}
                    </td>

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
                        <button
                          onClick={() => setBroadcastModalPromo(promo)}
                          disabled={sendingBroadcastId === promo.id}
                          className="px-2.5 py-1 rounded text-xs font-semibold transition bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1"
                          title="Broadcast Promo Code"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingBroadcastId === promo.id ? "Sending..." : "Broadcast"}</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(promo)}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition"
                          title="Edit Promo Code"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(promo)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                            promo.isActive
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={promo.isActive ? "Expire Now" : "Reactivate"}
                        >
                          {promo.isActive ? "Expire" : "Reactivate"}
                        </button>

                        <button
                          onClick={() => setDeletingPromo(promo)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition"
                          title="Delete Promo Code"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Promo Code Modal */}
      <Modal
        isShown={isModalOpen}
        setIsShown={setIsModalOpen}
        hideCloseButton
        contentClass="!w-[94vw] !max-w-[540px] p-4 sm:p-6 bg-white rounded-2xl border border-gray-100"
      >
        <div className="flex flex-col gap-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {editingPromoCode ? "Edit Promo Code" : "Create New Promo Code"}
            </h3>
            <p className="text-xs text-gray-500">
              Set targeting rules, discounts, and expiration dates for promo redemptions.
            </p>
          </div>

          <form onSubmit={handleSavePromoCode} className="flex flex-col gap-y-4 mt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Promo Code String <span className="text-red-500">*</span>
              </label>
              <TextInput
                placeholder="e.g. WELCOME50"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {discountType === "PERCENTAGE" ? "Discount (%)" : "Discount Amount (₦)"} <span className="text-red-500">*</span>
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
              <label className="block text-xs font-semibold text-gray-700 mb-1">
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

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Applicable To
              </label>
              <SelectInput
                placeholder="Select applicability"
                options={[
                  { label: "Both (Subscriptions & Product Ads)", value: "BOTH" },
                  { label: "Subscriptions Only", value: "SUBSCRIPTION" },
                  { label: "Single Product Ads Only", value: "SINGLE_PRODUCT_PROMOTION" },
                ]}
                value={applicableTo}
                onValueChange={(val: any) => setApplicableTo(val)}
              />
            </div>

            {targetType === "CATEGORY_SELLERS" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target User Email Address <span className="text-red-500">*</span>
                </label>
                <TextInput
                  placeholder="seller@example.com"
                  value={targetUserEmail}
                  onChange={(e) => setTargetUserEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Max Total Uses (Optional)
                </label>
                <NumberTextInput
                  placeholder="e.g. 100"
                  value={maxUses}
                  setValue={setMaxUses}
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiration Date (Optional)
                </label>
                <DatePickerInput
                  value={expiresAt}
                  onChange={(dateStr) => setExpiresAt(dateStr)}
                  placeholder="Select expiration date"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100">
              <Button
                format="tertiary"
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button format="primary" type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting
                  ? editingPromoCode
                    ? "Saving..."
                    : "Creating..."
                  : editingPromoCode
                  ? "Save Changes"
                  : "Create Promo Code"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Broadcast Confirmation Modal */}
      <Modal
        isShown={!!broadcastModalPromo}
        setIsShown={(show) => {
          if (!show) setBroadcastModalPromo(null);
        }}
        hideCloseButton
        contentClass="!w-[94vw] !max-w-[460px] p-5 sm:p-6 bg-white rounded-2xl border border-gray-100"
      >
        <div className="flex flex-col gap-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              Send Promo Code Broadcast
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to send an email broadcast and notification for promo code{" "}
              <strong className="font-mono text-gray-900 font-bold">
                '{broadcastModalPromo?.code}'
              </strong>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {broadcastModalPromo?.targetType === "SPECIFIC_USER"
                  ? `user (${broadcastModalPromo?.targetUser?.email || "target user"})`
                  : "targeted sellers"}
              </span>
              ?
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
            <Button
              format="tertiary"
              type="button"
              onClick={() => setBroadcastModalPromo(null)}
              disabled={sendingBroadcastId === broadcastModalPromo?.id}
            >
              Cancel
            </Button>
            <Button
              format="primary"
              type="button"
              disabled={sendingBroadcastId === broadcastModalPromo?.id}
              onClick={handleConfirmSendBroadcast}
            >
              {sendingBroadcastId === broadcastModalPromo?.id
                ? "Sending..."
                : "Send Broadcast"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isShown={!!deletingPromo}
        setIsShown={(show) => {
          if (!show) setDeletingPromo(null);
        }}
        hideCloseButton
        contentClass="!w-[94vw] !max-w-[440px] p-5 sm:p-6 bg-white rounded-2xl border border-gray-100"
      >
        <div className="flex flex-col gap-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">
              Delete Promo Code
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete promo code{" "}
              <strong className="font-mono text-gray-900 font-bold">
                '{deletingPromo?.code}'
              </strong>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
            <Button
              format="tertiary"
              type="button"
              onClick={() => setDeletingPromo(null)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              format="danger"
              type="button"
              disabled={submitting}
              onClick={() => deletingPromo && handleDeletePromoCode(deletingPromo)}
            >
              {submitting ? "Deleting..." : "Delete Code"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
