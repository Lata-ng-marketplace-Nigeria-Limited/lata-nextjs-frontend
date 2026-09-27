"use client";

import React, { useState } from "react";
import AppAvatar from "@molecule/Avatar";
import {
  ProductRequest,
  respondToProductRequestApi,
  closeProductRequestApi,
} from "@/api/productRequest";
import { formatPrice, cn } from "@/utils";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useToast } from "@components/ui/use-toast";
import { ToastAction } from "@components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import {
  MessageSquare,
  MapPin,
  Loader2,
  MessageCircle,
  XCircle,
  Crown,
} from "lucide-react";

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
  const [showSubModal, setShowSubModal] = useState(false);

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
    currentUserId &&
      requestUserId &&
      String(currentUserId) === String(requestUserId),
  );

  const isSubscribed = Boolean(
    user && user.subscriptionStatus === "ACTIVE"
  );

  const checkSubscription = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to text and chat with direct buyers.",
        variant: "info",
        action: (
          <ToastAction
            altText="Sign In"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </ToastAction>
        ),
      });
      return false;
    }

    if (!isSubscribed && user.role !== "ADMIN") {
      setShowSubModal(true);
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
      const defaultMessage = `Hi ${productRequest.user?.name || "Buyer"}! I saw your request for "${productRequest.title}" on Lata.ng and I have it available.`;
      if (res?.data?.chatId) {
        router.push(
          `/messages?id=${res.data.chatId}&text=${encodeURIComponent(defaultMessage)}`,
        );
      } else {
        router.push(`/messages?text=${encodeURIComponent(defaultMessage)}`);
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
        description:
          "Buyer has not provided a phone number for direct WhatsApp messaging.",
        variant: "info",
      });
      return;
    }

    let cleanPhone = rawPhone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "234" + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `Hi ${productRequest.user?.name || "Buyer"}! I saw your request for "${productRequest.title}" on Lata.ng and I have it available.`,
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

  const createdDate =
    productRequest.createdAt || (productRequest as any).created_at;
  const buyerName = productRequest.user?.name || "Buyer";

  return (
    <>
      <div
        className={cn(
          "flex gap-2.5 border-b border-grey2/40 px-3 py-3 transition-colors",
          isOwner
            ? "border-l-4 border-l-primary bg-purple-50/30"
            : "hover:bg-grey1/30",
        )}
      >
        {/* Buyer Initials Avatar */}
        <AppAvatar
          src={productRequest.user?.avatar}
          name={buyerName}
          className={cn(
            "mt-0.5 h-8 w-8 shrink-0 border border-grey2 text-xs font-bold",
            !user && "select-none blur-sm",
          )}
        />

        {/* Message Content */}
        <div className="min-w-0 flex-1">
          {/* Header: Name, Category, Timestamp, YOUR REQUEST Badge */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-xs font-bold text-grey10",
                !user && "select-none blur-sm",
              )}
            >
              {buyerName}
            </span>

            {isOwner ? (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white">
                YOUR REQUEST
              </span>
            ) : (
              <span className="rounded-full bg-purp2/80 px-2 py-0.5 text-[10px] font-semibold text-primary">
                #{productRequest.category?.name || "General"}
              </span>
            )}

            {isOwner && (
              <span className="rounded-full bg-purp2/80 px-2 py-0.5 text-[10px] font-semibold text-primary">
                #{productRequest.category?.name || "General"}
              </span>
            )}

            {productRequest.status === "INACTIVE" && (
              <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                EXPIRED (7+ DAYS)
              </span>
            )}

            {productRequest.status === "CLOSED" && (
              <span className="rounded-full border border-grey3 bg-grey2 px-2 py-0.5 text-[10px] font-bold text-grey7">
                CLOSED
              </span>
            )}

            <span className="ml-auto text-[10px] text-grey5">
              {timeAgo(createdDate)}
            </span>
          </div>

          {/* Minimal Chat Bubble */}
          <div className="rounded-tl-xs inline-block w-full max-w-2xl rounded-2xl border border-grey2 bg-white p-3 text-xs text-grey9">
            <p className="text-xs font-semibold text-grey10 sm:text-sm">
              {productRequest.title}
            </p>

            {productRequest.description && (
              <p className="mt-1 text-xs leading-relaxed text-grey7">
                {productRequest.description}
              </p>
            )}

            {/* Badges & Action */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-grey1 pt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {productRequest.requesterType && (
                  <span className="rounded-md border border-blue-200/60 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    {productRequest.requesterType}
                  </span>
                )}

                {productRequest.budget && (
                  <span className="rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                    {formatPrice(productRequest.budget)}
                  </span>
                )}

                {productRequest.state && (
                  <span className="flex items-center gap-1 rounded-md border border-grey2 bg-grey1 px-2 py-0.5 text-[11px] text-grey7">
                    <MapPin className="h-3 w-3 text-grey5" />
                    {productRequest.city ? `${productRequest.city}, ` : ""}
                    {productRequest.state}
                  </span>
                )}
              </div>

              {isOwner ? (
                <div className="ml-auto flex items-center gap-2">
                  <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Posted by You
                  </span>
                  {productRequest.status === "OPEN" && (
                    <button
                      disabled={loadingClose}
                      onClick={handleCloseRequest}
                      className="flex items-center gap-1 rounded-lg border border-grey3 bg-grey1 px-2 py-1 text-xs font-medium text-grey8 transition-all hover:bg-grey2 hover:text-grey10 disabled:opacity-50"
                      title="Close this request"
                    >
                      {loadingClose ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                          <span>Close Request</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  {/* In-App Chat Button */}
                  <button
                    disabled={loadingChat}
                    onClick={handleRespond}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
                    title="Chat in Lata App"
                  >
                    {loadingChat ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <MessageSquare className="h-3 w-3" />
                        <span>In-App Chat</span>
                      </>
                    )}
                  </button>

                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
                    title="Text Buyer via WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Required Modal */}
      <Dialog open={showSubModal} onOpenChange={setShowSubModal}>
        <DialogContent title="Subscription Required" className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-1">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-lg font-bold text-grey10">
              Subscription Required
            </DialogTitle>
            <DialogDescription className="text-sm text-grey7 leading-relaxed mt-1">
              Only subscribed users can message buyers. Please subscribe to an active plan to text and chat with buyers.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={() => setShowSubModal(false)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-grey7 bg-grey1 hover:bg-grey2 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowSubModal(false);
                router.push("/subscriptions");
              }}
              className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Subscribe</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
