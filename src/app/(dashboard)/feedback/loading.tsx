import React from "react";
import FeedbackHeaderSkeleton from "@/components/skeleton/FeedbackHeaderSkeleton";
import FeedbackContentSkeleton from "@/components/skeleton/FeedbackContentSkeleton";

export default function Loading() {
  return (
    <>
      <FeedbackHeaderSkeleton />
      <FeedbackContentSkeleton length={5} />
    </>
  );
}
