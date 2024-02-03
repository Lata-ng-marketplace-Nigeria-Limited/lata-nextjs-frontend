import React from "react";
import Button from "../atom/Button";
import { cn } from "@/utils";

interface Props {
  type: "positive" | "neutral" | "negative";
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}
const FeedbackButton = (props: Props) => {
  const feedbackType: Record<string, string> = {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
  };

  return (
    <Button
      format="none"
      className={cn(
        props.className,
        {
          "bg-success text-white hover:bg-success":
            props.type === "positive" && props.isActive,
          "border border-success text-success":
            props.type === "positive" && !props.isActive,
        },
        {
          "bg-warning text-white hover:bg-warning":
            props.type === "neutral" && props.isActive,
          "border border-warning text-warning":
            props.type === "neutral" && !props.isActive,
        },
        {
          "bg-danger text-white hover:bg-danger":
            props.type === "negative" && props.isActive,
          "border border-danger text-danger":
            props.type === "negative" && !props.isActive,
        },
        "mb-5 w-full",
      )}
      onClick={props.onClick}
    >
      {feedbackType[props.type]}
    </Button>
  );
};

export default FeedbackButton;
