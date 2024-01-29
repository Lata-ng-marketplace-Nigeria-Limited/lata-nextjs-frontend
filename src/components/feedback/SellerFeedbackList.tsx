"use client";

import { IFeedback } from "@/interface/feedback";
import { FetchMeta } from "@/interface/general";
import React from "react";
import FeedbackContent from "./FeedbackContent";
import Paginate from "../input/Paginate";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  feedbacks: IFeedback[];
  meta: FetchMeta;
}
const SellerFeedbackList = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (toPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", toPage + "");
    params.set("limit", "10" + "");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {props.feedbacks.map((feedback) => (
        <FeedbackContent feedback={feedback} key={feedback.id} />
      ))}

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
