"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { GroupedReels, Reel, ReelUser } from "@/api/reels";
import { Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/utils";
import Button from "@atom/Button";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

interface Props {
  reelsGrouped: GroupedReels[];
}

type ReelWithUser = Reel & { user: ReelUser; sellerId: string };

export const ReelsPagePlayer = ({ reelsGrouped }: Props) => {
  const { user } = useUser();
  const [reelQueue, setReelQueue] = useState<ReelWithUser[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 1. Flatten all reels from all sellers to build the playback queue
  useEffect(() => {
    const fullQueue: ReelWithUser[] = [];
    reelsGrouped.forEach((group) => {
      group.reels.forEach((r) => {
        fullQueue.push({
          ...r,
          user: group.user,
          sellerId: group.user_id,
        });
      });
    });

    // Sort by date to show newest first
    const sortedQueue = fullQueue.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setReelQueue(sortedQueue);
    setActiveIndex(0);
    setIsDescExpanded(false);

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [reelsGrouped]);

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

  // Scroll handler to detect active snapped video
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    if (height === 0) return;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reelQueue.length) {
      setActiveIndex(newIndex);
    }
  };

  // Programmatic scroll navigation
  const navigateReel = useCallback((direction: "next" | "prev") => {
    const container = containerRef.current;
    if (!container || reelQueue.length === 0) return;
    const height = container.clientHeight;
    if (height === 0) return;

    const targetIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;
    if (targetIndex >= 0 && targetIndex < reelQueue.length) {
      container.scrollTo({
        top: targetIndex * height,
        behavior: "smooth",
      });
    }
  }, [activeIndex, reelQueue.length]);

  // Keyboard Arrow Key interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateReel("next");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateReel("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateReel]);

  if (reelQueue.length === 0) {
    return (
      <div className="text-white text-sm font-semibold flex items-center justify-center h-full">
        No reels available to watch.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[450px] h-full sm:h-[95%] bg-black sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/5">
      {/* Global Mute Button (Fixed Overlay) */}
      <div className="absolute top-4 left-4 z-[1010] flex gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Create Reel Button (Fixed Overlay for Sellers) */}
      {user?.role === "SELLER" && (
        <div className="absolute top-4 right-4 z-[1010]">
          <Button
            as="link"
            href="/create-reel"
            format="primary"
            className="py-2 px-4 text-xs font-semibold rounded-full shadow-md bg-primary hover:bg-primary/95 text-white border border-white/10 flex items-center gap-1.5"
          >
            <span>+ Create Reel</span>
          </Button>
        </div>
      )}

      {/* Scrollable Container with native CSS scroll snapping */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-none"
      >
        {reelQueue.map((reel, idx) => (
          <div
            key={reel.id}
            className="w-full h-full flex-shrink-0 snap-start snap-always relative flex items-center justify-center bg-black"
          >
            {/* Video Player */}
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

            {/* Details Overlay (scoped to each reel video panel) */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col text-white z-10 select-none">
              {/* User Header */}
              <Link
                href={`/seller-profile/${reel.sellerId}`}
                className="flex items-center gap-2 mb-3 hover:underline group cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:opacity-80 transition-opacity">
                  <Image
                    src={reel.user.avatar || "/images/avatar-placeholder.png"}
                    alt={reel.user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{reel.user.name}</span>
                  <span className="text-[10px] text-white/70">Seller</span>
                </div>
              </Link>

              {/* Reel Title */}
              <h3 className="text-sm font-bold mb-1.5">{reel.title}</h3>

              {/* Description Text */}
              <div className="desc-scroll-box text-xs text-white/90 leading-relaxed max-h-[30vh] overflow-y-auto pr-1 scrollbar-none">
                <p
                  className={cn("whitespace-pre-line text-xs text-white/90", {
                    "line-clamp-2": !isDescExpanded || activeIndex !== idx,
                    "line-clamp-none": isDescExpanded && activeIndex === idx,
                  })}
                >
                  {reel.description}
                </p>
                {reel.description && reel.description.length > 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescExpanded(!isDescExpanded);
                    }}
                    className="text-[11px] font-bold text-purp3 hover:underline mt-1 block text-left"
                  >
                    {isDescExpanded && activeIndex === idx ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Upload details / Status badge */}
              <div className="flex items-center justify-between text-[9px] text-white/60 mt-3 pt-2 border-t border-white/5">
                <span>Uploaded {new Date(reel.created_at).toLocaleDateString()}</span>
                {reel.status === "INACTIVE" && (
                  <span className="text-warning font-bold uppercase tracking-wider text-[8px]">
                    Pending Approval
                  </span>
                )}
                {reel.status === "CANCELLED" && (
                  <span className="text-danger font-bold uppercase tracking-wider text-[8px]">
                    Rejected
                  </span>
                )}
              </div>

              {/* Custom Rejection Reason Banner */}
              {reel.status === "CANCELLED" && (reel.rejection_reason || (reel as any).rejectionReason) && (
                <div className="mt-2.5 p-2 bg-red-950/80 border border-red-500/40 rounded text-red-200 text-[10px] leading-relaxed">
                  <strong className="text-red-400 block mb-0.5">Rejection Reason:</strong>
                  "{reel.rejection_reason || (reel as any).rejectionReason}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Overlay Arrows (Desktop only, Fixed on container) */}
      <div className="hidden md:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2 z-[1010]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateReel("prev");
          }}
          disabled={activeIndex === 0}
          className={cn(
            "w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10 disabled:opacity-40 disabled:pointer-events-none"
          )}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateReel("next");
          }}
          disabled={activeIndex === reelQueue.length - 1}
          className={cn(
            "w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10 disabled:opacity-40 disabled:pointer-events-none"
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
