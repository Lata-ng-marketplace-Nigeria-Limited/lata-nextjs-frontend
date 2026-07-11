"use client";

import React from "react";
import { cn } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  activeTab: string;
}

export default function AdminHomeTabs({ activeTab }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: "posts" | "reels") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", tab);
    params.set("page", "1");
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-6 border-b border-grey2 pb-2 mb-6">
      <button
        onClick={() => handleTabChange("posts")}
        className={cn(
          "pb-2 text-sm font-semibold border-b-2 transition-all text-xs sm:text-sm",
          activeTab === "posts"
            ? "border-primary text-primary"
            : "border-transparent text-grey6 hover:text-grey8"
        )}
      >
        Posts
      </button>
      <button
        onClick={() => handleTabChange("reels")}
        className={cn(
          "pb-2 text-sm font-semibold border-b-2 transition-all text-xs sm:text-sm",
          activeTab === "reels"
            ? "border-primary text-primary"
            : "border-transparent text-grey6 hover:text-grey8"
        )}
      >
        Reels
      </button>
    </div>
  );
}
