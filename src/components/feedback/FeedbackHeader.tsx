"use client";

import React from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  totalReceived: number;
  totalSent?: number;
  feedbackView: string;
}
const FeedbackHeader = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  const setActiveView = (view: string) => {
    params.set("viewing", view);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const getActiveView = (feedbackView: "received" | "sent") => {
    if (!params.get("viewing")) {
      params.set("viewing", "received");
    }
    if (params.get("viewing") !== feedbackView) return;
    return "primary";
  };

  return (
    <div className="mb-6 flex items-start justify-between">
      <h2 className="text-xl font-medium text-grey9">Feedback</h2>
      <div className="flex items-center gap-6">
        <BadgeWithCount
          variant="primary"
          text="received"
          count={props?.totalReceived || 0}
          activeVariant={getActiveView("received")}
          onClick={() => setActiveView("received")}
        />
        <BadgeWithCount
          variant="primary"
          activeVariant={getActiveView("sent")}
          text="sent"
          count={props?.totalSent || 0}
          onClick={() => setActiveView("sent")}
        />
      </div>
    </div>
  );
};

export default FeedbackHeader;
