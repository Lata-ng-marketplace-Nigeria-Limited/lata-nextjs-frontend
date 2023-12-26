import { cn } from "@/utils";
import React, { Suspense } from "react";
import AnalyticsTopCardSkeleton from "../skeleton/AnalyticsTopCardSkeleton";

interface Props {
  className?: string;
  isTotalViews?: boolean;
  number: number | string;
  title: string;
  description: string;
}
const AnalyticsTopCards = ({
  className,
  isTotalViews,
  number,
  title,
  description,
}: Props) => {
  return (
    
    <div
      className={cn(
        { "border-0 bg-primary text-white shadow-none": isTotalViews },
        "px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2"
      )}
    >
      <p className="mb-4">{title}</p>
      <p className="mb-4 text-2xl">{number}</p>
      <p>{description}</p>
    </div>
  );
};

export default AnalyticsTopCards;
