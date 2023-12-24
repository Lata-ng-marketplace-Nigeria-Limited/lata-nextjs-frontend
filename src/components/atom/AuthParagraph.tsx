import { cn } from "@/utils";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export default function AuthParagraph(props: Props) {
  return (
    <p className={cn("text-xs text-grey6 sm:text-sm sm:w-full", props.className)}>
      {props.children}
    </p>
  );
}
