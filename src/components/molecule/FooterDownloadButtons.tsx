"use client";

import React from "react";
import { PlayStoreIcon } from "@/components/atom/icons/PlayStoreIcon";
import { AppleStoreIcon } from "@/components/atom/icons/AppleStore";
import { toast } from "@components/ui/use-toast";
import { PLAY_STORE_URL } from "@/store/data/footer";

export default function FooterDownloadButtons() {
  const handleAppleStoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Coming Soon",
      description: "Lata will be available on the App Store soon",
      variant: "info",
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
        <PlayStoreIcon className="cursor-pointer" />
      </a>
      <button
        type="button"
        onClick={handleAppleStoreClick}
        className="text-left outline-none cursor-pointer border-none bg-transparent p-0"
      >
        <AppleStoreIcon className="cursor-pointer" />
      </button>
    </div>
  );
}
