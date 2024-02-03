"use client";

import { IFeedback } from "@/interface/feedback";
import { FetchMeta } from "@/interface/general";
import React from "react";
import FeedbackContent from "./FeedbackContent";
import Paginate from "../input/Paginate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyFeedback from "./EmptyFeedback";
import FeedbackContentSkeleton from "../skeleton/FeedbackContentSkeleton";

interface Props {
  feedbacks?: IFeedback[];
  meta: FetchMeta;
  isEmpty?: boolean;
}
const SellerFeedbackList = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);

  const handlePageChange = (toPage: number) => {
    params.set("page", toPage + "");
    params.set("limit", "10" + "");
    replace(`${pathname}?${params.toString()}`);
  };

  const showFeedback = () => {
    if (props?.isEmpty) {
      return <EmptyFeedback param={params.get("viewing") || ""} />;
    }

    if (props?.feedbacks) {
      return props.feedbacks.map((feedback) => (
        <FeedbackContent feedback={feedback} key={feedback.id} />
      ));
    } else {
      <FeedbackContentSkeleton hideLink />;
    }
  };

  return (
    <>
      {showFeedback()}
      {props.meta?.last_page > 1 ? (
        <>
          <div className={"mt-4"} />
          <Paginate
            meta={props.meta}
            onPageChange={handlePageChange}
            currentPage={Number(searchParams.get("page"))}
          />
        </>
      ) : null}
    </>
  );
};

export default SellerFeedbackList;
