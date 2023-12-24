import React from "react";
import { cn } from "@/utils";
import RollerSpinner from "@molecule/RollerSpinner";
import AuthParagraph from "@atom/AuthParagraph";

interface PageSuspenseProps {
  children?: React.ReactNode;
  loadingText?: string;
  isNotLoading?: boolean;
  useCenterStyle?: boolean;
}

export default function PageSuspense(props: PageSuspenseProps) {
  return (
    <div
      className={cn({
        "min-h-screen w-full flex justify-center items-center flex-col relative":
          props.useCenterStyle || !props.isNotLoading,
      })}
    >
      {props.isNotLoading ? (
        <>{props.children}</>
      ) : (
        <div className={"flex flex-col justify-center items-center"}>
          <RollerSpinner />
          <AuthParagraph className={"empty:hidden text-center mt-4 text-grey9"}>
            {props.loadingText}
          </AuthParagraph>
        </div>
      )}
    </div>
  );
}
