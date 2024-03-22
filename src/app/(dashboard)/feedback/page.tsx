import { getAllSellerFeedbacks } from "@/api/feedback";
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
    page: string;
    tab: string;
  };
}) => {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const page = searchParams?.page || "";
  const tab = searchParams?.tab || "";

  const feedbacks = await getAllSellerFeedbacks("PRODUCT", page, tab);

  return (
    <>
      <Suspense>
        <GetUser />
      </Suspense>

      <FeedbackHeader
        totalReceived={feedbacks?.totalReceived || 0}
        totalSent={feedbacks?.totalSent || 0}
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
