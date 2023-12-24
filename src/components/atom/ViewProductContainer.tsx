import { cn } from "@/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export default function ViewProductContainer(props: Props) {
  return (
    <div
      className={cn(
        `
        flex 
        flex-col 
        justify-between 
        sm:flex-row 
        gap-y-6 
        gap-x-3 
        xl:gap-x-[19px]
        `,
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
