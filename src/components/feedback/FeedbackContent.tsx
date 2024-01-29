import React from "react";
import FeedbackButton from "./FeedbackButton";
import { IFeedback } from "@/interface/feedback";

interface Props {
  feedback?: IFeedback;
}

const FeedbackContent = (props: Props) => {
  const feedbackRating = {
    1: "negative" as const,
    2: "neutral" as const,
    3: "positive" as const,
  };

  console.log(JSON.parse(props?.feedback?.meta || "{}").sender);

  return (
    <div className="mb-6 rounded-xl border border-grey2 px-10 py-6">
      <FeedbackButton
        isActive
        type={feedbackRating[props.feedback?.rating || 2]}
        className="pointer-events-none max-w-max"
      />
      <h2 className="mb-5 text-xl font-semibold text-grey9">
        {JSON.parse(props?.feedback?.meta || "{}")?.sender || 'Anonymous'}
      </h2>
      <p className="text-sm font-normal text-grey7">
        {props.feedback?.description || "No description"}
      </p>
    </div>
  );
};

export default FeedbackContent;
