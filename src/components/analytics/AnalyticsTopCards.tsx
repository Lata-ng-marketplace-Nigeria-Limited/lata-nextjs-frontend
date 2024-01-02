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
        "px-6 pb-7 pt-[1.81rem] rounded-lg border-solid shadow-black/10 border border-grey2"
      )}
    >
      <p className="tablet:mb-4 mb-2 text-sm font-normal">{title}</p>
      <p className="tablet:mb-4 mb-2 font-semibold text-2xl tablet:text-xl">{number}</p>
      <p className="text-xs font-normal">{description}</p>
    </div>
  );
};

export default AnalyticsTopCards;
