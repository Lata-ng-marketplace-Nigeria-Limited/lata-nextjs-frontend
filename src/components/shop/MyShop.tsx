"use client";

import React, { useState } from "react";
import { FetchMeta } from "@/interface/general";
import { State } from "@/interface/location";
import { Product } from "@/interface/products";
import { MyProductList } from "@components/shop/MyProductList";
import { GroupedReels, Reel } from "@/api/reels";
import { deleteReelApi } from "@/api/reels.client";
import { useToast } from "@components/ui/use-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@atom/Button";
import { Play, Trash2, VideoOff } from "lucide-react";
import { cn } from "@/utils";
import { ReelViewerModal } from "../reels/ReelViewerModal";
import Modal from "@molecule/Modal";
import Prompt from "@molecule/Prompt";

interface Props {
  products: Product[];
  meta: FetchMeta;
  isEmpty?: boolean;
  statesInNigeria: State[];
  reelsGrouped?: GroupedReels[];
  activeView?: "products" | "reels";
}

export const MyShop = ({
  products,
  meta,
  isEmpty,
  statesInNigeria,
  reelsGrouped,
  activeView,
}: Props) => {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reelToDelete, setReelToDelete] = useState<Reel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showRejectionReasonModal, setShowRejectionReasonModal] = useState(false);
  const [rejectedReelToShow, setRejectedReelToShow] = useState<Reel | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = activeView || "products";

  const handleViewChange = (newView: "products" | "reels") => {
    const params = new URLSearchParams(searchParams);
    params.set("type", newView);
    params.set("tab", "active");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Find all reels belonging to this seller
  const sellerReels: Reel[] = reelsGrouped ? reelsGrouped.flatMap((g) => g.reels) : [];

  const getThumbnailUrl = (videoUrl: string) => {
    if (videoUrl.includes("cloudinary.com")) {
      return videoUrl
        .replace("/video/upload/", "/video/upload/so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
    }
    return "/images/video-placeholder.jpg";
  };

  const handleDeleteClick = (e: React.MouseEvent, reel: Reel) => {
    e.stopPropagation();
    setReelToDelete(reel);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reelToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteReelApi(reelToDelete.id);
      toast({
        title: "Reel Deleted",
        description: "Your reel has been deleted successfully.",
        variant: "success",
      });
      setShowDeleteModal(false);
      setReelToDelete(null);
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete reel.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReelClick = (reel: Reel) => {
    if (reel.status === "CANCELLED") {
      setRejectedReelToShow(reel);
      setShowRejectionReasonModal(true);
    } else {
      setSelectedReel(reel);
    }
  };

  return (
    <div className="mt-4">
      {/* Tabs Selector Header */}
      <div className="flex items-center justify-between border-b border-grey2 pb-2 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => handleViewChange("products")}
            className={cn(
              "pb-2 text-sm font-semibold border-b-2 transition-all text-xs sm:text-sm",
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-grey6 hover:text-grey8"
            )}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => handleViewChange("reels")}
            className={cn(
              "pb-2 text-sm font-semibold border-b-2 transition-all text-xs sm:text-sm",
              activeTab === "reels"
                ? "border-primary text-primary"
                : "border-transparent text-grey6 hover:text-grey8"
            )}
          >
            Reels ({sellerReels.length})
          </button>
        </div>

        {activeTab === "reels" && (
          <Button
            as="link"
            href="/create-reel"
            format="primary"
            className="py-1.5 px-4 text-xs font-semibold rounded-lg shadow-sm"
          >
            + Create Reel
          </Button>
        )}
      </div>

      {/* Products Tab Content */}
      {activeTab === "products" && (
        <MyProductList
          statesInNigeria={statesInNigeria}
          products={products}
          meta={meta}
          isEmpty={isEmpty}
        />
      )}

      {/* Reels Tab Content */}
      {activeTab === "reels" && (() => {
        const tabFilter = searchParams.get("tab") || "active";

        const activeReels = sellerReels.filter(r => r.status === "ACTIVE" || !r.status);
        const pendingReels = sellerReels.filter(r => r.status === "INACTIVE");
        const rejectedReels = sellerReels.filter(r => r.status === "CANCELLED");

        const displayedReels = 
          tabFilter === "active" 
            ? activeReels 
            : tabFilter === "reviewing" 
            ? pendingReels 
            : tabFilter === "denied" 
            ? rejectedReels 
            : [];

        return (
          <>
            {displayedReels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-grey3 rounded-xl bg-grey1">
                <VideoOff className="w-12 h-12 text-grey5 mb-3" />
                <h3 className="text-base font-bold text-grey9">
                  {tabFilter === "active" 
                    ? "No Active Reels" 
                    : tabFilter === "reviewing" 
                    ? "No Pending Reels" 
                    : tabFilter === "denied" 
                    ? "No Rejected Reels" 
                    : "No Reels"}
                </h3>
                <p className="text-xs text-grey6 max-w-sm mt-1 mb-5">
                  {tabFilter === "active"
                    ? "Upload short product videos to engage potential buyers and drive shop traffic."
                    : tabFilter === "reviewing"
                    ? "All your uploaded reels have been processed and approved."
                    : tabFilter === "denied"
                    ? "None of your uploaded reels are currently rejected."
                    : ""}
                </p>
                {tabFilter === "active" && (
                  <Button
                    as="link"
                    href="/create-reel"
                    format="primary"
                    className="py-2 px-5 text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Create Your First Reel
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {displayedReels.map((reel) => {
                  const thumbnail = getThumbnailUrl(reel.video_url);
                  return (
                    <div
                      key={reel.id}
                      onClick={() => handleReelClick(reel)}
                      className="group relative h-[200px] sm:h-[250px] cursor-pointer overflow-hidden rounded-[0.625rem] border border-grey2 bg-grey1 hover:border-primary hover:shadow-md transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full h-full">
                        <Image
                          src={thumbnail}
                          alt={reel.title}
                          fill
                          sizes="(max-width: 640px) 150px, 200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        {/* Play overlay button */}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-9 h-9 bg-primary/95 text-white rounded-full flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {reel.status === "INACTIVE" && (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-warning text-white uppercase tracking-wider shadow">
                            Pending Approval
                          </span>
                        )}
                        {reel.status === "CANCELLED" && (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-danger text-white uppercase tracking-wider shadow">
                            Rejected
                          </span>
                        )}
                      </div>

                      {/* Action buttons (Delete) */}
                      <button
                        onClick={(e) => handleDeleteClick(e, reel)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {reel.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reel Viewer Modal */}
            {selectedReel && (
              <ReelViewerModal
                isOpen={true}
                onClose={() => setSelectedReel(null)}
                initialReelId={selectedReel.id}
                initialSellerId={reelsGrouped?.[0]?.user_id || ""}
                reelsGrouped={reelsGrouped || []}
              />
            )}

            {/* Delete Confirmation Modal */}
            <Modal isShown={showDeleteModal} setIsShown={setShowDeleteModal}>
              <Prompt
                type="error"
                title="Delete Reel"
                confirmText="Delete"
                confirmType="danger"
                description="Are you sure you want to delete this reel? This action is permanent and cannot be undone."
                confirmLoading={deleteLoading}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setReelToDelete(null);
                }}
              />
            </Modal>

            {/* Rejected Reel Reason Modal */}
            <Modal isShown={showRejectionReasonModal} setIsShown={setShowRejectionReasonModal}>
              <Prompt
                type="error"
                title="Reel Rejected"
                descriptionJSX={
                  <div className="text-left mt-2">
                    <p className="mb-3 text-sm text-grey7">
                      Your reel <strong>"{rejectedReelToShow?.title}"</strong> has been rejected by our administration team.
                    </p>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <strong className="text-xs text-red-700 block mb-1">Reason for Rejection:</strong>
                      <p className="text-xs text-red-600 font-medium italic">
                        "{rejectedReelToShow?.rejection_reason || (rejectedReelToShow as any)?.rejectionReason || "No reason specified."}"
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-grey5">
                      Please review our guidelines and create a new reel. You can also delete this reel from your shop.
                    </p>
                  </div>
                }
                buttonsJSX={
                  <div className="flex justify-end mt-6">
                    <Button
                      format="primary"
                      className="py-1.5 px-4 text-xs font-semibold rounded-lg shadow-sm"
                      onClick={() => {
                        setShowRejectionReasonModal(false);
                        setRejectedReelToShow(null);
                      }}
                    >
                      Ok
                    </Button>
                  </div>
                }
              />
            </Modal>
          </>
        );
      })()}
    </div>
  );
};
