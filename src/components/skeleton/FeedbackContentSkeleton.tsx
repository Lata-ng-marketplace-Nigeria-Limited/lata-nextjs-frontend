import React from "react";
import { cn } from "@/utils";
import FeedbackButton from "../feedback/FeedbackButton";

interface LoadingFeedbackContentProps {
  hideLink?: boolean;
}

const LoadingSkeleton: React.FC<LoadingFeedbackContentProps> = ({
  hideLink,
}) => {
  return (
    <div className="mb-4 rounded-xl border border-grey2 px-5 py-4 tablet:mb-6 tablet:px-10 tablet:py-6">
      <div className="mb-2 h-8 w-[5rem] animate-pulse rounded-lg bg-gray-300 tablet:mb-5"></div>
      <div className="mb-2 h-8 w-[10rem] animate-pulse bg-gray-300 tablet:mb-5"></div>
      <div className="h-4 w-[15rem] animate-pulse bg-gray-300"></div>
      {!hideLink && (
        <div
          className={cn(
            { hidden: hideLink },
            "animate-pulse text-sm font-semibold text-blue-700",
          )}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

interface Props {
  length?: number;
  hideLink?: boolean;
}

const FeedbackContentSkeleton = (props: Props) => {
  return (
    <>
      {Array.from({ length: props.length || 1 }, (_, index) => (
        <LoadingSkeleton key={index} hideLink={props.hideLink} />
      ))}
    </>
  );
};

export default FeedbackContentSkeleton;
