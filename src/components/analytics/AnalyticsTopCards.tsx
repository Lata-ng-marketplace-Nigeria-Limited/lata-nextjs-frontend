"use client";

import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  isTotalViews?: boolean;
  number: number | string;
  title: string;
  description: string;
  route?: string;
  isClickable?: boolean;
}
const AnalyticsTopCards = ({
  isTotalViews,
  number,
  title,
  description,
  route,
  isClickable,
}: Props) => {
  const { push } = useRouter();

  return (
    <div
      className={cn(
        {
          "border-0 bg-primary text-white shadow-none": isTotalViews,
          "cursor-pointer": isClickable,
        },
        "rounded-lg border border-solid border-grey2 px-6 pb-7 pt-[1.81rem] shadow-black/10",
      )}
      onClick={() => {
        if (!route) return;
        push(route as string);
      }}
    >
      <p
        className={cn(
          { "text-grey10": !isTotalViews },
          "mb-2 text-sm font-normal tablet:mb-4",
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          { "text-grey9": !isTotalViews },
          "mb-2 text-2xl font-semibold tablet:mb-4 tablet:text-xl",
        )}
      >
        {number || 0}
      </p>
      <p className={cn({ "text-grey7": !isTotalViews }, "text-xs font-normal")}>
        {description}
      </p>
    </div>
  );
};

export default AnalyticsTopCards;
