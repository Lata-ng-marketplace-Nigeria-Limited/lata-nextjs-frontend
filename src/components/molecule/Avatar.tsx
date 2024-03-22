"use client";

import { useEffect, useState } from "react";
import { cn, generateColor, makeInitials } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface Props {
  src?: string;
  name?: string;
  type?: "user" | "message";
  className?: string;
  initialsClass?: string;
  imageClass?: string;
}

export default function AppAvatar(props: Props) {
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    if (!props.name) return;
    const init = makeInitials(props.name || "");
    const { text, background } = generateColor(init);
    setTextColor(text);
    setBackgroundColor(background);
    setInitials(init);
  }, [props.name]);

  return (
    <Avatar
      className={cn(
        `
        inline-flex
        shrink-0
        select-none
        items-center
        justify-center
        rounded-full
        bg-neutral-100
      `,
        {
          "h-[40px] w-[40px] lg:h-[60px] lg:w-[60px]": props.type === "message",
          "h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]":
            props.type === "user" || !props.type,
        },
        props.className,
      )}
    >
      <AvatarImage
        className={cn(
          `
          h-full
          w-full
          shrink-0
          rounded-full
          object-cover
        `,
          props.imageClass,
        )}
        src={props.src}
        alt={props.name}
      />
      <AvatarFallback
        className={cn(
          `
        flex
        h-full
        w-full
        shrink-0
        items-center
        justify-center
        rounded-full
        text-sm
        font-medium
        sm:text-base
        `,
          props.initialsClass,
        )}
        style={{
          color: textColor,
          backgroundColor: backgroundColor,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
