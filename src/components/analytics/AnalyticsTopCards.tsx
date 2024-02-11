import { cn } from "@/utils";
import React from "react";

interface Props {
  isTotalViews?: boolean;
  number: number | string;
  title: string;
  description: string;
  onClick?: () => void;
  isClickable?: boolean;
}
const AnalyticsTopCards = ({
  isTotalViews,
  number,
  title,
  description,
  onClick,
  isClickable,
}: Props) => {
  return (
    <div
      className={cn(
        {
          "border-0 bg-primary text-white shadow-none": isTotalViews,
          "cursor-pointer": isClickable,
        },
        "rounded-lg border border-solid border-grey2 px-6 pb-7 pt-[1.81rem] shadow-black/10",
      )}
      onClick={onClick}
    >
      <p className="mb-2 text-sm font-normal tablet:mb-4">{title}</p>
      <p className="mb-2 text-2xl font-semibold tablet:mb-4 tablet:text-xl">
        {number || 0}
      </p>
      <p className="text-xs font-normal">{description}</p>
    </div>
  );
};

export default AnalyticsTopCards;
