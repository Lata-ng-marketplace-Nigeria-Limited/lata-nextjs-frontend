import { ChatMessage } from "@/interface/chat";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@hooks/useUser";
import { useIntersectionObserver } from "usehooks-ts";
import SocketService from "@/service/SocketService";
import { cn } from "@/utils";

interface ChatMessageProps {
  owner: "me" | "other";
  message: string;
  time: string;
  lastRef?: any;
  index?: number;
  totalLength?: number;
  messageData?: ChatMessage;
}

export default function MessageText(props: ChatMessageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const visible = !!entry?.isIntersecting;
  const [hasMadeReadAtCall, setHasMadeReadAtCall] = useState(false);
  const { user, isSocketConnected } = useUser();

  useEffect(() => {
    if (!props.totalLength) return;
    if (props.index === props.totalLength - 1) {
      props.lastRef.current = ref.current;

      if (
        visible &&
        props.owner === "other" &&
        !props.messageData?.isRead &&
        user?.id !== props.messageData?.userId &&
        !hasMadeReadAtCall
      ) {
        if (!isSocketConnected) return;
        SocketService.socket?.emit("read:message" + user?.id, {
          chatId: props.messageData?.chatId,
          messageId: props.messageData?.id,
          messageData: props.messageData,
        });
        setHasMadeReadAtCall(true);
      }
    }
  }, [
    props.index,
    props.lastRef,
    props.messageData,
    props.owner,
    props.totalLength,
    user?.id,
    visible,
    isSocketConnected,
    hasMadeReadAtCall,
    props,
  ]);

  return (
    <article
      className={cn(
        `
          rounded-[5px]
          px-3
          py-1.5
          sm:py-3
          gap-y-1.5
          sm:gap-y-3
          flex
          flex-col
          w-fit
          max-w-max
          bg-amber-100
          justify-self-end
          first:mt-auto
          `,
        {
          "self-end bg-purp2 ml-6": props.owner === "me",
          "bg-white mr-6": props.owner === "other",
        },
      )}
      ref={ref}
    >
      <p className={"text-[10px] sm:text-[12px] text-grey8"}>{props.message}</p>
      <span className={"text-end text-[8px] sm:text-[10px] text-grey6"}>
        {props.time}
      </span>
    </article>
  );
}
