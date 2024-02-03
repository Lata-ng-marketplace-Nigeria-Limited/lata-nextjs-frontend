import { getAllCustomerFeedback } from "@/api/feedback";
import { GetUser } from "@/components/atom/GetUser";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import SellerFeedbackList from "@/components/feedback/SellerFeedbackList";
import { authConfig } from "@authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Feedback",
};

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    query: string;
    viewing: string;
  };
}) => {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const query = searchParams?.query || "";
  const viewing = searchParams?.viewing || "";

  const feedbacks = await getAllCustomerFeedback("PRODUCT", query, viewing);

  return (
    <>
      <Suspense>
        <GetUser />
      </Suspense>

      <FeedbackHeader
        totalReceived={feedbacks?.totalReceived || 0}
        totalSent={feedbacks?.totalSent || 0}
        feedbackView={viewing}
      />

      <SellerFeedbackList
        feedbacks={feedbacks?.data}
        meta={feedbacks?.meta}
        isEmpty={feedbacks.isEmpty}
      />
    </>
  );
};

export default Page;
