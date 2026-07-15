"use client";

import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  clicksCount: number | string;
  title: string;
  description: string;
  titleClassName?: string;
  isMoney?: boolean;
  route?: string;
  isClickable?: boolean;
}

const AnalyticsSideCard = (props: Props) => {
  const { push } = useRouter();

  return (
    <div
      className={cn(
        "px-6 py-3 rounded-xl border border-solid border-grey2 transition-all",
        {
          "cursor-pointer hover:border-primary/40 hover:bg-grey1/30": props.isClickable,
        }
      )}
      onClick={() => {
        if (props.isClickable && props.route) {
          push(props.route);
        }
      }}
    >
      <p className={cn("text-grey6 mb-3 font-medium text-base", props.titleClassName)}>
        {props.title}
      </p>
      <p className="mb-3 font-semibold text-xl">{props.isMoney ? "₦" : ""}{props.clicksCount || 0}</p>
      <p className="text-grey6 font-normal text-sm tablet:text-base">{props.description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
