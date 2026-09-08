"use client";

import React, { useState } from "react";
import { Category } from "@/interface/products";
import { createProductRequestApi } from "@/api/productRequest";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import { Send, Plus, Loader2, Tag, MapPin } from "lucide-react";
import { cn } from "@/utils";

interface Props {
  selectedCategoryId: string;
  categories: Category[];
  onRequestCreated: () => void;
  onOpenFullModal: () => void;
}

export const QuickRequestComposer: React.FC<Props> = ({
  selectedCategoryId,
  categories,
  onRequestCreated,
  onOpenFullModal,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [locationState, setLocationState] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to post a product request in this room.",
        variant: "info",
      });
      router.push("/auth/login");
      return;
    }

    if (!title.trim()) return;

    // Default category to first category if all categories ("") is selected
    const targetCategoryId = selectedCategoryId || (categories[0]?.id ?? "");

    if (!targetCategoryId) {
      toast({
        title: "Category Required",
        description: "Please select a category room first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await createProductRequestApi({
        title: title.trim(),
        categoryId: targetCategoryId,
        budget: budget ? Number(budget) : undefined,
        state: locationState.trim() || undefined,
      });

      toast({
        title: "Request Sent to Group!",
        description: "Sellers in this room can now view and chat with you directly.",
        variant: "success",
      });

      setTitle("");
      setBudget("");
      setLocationState("");
      setShowOptions(false);
      onRequestCreated();
    } catch (err: any) {
      toast({
        title: "Failed to Send",
        description: err.message || "Could not post your request. Try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-t border-grey2 p-3 sm:p-4 rounded-b-2xl shadow-sm">
      {/* Optional Extra Fields (Budget / State) */}
      {showOptions && (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2.5 bg-grey1/60 rounded-xl text-xs transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1.5 bg-white border border-grey3 rounded-lg px-2.5 py-1.5 flex-1 min-w-[140px]">
            <Tag className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <input
              type="number"
              placeholder="Budget (₦ optional)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-grey9"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-grey3 rounded-lg px-2.5 py-1.5 flex-1 min-w-[140px]">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Location (e.g. Lagos)"
              value={locationState}
              onChange={(e) => setLocationState(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-grey9"
            />
          </div>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="text-[11px] font-semibold text-primary hover:underline px-2 py-1 ml-auto"
          >
            + Add detailed specs & description
          </button>
        </div>
      )}

      {/* Main Chat Bar Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          title="Add Budget & Details"
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border transition-all shrink-0",
            showOptions
              ? "bg-primary/10 border-primary text-primary"
              : "bg-grey1 border-grey3 text-grey6 hover:bg-grey2"
          )}
        >
          <Plus className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={
            selectedCategoryId
              ? `Message #${categories.find((c) => c.id === selectedCategoryId)?.name || "room"}: What are you looking to buy?`
              : "What are you looking to buy? Post in room..."
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 h-10 px-4 bg-grey1/70 border border-grey3 focus:border-primary focus:bg-white rounded-full text-xs sm:text-sm text-grey10 outline-none transition-all"
        />

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
