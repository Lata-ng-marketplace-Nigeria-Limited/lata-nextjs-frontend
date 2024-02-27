import { cn } from "@/utils";
import React from "react";

interface Props {
  clicksCount: number | string;
  title: string;
  description: string;
  titleClassName?: string
}

const AnalyticsSideCard = (props: Props) => {
  return (
    <div className="px-6 py-3 rounded-xl border-solid border border-grey2">
      <p className={cn("text-grey6 mb-3 font-medium text-base", props.titleClassName)}>
        {props.title}
      </p>
      <p className="mb-3 font-semibold text-xl">{props.clicksCount}</p>
      <p className="text-grey6 font-normal text-sm tablet:text-base">{props.description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
