import React from "react";
import { cn } from "@/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: boolean;
}
export default function HeaderText(props: Props) {
  const classInfo = cn(
    `
      text-sm
      md:text-[1.1rem]
      text-grey10
      font-semibold
      md:font-medium
      mb-3
      md:mb-[0.25rem]
    `,
    {
      "m-0 md:m-0": props.title,
    },
    props.className,
  );
  return (
    <>
      {props.title ? (
        <h1 className={classInfo}>{props.children}</h1>
      ) : (
        <h3 className={classInfo}>{props.children}</h3>
      )}
    </>
  );
}
