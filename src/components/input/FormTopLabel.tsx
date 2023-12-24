import { cn } from "@/utils";
import React from "react";

interface Props {
  label: string;
  labelClass?: string;
  wrapperClass?: string;
  childrenClass?: string;
  children: React.ReactNode;
}
export default function FormTopLabel(props: Props) {
  return (
    <div className={cn(`w-full`, props.wrapperClass)}>
      <p className={cn("text-xs text-grey8 mb-2", props.labelClass)}>
        {props.label}
      </p>
      <div className={cn(props.childrenClass)}>{props.children}</div>
    </div>
  );
}
