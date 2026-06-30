"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { updateUserProfileApi } from "@/api/auth.client";
import Modal from "@/components/molecule/Modal";
import Button from "@/components/atom/Button";
import { cn } from "@/utils";

export default function BuyerRolePromptModal() {
  const { user, isLoggedIn, updateUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only prompt if logged in, role is BUYER, and buyerRole is not set
    if (isLoggedIn && user && user.role === "BUYER" && !user.buyerRole) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isLoggedIn, user]);

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const res = await updateUserProfileApi({
        name: user?.name || "",
        buyerRole: selectedRole,
      });
      if (res?.userData) {
        updateUser(res.userData);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update buyer role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isShown={isOpen}
      setIsShown={setIsOpen}
      preventOverlayClose={true}
      contentClass="max-w-[400px] p-6 bg-white rounded-xl shadow-lg border border-gray-150"
    >
      <div className="flex flex-col items-center text-center gap-y-4">
        <h3 className="text-xl font-bold text-gray-900">What best describes you?</h3>
        <p className="text-sm text-gray-500">
          Please select an option to help us customize your experience.
        </p>

        <div className="flex flex-col gap-y-3 w-full mt-2">
          {[
            { label: "Direct Buyer", value: "direct_buyer" },
            { label: "Direct Mandate", value: "direct_mandate" },
            { label: "Agent", value: "agent" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedRole(option.value)}
              type="button"
              className={cn(
                "w-full py-3 px-4 rounded-lg border text-sm font-semibold transition text-left flex justify-between items-center",
                selectedRole === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
              )}
            >
              {option.label}
              {selectedRole === option.value && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        <Button
          format="primary"
          className="w-full mt-4 h-12"
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}
