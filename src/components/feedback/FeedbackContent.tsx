"use client";

import React from "react";
import FeedbackButton from "./FeedbackButton";
import { IFeedback } from "@/interface/feedback";
import Link from "next/link";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";
import { cn } from "@/utils";
import Image from "next/image";
import DeleteIcon from "../atom/icons/Delete";

interface Props {
  feedback?: IFeedback;
  hideLink?: boolean;
}

const FeedbackContent = (props: Props) => {
  const feedbackRating = {
    1: "negative" as const,
    2: "neutral" as const,
    3: "positive" as const,
  };

  return (
    <div className="mb-4 rounded-xl border border-grey2 px-5 py-4 tablet:mb-6 tablet:px-10 tablet:py-6">
      <div className="flex justify-between">
        <FeedbackButton
          isActive
          type={feedbackRating[props.feedback?.rating || 2]}
          className="pointer-events-none !mb-2 !max-w-max tablet:!mb-5"
        />
        <DeleteIcon />
      </div>

      <h2 className="mb-2 text-base font-semibold text-grey9 tablet:mb-5 tablet:text-xl">
        {props?.feedback?.sender || "Anonymous"}
      </h2>
      <p className="text-sm font-normal text-grey7">
        {props.feedback?.description || "No description"}
      </p>
      <Link
        href={`${DASHBOARD_PRODUCT_ROUTE}/${props?.feedback?.product?.id}`}
        className={cn(
          { hidden: props?.hideLink },
          "text-sm font-semibold text-blue-700",
        )}
      >
        View product
      </Link>
    </div>
  );
};

export default FeedbackContent;
