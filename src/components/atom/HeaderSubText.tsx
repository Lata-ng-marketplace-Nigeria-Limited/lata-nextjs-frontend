import React from "react";
import { cn } from "@/utils";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function HeaderSubText(props: Props) {
  return (
    <p
      className={cn(
        `
        text-xs
        md:text-sm
        text-grey6
        mt-2
        sm:mt-4
        empty:hidden
      `,
        props.className,
      )}
    >
      {props.children}
    </p>
  );
}
