"use client";
import React from "react";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import { BigMessageIcon } from "@atom/icons/BigMessage";

interface EmptyMessagesProps {
  children?: React.ReactNode;
  hasChat: boolean;
}

export default function EmptyMessages(props: EmptyMessagesProps) {
  return (
    <MobileBorderArea removeBorder={props.hasChat} removePadding>
      <div
        className={cn(
          "h-full min-h-[calc(100vh-50px-200px)]  md:min-h-[calc(100vh-60px-200px)]",
          {
            "grid place-items-center": !props.hasChat,
          },
        )}
      >
        {!props.hasChat ? (
          <div
            className={
              " flex flex-col justify-center items-center h-full gap-y-6"
            }
          >
            <BigMessageIcon
              className={"w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"}
            />
            <p
              className={
                "text-sm leading-tight tracking-tight sm:text-base sm:font-medium text-grey9"
              }
            >
              You have no messages yet
            </p>
          </div>
        ) : (
          <>{props.children}</>
        )}
      </div>
    </MobileBorderArea>
  );
}
