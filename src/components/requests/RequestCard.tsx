"use client";

import React, { useState } from "react";
import AppAvatar from "@molecule/Avatar";
import { ProductRequest, respondToProductRequestApi } from "@/api/productRequest";
import { formatPrice } from "@/utils";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import { MessageSquare, MapPin, Loader2 } from "lucide-react";

interface Props {
  productRequest: ProductRequest;
  onClosed?: () => void;
}

export const RequestCard: React.FC<Props> = ({ productRequest }) => {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingChat, setLoadingChat] = useState(false);

  const isOwner = user?.id === productRequest.userId;

  const handleRespond = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to chat with this buyer.",
        variant: "info",
      });
      router.push("/auth/login");
      return;
    }

    if (isOwner) {
      toast({
        title: "Your Request",
        description: "You posted this request in the group room.",
        variant: "info",
      });
      return;
    }

    try {
      setLoadingChat(true);
      const res = await respondToProductRequestApi(productRequest.id);
      toast({
        title: "Chat Connected!",
        description: "Redirecting to your conversation with the buyer...",
        variant: "success",
      });
      if (res?.data?.chatId) {
        router.push(`/messages?id=${res.data.chatId}`);
      } else {
        router.push("/messages");
      }
    } catch (err: any) {
      toast({
        title: "Chat Error",
        description: err.message || "Failed to start chat with buyer.",
        variant: "destructive",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return "Recently";

    const diff = Math.floor((Date.now() - parsedDate.getTime()) / 1000);
    if (diff <= 0 || diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const createdDate = productRequest.createdAt || (productRequest as any).created_at;
  const buyerName = productRequest.user?.name || "Buyer";

  return (
    <div className="flex gap-2.5 px-3 py-2.5 hover:bg-grey1/30 transition-colors border-b border-grey2/40">
      {/* Buyer Initials Avatar */}
      <AppAvatar
        src={productRequest.user?.avatar}
        name={buyerName}
        className="w-8 h-8 text-xs font-bold shrink-0 mt-0.5 border border-grey2 shadow-2xs"
      />

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Name, Category, Timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-grey10">
            {buyerName}
          </span>

          {isOwner && (
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded">
              You
            </span>
          )}

          <span className="text-[10px] font-semibold text-primary bg-purp2/80 px-2 py-0.5 rounded-full">
            #{productRequest.category?.name || "General"}
          </span>

          <span className="text-[10px] text-grey5 ml-auto sm:ml-0">
            {timeAgo(createdDate)}
          </span>
        </div>

        {/* Minimal Chat Bubble */}
        <div className="inline-block bg-white border border-grey2 rounded-2xl rounded-tl-xs p-3 text-xs text-grey9 max-w-2xl shadow-2xs">
          <p className="font-semibold text-xs sm:text-sm text-grey10">
            {productRequest.title}
          </p>

          {productRequest.description && (
            <p className="text-xs text-grey7 mt-1 leading-relaxed">
              {productRequest.description}
            </p>
          )}

          {/* Badges & Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-grey1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {productRequest.budget && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[11px] border border-emerald-200/60">
                  {formatPrice(productRequest.budget)}
                </span>
              )}

              {productRequest.state && (
                <span className="px-2 py-0.5 bg-grey1 text-grey7 rounded-md text-[11px] border border-grey2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-grey5" />
                  {productRequest.city ? `${productRequest.city}, ` : ""}
                  {productRequest.state}
                </span>
              )}
            </div>

            {!isOwner && (
              <button
                disabled={loadingChat}
                onClick={handleRespond}
                className="ml-auto px-3 py-1 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
              >
                {loadingChat ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <MessageSquare className="w-3 h-3" />
                    <span>Chat Buyer</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
