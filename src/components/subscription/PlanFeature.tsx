import React from "react";

interface PlanFeatureProps {
  title: string;
  icon: React.ReactNode;
}
export const PlanFeature = (props: PlanFeatureProps) => {
  return (
    <div className={"flex gap-x-2 items-center"}>
      {props.icon}
      <span className={"text-xs sm:text-sm text-grey6"}>{props.title}</span>
    </div>
  );
};
