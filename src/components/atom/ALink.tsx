import { cn } from "@/utils";
import React from "react";
import Link from "next/link";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function ALink(props: Props) {
  return (
    <Link
      {...props}
      className={cn(`text-primary text-xs sm:text-sm`, props.className)}
    >
      {props.children}
    </Link>
  );
}
