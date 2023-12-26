import { cn } from "@/utils";
import React from "react";

interface Props {
  isTotalViews?: boolean;
  number: number | string;
  title: string;
  description: string;
}
const AnalyticsTopCards = ({
  isTotalViews,
  number,
  title,
  description,
}: Props) => {
  return (
    <div
      className={cn(
        { "border-0 bg-primary text-white shadow-none": isTotalViews },
        "px-2 tablet:px-6 tablet:pb-[1.12rem] pb-[0.85rem] tablet:pt-[1.81rem] pt-[1.5rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2"
      )}
    >
      <p className="tablet:mb-4 mb-2 text-sm tablet:text-base">{title}</p>
      <p className="tablet:mb-4 mb-2 tablet:text-2xl text-xl">{number}</p>
      <p className="text-sm tablet:text-base">{description}</p>
    </div>
  );
};

export default AnalyticsTopCards;
