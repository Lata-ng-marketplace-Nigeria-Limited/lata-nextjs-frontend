"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GroupedReels, Reel } from "@/api/reels";
import { ReelViewerModal } from "./ReelViewerModal";
import { Play } from "lucide-react";
import { getThumbnailUrl } from "@/utils";

interface Props {
  reelsGrouped: GroupedReels[];
}

export const ReelsRow = ({ reelsGrouped }: Props) => {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  const activeGroups = reelsGrouped
    .filter((group) => group.reels && group.reels.length > 0)
    .map((group) => ({
      ...group,
      reels: [...group.reels].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }));

  if (activeGroups.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-4 mb-6">
      {/* <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-5 bg-primary rounded-full"></div>
        <h2 className="text-sm font-semibold text-grey9 sm:text-lg sm:font-bold">
          Lata Reels
        </h2>
      </div> */}

      <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {activeGroups.map((group) => {
          const firstReel = group.reels[0];
          const thumbnail = getThumbnailUrl(firstReel.video_url);
          return (
            <div
              key={group.user_id}
              onClick={() => {
                setSelectedReel(firstReel);
                setSelectedSellerId(group.user_id);
              }}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer select-none group"
            >
              {/* Circular Card Container */}
              <div className="relative w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-full p-[2.5px] border-2 border-primary bg-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-grey1">
                  <Image
                    src={group.user.avatar || thumbnail}
                    alt={firstReel.title}
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
                {group.user.name}
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
          reelsGrouped={activeGroups}
        />
      )}
    </div>
  );
};
