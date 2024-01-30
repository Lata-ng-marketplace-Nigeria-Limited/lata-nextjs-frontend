import { GetUser } from "@/components/atom/GetUser";
import SellerFeedbackWrapper from "@/components/feedback/SellerFeedbackWrapper";
import { Metadata } from "next";
import React, { Suspense } from "react";

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

  return (
    <>
      <Suspense>
        <GetUser />
      </Suspense>
      <SellerFeedbackWrapper query={query} viewing={viewing} />{" "}
    </>
  );
};

export default Page;
