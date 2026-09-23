"use client";

import React, { useState } from "react";
import AppAvatar from "@molecule/Avatar";
import { ProductRequest, respondToProductRequestApi, closeProductRequestApi } from "@/api/productRequest";
import { formatPrice, cn } from "@/utils";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import { ToastAction } from "@components/ui/toast";
import { MessageSquare, MapPin, Loader2, MessageCircle, XCircle } from "lucide-react";

interface Props {
  productRequest: ProductRequest;
  onClosed?: () => void;
}

export const RequestCard: React.FC<Props> = ({ productRequest, onClosed }) => {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingClose, setLoadingClose] = useState(false);

  const handleCloseRequest = async () => {
    try {
      setLoadingClose(true);
      await closeProductRequestApi(productRequest.id);
      toast({
        title: "Request Closed",
        description: "Your product request has been closed.",
        variant: "success",
      });
      onClosed?.();
    } catch (err: any) {
      toast({
        title: "Error Closing Request",
        description: err.message || "Failed to close product request.",
        variant: "destructive",
      });
    } finally {
      setLoadingClose(false);
    }
  };

  const currentUserId = user?.id || (user as any)?._id;
  const requestUserId = productRequest.userId || productRequest.user?.id;
  const isOwner = Boolean(
    currentUserId && requestUserId && String(currentUserId) === String(requestUserId)
  );

  const isSubscribed = Boolean(
    user && user.subscriptionStatus === "ACTIVE" && user.planId
  );

  const isSeller = Boolean(
    user && (user.role === "SELLER" || user.role === "ADMIN" || user.planId)
  );

  const checkSubscription = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to text and chat with direct buyers.",
        variant: "info",
      });
      router.push("/auth/login");
      return false;
    }

    if (!isSubscribed) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to a plan to text and chat with direct buyers.",
        variant: "info",
        action: (
          <ToastAction
            altText="Subscribe Now"
            onClick={() => router.push("/subscriptions")}
          >
            Subscribe Now
          </ToastAction>
        ),
      });
      return false;
    }

    return true;
  };

  const handleRespond = async () => {
    if (!checkSubscription()) return;

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

  const handleWhatsApp = () => {
    if (!checkSubscription()) return;

    const rawPhone = productRequest.user?.phoneNumber;
    if (!rawPhone) {
      toast({
        title: "No Phone Number",
        description: "Buyer has not provided a phone number for direct WhatsApp messaging.",
        variant: "info",
      });
      return;
    }

    let cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "234" + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `Hi ${productRequest.user?.name || "Buyer"}! I saw your request for "${productRequest.title}" on Lata.ng and I have it available.`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
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
    <div className={cn(
      "flex gap-2.5 px-3 py-3 transition-colors border-b border-grey2/40",
      isOwner ? "bg-purple-50/30 border-l-4 border-l-primary" : "hover:bg-grey1/30"
    )}>
      {/* Buyer Initials Avatar */}
      <AppAvatar
        src={productRequest.user?.avatar}
        name={buyerName}
        className="w-8 h-8 text-xs font-bold shrink-0 mt-0.5 border border-grey2 shadow-2xs"
      />

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Name, Category, Timestamp, YOUR REQUEST Badge */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-bold text-grey10">
            {buyerName}
          </span>

          {isOwner ? (
            <span className="text-[11px] bg-primary text-white font-bold px-2.5 py-0.5 rounded-full shadow-2xs tracking-wider">
              YOUR REQUEST
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-primary bg-purp2/80 px-2 py-0.5 rounded-full">
              #{productRequest.category?.name || "General"}
            </span>
          )}

          {isOwner && (
            <span className="text-[10px] font-semibold text-primary bg-purp2/80 px-2 py-0.5 rounded-full">
              #{productRequest.category?.name || "General"}
            </span>
          )}

          {productRequest.status === "INACTIVE" && (
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
              EXPIRED (7+ DAYS)
            </span>
          )}

          {productRequest.status === "CLOSED" && (
            <span className="text-[10px] bg-grey2 text-grey7 font-bold px-2 py-0.5 rounded-full border border-grey3">
              CLOSED
            </span>
          )}

          <span className="text-[10px] text-grey5 ml-auto">
            {timeAgo(createdDate)}
          </span>
        </div>

        {/* Minimal Chat Bubble */}
        <div className="inline-block bg-white border border-grey2 rounded-2xl rounded-tl-xs p-3 text-xs text-grey9 max-w-2xl shadow-2xs w-full">
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
              {productRequest.requesterType && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md text-[11px] border border-blue-200/60">
                  {productRequest.requesterType}
                </span>
              )}

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

            {isOwner ? (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  Posted by You
                </span>
                {productRequest.status === "OPEN" && (
                  <button
                    disabled={loadingClose}
                    onClick={handleCloseRequest}
                    className="px-2 py-1 bg-grey1 hover:bg-grey2 text-grey8 hover:text-grey10 rounded-lg text-xs font-medium flex items-center gap-1 transition-all border border-grey3 disabled:opacity-50"
                    title="Close this request"
                  >
                    {loadingClose ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        <span>Close Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : isSeller ? (
              <div className="flex items-center gap-1.5 ml-auto flex-wrap">
                {/* In-App Chat Button */}
                <button
                  disabled={loadingChat}
                  onClick={handleRespond}
                  className="px-2.5 py-1 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
                  title="Chat in Lata App"
                >
                  {loadingChat ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="w-3 h-3" />
                      <span>In-App Chat</span>
                    </>
                  )}
                </button>

                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsApp}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  title="Text Buyer via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            ) : (
              <span className="ml-auto text-[11px] font-medium text-grey6 bg-grey1 px-2.5 py-1 rounded-lg border border-grey2">
                Sellers can respond
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
