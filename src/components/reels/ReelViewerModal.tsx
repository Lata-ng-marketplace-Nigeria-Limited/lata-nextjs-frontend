"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { GroupedReels, Reel, ReelUser } from "@/api/reels";
import { X, Volume2, VolumeX, ChevronUp, ChevronDown, Heart } from "lucide-react";
import { cn } from "@/utils";
import Button from "@atom/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialReelId: string;
  initialSellerId: string;
  reelsGrouped: GroupedReels[];
}

type ReelWithUser = Reel & { user: ReelUser; sellerId: string };

export const ReelViewerModal = ({
  isOpen,
  onClose,
  initialReelId,
  initialSellerId,
  reelsGrouped,
}: Props) => {
  const [reelQueue, setReelQueue] = useState<ReelWithUser[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);

  // 1. Build the reel sequence queue based on requirements
  useEffect(() => {
    if (!isOpen) return;

    // Find the initial seller
    const sellerGroup = reelsGrouped.find((g) => g.user_id === initialSellerId);
    if (!sellerGroup) return;

    const sellerReels = sellerGroup.reels.map((r) => ({
      ...r,
      user: sellerGroup.user,
      sellerId: sellerGroup.user_id,
    }));

    const clickedIdx = sellerReels.findIndex((r) => r.id === initialReelId);
    if (clickedIdx === -1) return;

    // First part: from clicked index to end of seller reels
    const firstPart = sellerReels.slice(clickedIdx);
    // Second part: before clicked index
    const secondPart = sellerReels.slice(0, clickedIdx);
    const sellerSequence = [...firstPart, ...secondPart];

    // Other sellers' reels
    const otherSellersSequence: ReelWithUser[] = [];
    reelsGrouped.forEach((group) => {
      if (group.user_id !== initialSellerId) {
        group.reels.forEach((r) => {
          otherSellersSequence.push({
            ...r,
            user: group.user,
            sellerId: group.user_id,
          });
        });
      }
    });

    const fullQueue = [...sellerSequence, ...otherSellersSequence];
    setReelQueue(fullQueue);
    setActiveIndex(0);
    setIsDescExpanded(false);
  }, [isOpen, initialReelId, initialSellerId, reelsGrouped]);

  // Handle active video playing and pausing
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.muted = isMuted;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Playback prevented:", error);
          });
        }
      } else {
        video.pause();
      }
    });
    setIsDescExpanded(false); // Reset description expansion on reel change
  }, [activeIndex, isMuted, reelQueue]);

  // Navigate to index with bounds check
  const navigateReel = useCallback((direction: "next" | "prev") => {
    if (reelQueue.length === 0) return;
    if (direction === "next") {
      if (activeIndex < reelQueue.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
    } else {
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }
  }, [activeIndex, reelQueue.length]);

  // 2. Wheel/Scroll interaction with lock to prevent fast-skipping
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollLocked) return;
    setScrollLocked(true);
    setTimeout(() => setScrollLocked(false), 800); // 800ms lock

    if (e.deltaY > 30) {
      navigateReel("next");
    } else if (e.deltaY < -30) {
      navigateReel("prev");
    }
  }, [scrollLocked, navigateReel]);

  // 3. Touch/Swipe interaction for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (diff > 50) {
      // Swiped up (next)
      navigateReel("next");
    } else if (diff < -50) {
      // Swiped down (prev)
      navigateReel("prev");
    }
    touchStartY.current = null;
  };

  // 4. Keyboard Arrow Key interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateReel("next");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateReel("prev");
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateReel, onClose]);

  if (!isOpen || reelQueue.length === 0) return null;

  const currentReel = reelQueue[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-0 md:p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Close Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Global Mute Button & Close Button */}
      <div className="absolute top-4 left-4 z-[1010] flex gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[1010] w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container */}
      <div
        className="relative w-full max-w-[1000px] h-full md:h-[90vh] bg-grey10 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-[1000] border border-white/5"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal itself
        onWheel={handleWheel}
      >
        {/* Left Column: Video Feed Section */}
        <div className="relative flex-1 bg-black flex items-center justify-center h-[70vh] md:h-full overflow-hidden">
          {/* Vertical scroll container for reels inside active queue */}
          <div
            className="w-full h-full relative transition-transform duration-500 ease-out"
            style={{ transform: `translateY(-${activeIndex * 100}%)` }}
          >
            {reelQueue.map((reel, idx) => (
              <div
                key={reel.id}
                className="w-full h-full flex items-center justify-center flex-shrink-0 absolute top-0 left-0"
                style={{ transform: `translateY(${idx * 100}%)` }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={reel.video_url}
                  className="w-full h-full object-contain"
                  loop
                  playsInline
                  autoPlay={idx === 0}
                  muted={isMuted}
                />
              </div>
            ))}
          </div>

          {/* Navigation Overlay Arrows (Desktop) */}
          <div className="hidden md:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => navigateReel("prev")}
              disabled={activeIndex === 0}
              className={cn(
                "w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10 disabled:opacity-40 disabled:pointer-events-none"
              )}
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateReel("next")}
              disabled={activeIndex === reelQueue.length - 1}
              className={cn(
                "w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10 disabled:opacity-40 disabled:pointer-events-none"
              )}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Overlay: Details on the video itself */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col md:hidden text-white z-10 select-none">
            {/* User Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={currentReel.user.avatar || "/images/avatar-placeholder.png"}
                  alt={currentReel.user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">{currentReel.user.name}</span>
                <span className="text-[10px] text-white/70">Seller</span>
              </div>
            </div>

            {/* Reel Title */}
            <h3 className="text-sm font-bold mb-1">{currentReel.title}</h3>

            {/* Description Text */}
            <div className="text-xs text-white/90 leading-relaxed max-h-[35vh] overflow-y-auto pr-1">
              <p
                className={cn("whitespace-pre-line text-xs text-white/90", {
                  "line-clamp-2": !isDescExpanded,
                  "line-clamp-none": isDescExpanded,
                })}
              >
                {currentReel.description}
              </p>
              {currentReel.description && currentReel.description.length > 80 && (
                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-[11px] font-bold text-purp3 hover:underline mt-1 block text-left"
                >
                  {isDescExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Pane (Desktop only, stacked on tablet/desktop) */}
        <div className="hidden md:flex w-[380px] h-full bg-white flex-col border-l border-grey2">
          {/* Seller profile header */}
          <div className="p-4 border-b border-grey2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-grey3">
                <Image
                  src={currentReel.user.avatar || "/images/avatar-placeholder.png"}
                  alt={currentReel.user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-grey9 text-sm">{currentReel.user.name}</span>
                <span className="text-xs text-grey6">Verified Seller</span>
              </div>
            </div>
            <Button
              as="link"
              href={`/seller-profile/${currentReel.sellerId}`}
              format="secondary"
              className="px-3 py-1.5 text-xs font-semibold rounded-md border-grey3"
            >
              View Shop
            </Button>
          </div>

          {/* Description & Interactive components */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Reel Title */}
              <h2 className="text-base font-bold text-grey10 mb-3">{currentReel.title}</h2>

              {/* Description box */}
              <div className="text-sm text-grey8 leading-relaxed mb-6">
                <div
                  className={cn("whitespace-pre-line text-grey8", {
                    "line-clamp-3": !isDescExpanded,
                    "line-clamp-none": isDescExpanded,
                  })}
                >
                  {currentReel.description || "No description provided."}
                </div>
                {currentReel.description && currentReel.description.length > 100 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-xs font-bold text-primary hover:underline mt-1.5 block"
                  >
                    {isDescExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action footer */}
            <div className="pt-4 border-t border-grey2 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-grey6">
                <span>Uploaded {new Date(currentReel.created_at).toLocaleDateString()}</span>
                {currentReel.status === "INACTIVE" && (
                  <span className="text-warning font-bold uppercase tracking-wider text-[10px]">
                    Pending Approval
                  </span>
                )}
              </div>
              <Button
                as="link"
                href={`/messages?userId=${currentReel.user.id}`}
                format="primary"
                className="w-full text-center py-2 text-sm font-semibold rounded-lg shadow-sm"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
