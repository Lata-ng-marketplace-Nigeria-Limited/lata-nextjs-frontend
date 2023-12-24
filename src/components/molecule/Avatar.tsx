import { useEffect, useState } from "react";
import { cn, generateColor, makeInitials } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface Props {
  src?: string;
  name?: string;
  type?: "user" | "message";
  className?: string;
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
        items-center
        justify-center
        select-none
        rounded-full
        bg-neutral-100
        shrink-0
      `,
        {
          "w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]": props.type === "message",
          "w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]":
            props.type === "user" || !props.type,
        },
        props.className,
      )}
    >
      <AvatarImage
        className={cn(`
          rounded-full
          w-full
          h-full
          object-cover
          shrink-0
        `)}
        src={props.src}
        alt={props.name}
      />
      <AvatarFallback
        className={cn(`
        rounded-full
        w-full
        h-full
        flex
        items-center
        justify-center
        text-sm
        sm:text-base
        font-medium
        shrink-0
        `)}
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
