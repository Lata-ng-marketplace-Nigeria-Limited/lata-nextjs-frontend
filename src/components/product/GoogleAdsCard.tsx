"use client";

import React from "react";
import GoogleAdsUnit from "@/app/external-services/GoogleAdsUnit";
import { cn } from "@/utils";

const GoogleAdsCard = () => {
    return (
        <div
            className={cn(
                `
        mx-auto
        w-full
        max-w-[17rem]
        shrink-0
        rounded-[0.625rem]
        border
        border-grey3
        p-2
        xms:mx-0
        sm:px-2.5
        sm:py-3
        flex
        items-center
        justify-center
        bg-white
        self-start
        lg:hidden
      `
            )}
        >
            <div className="w-full max-sm:min-h-[200px] sm:h-[280px] flex flex-col items-center justify-center overflow-hidden">
                <GoogleAdsUnit />
                <p className="text-[10px] text-grey5 mt-2">Sponsored</p>
            </div>
        </div>

    );
};

export default GoogleAdsCard;
