"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GroupedReels, Reel } from "@/api/reels";
import { ReelViewerModal } from "./ReelViewerModal";
import { Play } from "lucide-react";

interface Props {
  reelsGrouped: GroupedReels[];
}

export const ReelsRow = ({ reelsGrouped }: Props) => {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Flatten reels to display them in a continuous row, keeping track of their user/seller info
  const allReels = reelsGrouped.flatMap((group) =>
    group.reels.map((reel) => ({
      ...reel,
      user: group.user,
      sellerId: group.user_id,
    }))
  );

  if (allReels.length === 0) {
    return null;
  }

  // Cloudinary helper to get first frame poster image
  const getThumbnailUrl = (videoUrl: string) => {
    if (videoUrl.includes("cloudinary.com")) {
      return videoUrl
        .replace("/video/upload/", "/video/upload/so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
    }
    return "/images/video-placeholder.jpg"; // Fallback image if not Cloudinary
  };

  return (
    <div className="w-full mt-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-5 bg-primary rounded-full"></div>
        <h2 className="text-sm font-semibold text-grey9 sm:text-lg sm:font-bold">
          Lata Reels
        </h2>
      </div>

      <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {allReels.map((reel) => {
          const thumbnail = getThumbnailUrl(reel.video_url);
          return (
            <div
              key={reel.id}
              onClick={() => {
                setSelectedReel(reel);
                setSelectedSellerId(reel.sellerId);
              }}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer select-none group"
            >
              {/* Circular Card Container */}
              <div className="relative w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-full p-[2.5px] border-2 border-primary bg-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-grey1">
                  <Image
                    src={reel.user.avatar || thumbnail}
                    alt={reel.title}
                    fill
                    sizes="(max-width: 640px) 70px, 85px"
                    className="object-cover"
                    unoptimized
                  />
                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
              </div>

              {/* Seller Name text label */}
              <span className="text-[11px] sm:text-xs font-semibold text-grey9 mt-1.5 text-center truncate max-w-[75px] sm:max-w-[90px] leading-tight">
                {reel.user.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Reel Viewer Modal */}
      {selectedReel && selectedSellerId && (
        <ReelViewerModal
          isOpen={true}
          onClose={() => {
            setSelectedReel(null);
            setSelectedSellerId(null);
          }}
          initialReelId={selectedReel.id}
          initialSellerId={selectedSellerId}
          reelsGrouped={reelsGrouped}
        />
      )}
    </div>
  );
};
