import React from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import HeaderText from "../atom/HeaderText";

interface Props {
  totalReceived: number;
  totalSent?: number;
}
const FeedbackHeader = (props: Props) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between xms:flex-row">
      <HeaderText title>Feedbacks</HeaderText>

      <div className="flex items-center gap-6">
        <BadgeWithCount
          variant="primary"
          text="received"
          isDefaultActive
          count={props?.totalReceived || 0}
          query="received"
        />
        <BadgeWithCount
          variant="primary"
          query="sent"
          text="sent"
          count={props?.totalSent || 0}
        />
      </div>
    </div>
  );
};

export default FeedbackHeader;
