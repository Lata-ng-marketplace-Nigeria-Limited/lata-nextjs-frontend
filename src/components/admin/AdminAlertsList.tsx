"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/molecule/Modal";
import TextInput from "@/components/input/TextInput";
import { SelectInput } from "@/components/input/SelectInput";
import { showToast } from "@/utils";
import {
  createAdminAlertApi,
  deleteAdminAlertApi,
  getAdminAlertsApi,
  SystemAlert,
  toggleAdminAlertApi,
  updateAdminAlertApi,
} from "@/api/systemAlerts";
import { Bell, Plus, ToggleLeft, ToggleRight, Trash2, Megaphone, Pencil } from "lucide-react";

export const AdminAlertsList = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<SystemAlert | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"banner" | "modal" | "toast">("banner");
  const [severity, setSeverity] = useState<"promo" | "info" | "warning" | "success">("promo");
  const [targetAudience, setTargetAudience] = useState<
    "all" | "guests" | "logged_in" | "sellers" | "buyers" | "subscribed_users" | "non_subscribed_users"
  >("all");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [selectedRouteValue, setSelectedRouteValue] = useState("none");
  const [promoCode, setPromoCode] = useState("");
  const [isActive, setIsActive] = useState(true);

  const PRESET_ROUTES = [
    "none",
    "/subscriptions",
    "/requests",
    "/create-product",
    "/reels",
    "/shop",
    "/messages",
    "/settings",
  ];

  const ROUTE_OPTIONS = [
    { label: "None (No Action Link)", value: "none" },
    { label: "Subscriptions Page (/subscriptions)", value: "/subscriptions" },
    { label: "Buyer Requests Feed (/requests)", value: "/requests" },
    { label: "Post a Product / Request (/create-product)", value: "/create-product" },
    { label: "Video Reels (/reels)", value: "/reels" },
    { label: "My Shop / Products (/shop)", value: "/shop" },
    { label: "Messages Inbox (/messages)", value: "/messages" },
    { label: "User Settings (/settings)", value: "/settings" },
    { label: "Custom Route / URL...", value: "CUSTOM" },
  ];

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getAdminAlertsApi();
      if (res?.data) {
        setAlerts(res.data);
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to fetch system alerts", "destructive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleOpenCreateModal = () => {
    resetForm();
    setEditingAlert(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (alert: SystemAlert) => {
    setEditingAlert(alert);
    setTitle(alert.title || "");
    setMessage(alert.message || "");
    setType(alert.type || "banner");
    setSeverity(alert.severity || "promo");
    setTargetAudience(alert.targetAudience || "all");
    setCtaLabel(alert.ctaLabel || "");
    const link = alert.ctaLink || "";
    setCtaLink(link);
    if (!link || link === "none") {
      setSelectedRouteValue("none");
    } else if (PRESET_ROUTES.includes(link)) {
      setSelectedRouteValue(link);
    } else {
      setSelectedRouteValue("CUSTOM");
    }
    setPromoCode(alert.promoCode || "");
    setIsActive(alert.isActive);
    setIsModalOpen(true);
  };

  const handleSaveAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast("Title and message are required", "destructive");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        message,
        type,
        severity,
        targetAudience,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaLink: ctaLink.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
        isActive,
      };

      if (editingAlert) {
        await updateAdminAlertApi(editingAlert.id, payload);
        showToast("System alert updated successfully!", "success");
      } else {
        await createAdminAlertApi(payload);
        showToast("System alert created successfully!", "success");
      }

      setIsModalOpen(false);
      resetForm();
      fetchAlerts();
    } catch (err: any) {
      showToast(err?.message || "Failed to save alert", "destructive");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleAdminAlertApi(id);
      showToast("Alert status updated!", "success");
      fetchAlerts();
    } catch (err: any) {
      showToast(err?.message || "Failed to toggle alert status", "destructive");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this system alert?")) return;
    try {
      await deleteAdminAlertApi(id);
      showToast("Alert deleted successfully!", "success");
      fetchAlerts();
    } catch (err: any) {
      showToast(err?.message || "Failed to delete alert", "destructive");
    }
  };

  const resetForm = () => {
    setEditingAlert(null);
    setTitle("");
    setMessage("");
    setType("banner");
    setSeverity("promo");
    setTargetAudience("all");
    setCtaLabel("");
    setCtaLink("");
    setSelectedRouteValue("none");
    setPromoCode("");
    setIsActive(true);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header section responsive flex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#5113A1] shrink-0" />
            System Alerts & Announcements
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Create site-wide banners, promo code discount alerts, or notices for users.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-[#5113A1] hover:bg-[#400e82] text-white px-4 py-2 rounded-md font-medium text-xs sm:text-sm transition w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Alert
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 text-sm">Loading system alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
          <Bell className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-800 text-sm sm:text-base">No system alerts found</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Click &quot;Create Alert&quot; to show a new promo discount or announcement banner to your users.
          </p>
        </div>
      ) : (
        /* Responsive scrollable table container */
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto w-full">
          <table className="w-full text-left text-xs sm:text-sm text-gray-600 min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3 sm:px-4">Title & Message</th>
                <th className="py-3 px-3 sm:px-4">Type / Severity</th>
                <th className="py-3 px-3 sm:px-4">Target Audience</th>
                <th className="py-3 px-3 sm:px-4">Promo Code</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
                <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-3 sm:px-4 max-w-xs">
                    <div className="font-semibold text-gray-900">{alert.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{alert.message}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 space-y-1">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800 capitalize mr-1 border border-gray-200">
                      {alert.type}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                        alert.severity === "promo"
                          ? "bg-purple-100 text-purple-800"
                          : alert.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : alert.severity === "success"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 capitalize font-medium text-gray-700">
                    {alert.targetAudience.replace(/_/g, " ")}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {alert.promoCode ? (
                      <span className="font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-xs border border-purple-200 font-bold">
                        {alert.promoCode}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        alert.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {alert.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => handleOpenEditModal(alert)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-[#5113A1] transition"
                        title="Edit Alert"
                      >
                        <Pencil className="w-4 h-4 text-gray-600 hover:text-[#5113A1]" />
                      </button>
                      <button
                        onClick={() => handleToggle(alert.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-[#5113A1] transition"
                        title={alert.isActive ? "Deactivate Alert" : "Activate Alert"}
                      >
                        {alert.isActive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-500 hover:text-red-700 transition"
                        title="Delete Alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Alert Modal */}
      <Modal
        isShown={isModalOpen}
        setIsShown={setIsModalOpen}
        hideCloseButton
        contentClass="!w-[94vw] !max-w-[560px] p-4 sm:p-6 bg-white rounded-2xl"
      >
        <div className="space-y-4 w-full bg-white max-h-[80vh] overflow-y-auto pr-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {editingAlert ? "Edit System Alert" : "Create System Alert / Announcement"}
          </h3>
          <form onSubmit={handleSaveAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alert Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 20% Off Subscriptions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-[#5113A1] focus:border-[#5113A1] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alert Message <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-[#5113A1] focus:border-[#5113A1] focus:outline-none"
                rows={3}
                placeholder="e.g. New users can now purchase subscription plans at 20% discount using code DISCOUNT20."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Severity / Category</label>
                <SelectInput
                  value={severity}
                  onValueChange={(val) => setSeverity(val as any)}
                  options={[
                    { label: "Promo / Discount", value: "promo" },
                    { label: "Information", value: "info" },
                    { label: "Warning / Notice", value: "warning" },
                    { label: "Success / Update", value: "success" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Audience</label>
                <SelectInput
                  value={targetAudience}
                  onValueChange={(val) => setTargetAudience(val as any)}
                  options={[
                    { label: "All Visitors & Users", value: "all" },
                    { label: "Guests / Unauthenticated", value: "guests" },
                    { label: "Logged-In Users", value: "logged_in" },
                    { label: "Subscribed Users", value: "subscribed_users" },
                    { label: "Non-Subscribed Users", value: "non_subscribed_users" },
                    { label: "Sellers", value: "sellers" },
                    { label: "Buyers", value: "buyers" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Promo Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. DISCOUNT20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-[#5113A1] focus:border-[#5113A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Display Type</label>
                <SelectInput
                  value={type}
                  onValueChange={(val) => setType(val as any)}
                  options={[
                    { label: "Top Announcement Banner", value: "banner" },
                    { label: "Toast Notification", value: "toast" },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Action Button Label (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Subscribe Now"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-[#5113A1] focus:border-[#5113A1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Action Link Route (Optional)</label>
                <SelectInput
                  value={selectedRouteValue}
                  onValueChange={(val) => {
                    setSelectedRouteValue(val);
                    if (val === "none") {
                      setCtaLink("");
                    } else if (val !== "CUSTOM") {
                      setCtaLink(val);
                    }
                  }}
                  options={ROUTE_OPTIONS}
                />
              </div>
            </div>

            {selectedRouteValue === "CUSTOM" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Redirect URL / Route</label>
                <input
                  type="text"
                  placeholder="e.g. /custom-page or https://..."
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-[#5113A1] focus:border-[#5113A1] focus:outline-none"
                />
              </div>
            )}

            <div className="bg-purple-50 border border-purple-100 rounded-lg p-2.5 text-xs text-purple-900 leading-relaxed">
              <p className="font-semibold text-[#5113A1]">Redirect Route Information</p>
              <p className="text-gray-600 mt-0.5">
                Select the target application route users will be navigated to when clicking the action button (e.g. Subscriptions or Buyer Requests).
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#5113A1] rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-xs sm:text-sm font-medium text-gray-700">
                Activate alert
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-100 text-gray-700 px-3.5 py-2 rounded-md font-medium text-xs sm:text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#5113A1] text-white hover:bg-[#400e82] font-semibold px-3.5 py-2 rounded-md text-xs sm:text-sm transition"
              >
                {submitting
                  ? editingAlert
                    ? "Saving..."
                    : "Publishing..."
                  : editingAlert
                  ? "Save Changes"
                  : "Publish Alert"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
