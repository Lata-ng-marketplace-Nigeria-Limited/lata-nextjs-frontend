import React from "react";
import HeaderText from "../atom/HeaderText";

const FeedbackHeaderSkeleton = () => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between xms:flex-row">
      <HeaderText title>Feedbacks</HeaderText>
      <div className="flex items-center gap-6">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-300"></div>
        <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-300"></div>
      </div>
    </div>
  );
};

export default FeedbackHeaderSkeleton;
