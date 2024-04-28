import React from "react";
import { cn } from "@/utils";

interface Props {
  type: "success" | "danger" | "warning" | "info";
  className?: string;
  children: React.ReactNode;
}

export default function Alert(props: Props) {
  return (
    <div
      className={cn(
        `
          rounded-md 
          px-4 
          py-1 
          text-xs
          empty:hidden
          sm:text-sm`,
        {
          "bg-danger text-white": props.type === "danger",
          "bg-success text-white": props.type === "success",
          "bg-warning text-white": props.type === "warning",
          "bg-blue-800 text-white": props.type === "info",
        },
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
