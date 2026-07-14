"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { GroupedReels, Reel, ReelUser } from "@/api/reels";
import { X, Volume2, VolumeX, ChevronUp, ChevronDown, Share2, Loader, Play, Pause } from "lucide-react";
import { cn } from "@/utils";
import Button from "@atom/Button";
import Link from "next/link";
import { useToast } from "@components/ui/use-toast";
import { getThumbnailUrl, getOptimizedVideoUrl } from "@/utils";

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
  const [isMuted, setIsMuted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { toast } = useToast();

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    
    if (currentVideo.paused) {
      currentVideo.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play failed:", err));
    } else {
      currentVideo.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const index = videoRefs.current.indexOf(video);
    if (index === activeIndex) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const index = videoRefs.current.indexOf(video);
    if (index === activeIndex) {
      setDuration(video.duration);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleShare = () => {
    if (reelQueue.length === 0 || !reelQueue[activeIndex]) return;
    const activeReelId = reelQueue[activeIndex].id;
    const shareUrl = `${window.location.origin}/reels?id=${activeReelId}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link Copied!",
            description: "Reel link has been copied to your clipboard.",
            variant: "success",
            className: "mt-16 sm:mt-0",
          });
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
          toast({
            title: "Copy Failed",
            description: "Please copy the URL from your browser address bar.",
            variant: "destructive",
            className: "mt-16 sm:mt-0",
          });
        });
    } else {
      toast({
        title: "Copy Link",
        description: `Copy this link: ${shareUrl}`,
        variant: "info",
        className: "mt-16 sm:mt-0",
      });
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

    // Reset container scroll position when opening a new queue
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isOpen, initialReelId, initialSellerId, reelsGrouped]);

  // Handle active video playing and pausing
  useEffect(() => {
    let activeVideo: HTMLVideoElement | null = null;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.muted = isMuted;
        video.currentTime = 0;
        activeVideo = video;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.log("Playback prevented:", error);
              setIsPlaying(false);
            });
        }
      } else {
        video.pause();
      }
    });

    if (activeVideo) {
      setCurrentTime(0);
      setDuration((activeVideo as HTMLVideoElement).duration || 0);
    } else {
      setCurrentTime(0);
      setDuration(0);
    }

    setIsDescExpanded(false); // Reset description expansion on reel change
  }, [activeIndex, isMuted, reelQueue]);

  // Scroll handler to detect which video is currently snapped into view
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    if (height === 0) return;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reelQueue.length) {
      setActiveIndex(newIndex);
    }
  };

  // Programmatic scroll navigation for arrows/keyboard events
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
      className="fixed inset-0 z-[999] bg-black flex items-center justify-center p-0 select-none"
      onClick={onClose}
    >
      {/* Background Close Click */}
      <div className="absolute inset-0 cursor-default" />

      {/* Global Mute & Share Buttons (Fixed Overlay) */}
      <div className="absolute top-4 left-4 z-[1010] flex gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
          title="Share Reel"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-[1010] w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all border border-white/10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Cinematic Video Container */}
      <div
        className="relative w-full h-full bg-black flex flex-col z-[1000]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal itself
      >
        {/* Scrollable Container with native CSS scroll snapping */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-none"
        >
          {reelQueue.map((reel, idx) => {
            const isVisible = idx >= activeIndex - 1 && idx <= activeIndex + 1;
            const thumbnail = getThumbnailUrl(reel.video_url);
            const optimizedVideoUrl = getOptimizedVideoUrl(reel.video_url);

            return (
              <div
                key={reel.id}
                onClick={handlePlayPause}
                className="w-full h-full flex-shrink-0 snap-start snap-always relative flex items-center justify-center bg-black cursor-pointer"
              >
                {/* Video Player */}
                {isVisible ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={optimizedVideoUrl}
                    className="w-full h-full object-contain"
                    loop
                    playsInline
                    autoPlay={idx === activeIndex}
                    muted={isMuted}
                    preload={idx === activeIndex ? "auto" : idx === activeIndex + 1 ? "metadata" : "none"}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  />
                ) : (
                  /* Poster fallback image for non-loaded videos */
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <Image
                      src={thumbnail}
                      alt={reel.title}
                      fill
                      className="object-cover opacity-60 filter blur-sm"
                      unoptimized
                    />
                    <div className="absolute animate-pulse text-white/40 flex flex-col items-center gap-2">
                      <Loader className="w-6 h-6 animate-spin" />
                    </div>
                  </div>
                )}

                {/* Play Icon overlay */}
                {!isPlaying && activeIndex === idx && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Video Progress Bar */}
                {activeIndex === idx && duration > 0 && (
                  <div 
                    className="absolute bottom-0 inset-x-0 h-1 bg-white/20 cursor-pointer z-20 group hover:h-2 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const width = rect.width;
                      const newTime = (clickX / width) * duration;
                      const activeVideo = videoRefs.current[activeIndex];
                      if (activeVideo) {
                        activeVideo.currentTime = newTime;
                        setCurrentTime(newTime);
                      }
                    }}
                  >
                    <div 
                      className="h-full bg-primary transition-all duration-75 relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}

              {/* Details Overlay (scoped to each reel video panel) */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col text-white z-10 select-none">
                {/* User Header */}
                <Link
                  href={`/seller-profile/${reel.sellerId}`}
                  className="flex items-center gap-2 mb-3 hover:underline group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/70">Seller</span>
                      {activeIndex === idx && duration > 0 && (
                        <span className="text-[10px] text-white/60 bg-white/10 px-1 rounded font-mono">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      )}
                    </div>
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
        );
      })}
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
    </div>
  );
};
