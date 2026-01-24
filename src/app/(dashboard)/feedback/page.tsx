import { IFeedbackQuery, getAllSellerFeedbacks } from "@/api/feedback";
import { GetUser } from "@/components/atom/GetUser";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import SellerFeedbackList from "@/components/feedback/SellerFeedbackList";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Feedback",
};

interface ISearchParams extends IFeedbackQuery { }

const Page = async (props: { searchParams: Promise<ISearchParams> }) => {
  const searchParams = await props.searchParams;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const queries: ISearchParams = {
    page: searchParams?.page || "",
    tab: searchParams?.tab || "received",
    uid: searchParams?.uid || "",
    sessionSwitch: searchParams?.sessionSwitch || "",
    role: searchParams?.role || "",
    type: "PRODUCT",
  };

  const feedbacks = await getAllSellerFeedbacks(queries);

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
