import { getCustomerFeedback } from "@/api/feedback";
import React from "react";
import FeedbackHeader from "./FeedbackHeader";
import SellerFeedbackList from "./SellerFeedbackList";

interface Props {
  query: string;
  viewing: string;
}
const SellerFeedbackWrapper = async (props: Props) => {
  const feedbacks = await getCustomerFeedback(
    "PRODUCT",
    props.query,
    "10",
    props.viewing,
  );

  return (
    <div>
      <FeedbackHeader
        totalReceived={feedbacks?.totalReceived || 0}
        totalSent={feedbacks?.totalSent || 0}
        feedbackView={props?.viewing}
      />
      <SellerFeedbackList feedbacks={feedbacks?.data} meta={feedbacks?.meta} />
    </div>
  );
};

export default SellerFeedbackWrapper;
