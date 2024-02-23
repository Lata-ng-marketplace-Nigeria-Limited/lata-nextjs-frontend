import { cn } from "@/utils";
import React from "react";

interface Props {
  title: string;
  description: string;
  titleClass?: string;
  descriptionClass?: string;
  hasGreyTitle?: boolean;
  hasGreyDescription?: boolean;
}

export const UserDetail = (props: Props) => {
  return (
    <div className="mb-6">
      <h2
        className={cn(
          {
            "mb-4 text-sm font-normal text-grey6": props.hasGreyTitle,
            "mb-3 text-base font-medium text-grey10": !props.hasGreyTitle,
          },
          props.titleClass,
        )}
      >
        {props.title}
      </h2>
      <p
        className={cn({
          "text-sm font-semibold": !props.hasGreyDescription,
          "font-normal text-grey6": props.hasGreyDescription,
        })}
      >
        {props.description}
      </p>
    </div>
  );
};

interface IContanerProps {
  heading: string;
  children: React.ReactNode;
}
export const UserDetailContainer = (props: IContanerProps) => {
  return (
    <div className="mb-6 rounded-xl border border-grey2 p-6">
      <h2 className={cn("mb-6 text-xl font-semibold")}>{props.heading}</h2>
      {props.children}
    </div>
  );
};
