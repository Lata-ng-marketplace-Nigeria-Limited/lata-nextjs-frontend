import EmptyFeedback from "@/components/feedback/EmptyFeedback";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import SellerFeedbackList from "@/components/feedback/SellerFeedbackList";
import SellerFeedbackWrapper from "@/components/feedback/SellerFeedbackWrapper";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Feedback",
};

const Page = ({
  searchParams,
}: {
  searchParams?: {
    query: string;
    viewing: string;
  };
}) => {
  const query = searchParams?.query || "";
  const viewing = searchParams?.viewing || "";

  return <SellerFeedbackWrapper query={query} viewing={viewing} />;
};

export default Page;
