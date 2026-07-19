import { ChatMessage } from "@/interface/chat";
import { MutableRefObject, useEffect, useRef } from "react";
import { useUser } from "@hooks/useUser";
import { useIntersectionObserver } from "usehooks-ts";
import SocketService from "@/service/SocketService";
import { cn } from "@/utils";

interface ChatMessageProps {
  owner: "me" | "other";
  message: string;
  time: string;
  isPending?: boolean;
  isFailed?: boolean;
  onRetry?: () => void;
  lastRef?: MutableRefObject<HTMLDivElement | null>;
  index?: number;
  totalLength?: number;
  messageData?: ChatMessage;
  chatId?: string;
}

export default function MessageText(props: ChatMessageProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const readEventSentForMessage = useRef<string | null>(null);
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.4,
  });
  const visible = isIntersecting;
  const { user, isSocketConnected } = useUser();

  useEffect(() => {
    if (!props.totalLength) return;
    if (props.index === props.totalLength - 1) {
      if (props.lastRef) {
        props.lastRef.current = elementRef.current;
      }
    }

    if (
      !props.messageData?.id?.startsWith("temp-") &&
      visible &&
      props.owner === "other" &&
      !props.messageData?.isRead &&
      user?.id !== props.messageData?.userId &&
      readEventSentForMessage.current !== props.messageData?.id
    ) {
      if (!isSocketConnected) return;
      SocketService.socket?.emit("read:message" + user?.id, {
        chatId: props.chatId || props.messageData?.chatId,
        messageId: props.messageData?.id,
        messageData: props.messageData,
      });
      readEventSentForMessage.current = props.messageData?.id || null;
    }
  }, [
    props.chatId,
    props.index,
    props.lastRef,
    props.messageData,
    props.owner,
    props.totalLength,
    user?.id,
    visible,
    isSocketConnected,
  ]);

  useEffect(() => {
    readEventSentForMessage.current = null;
  }, [props.messageData?.id]);

  return (
    <article
      className={cn(
        `
          rounded-[8px]
          px-3
          py-2
          sm:py-2.5
          gap-y-1.5
          sm:gap-y-2
          flex
          flex-col
          w-fit
          max-w-[85%]
          sm:max-w-[72%]
          bg-amber-100
          justify-self-end
          first:mt-auto
          shadow-[0_1px_1px_rgba(0,0,0,0.06)]
          `,
        {
          "self-end bg-purp2 ml-8": props.owner === "me" && !props.isPending,
          "self-end bg-purp2/70 ml-8": props.owner === "me" && props.isPending,
          "self-end bg-red-100 border border-red-200 ml-8":
            props.owner === "me" && props.isFailed,
          "bg-white mr-8": props.owner === "other",
        },
      )}
      ref={(node) => {
        elementRef.current = node as HTMLDivElement | null;
        observerRef(node);
      }}
    >
      <p className={"text-[10px] sm:text-[12px] text-grey8 break-words whitespace-pre-wrap"}>
        {props.message}
      </p>
      <span className={"text-end text-[8px] sm:text-[10px] text-grey6"}>
        {props.isPending ? "Sending..." : props.time}
      </span>
      {props.isFailed ? (
        <button
          className={"self-end text-[9px] sm:text-[10px] text-red-700 underline underline-offset-2"}
          onClick={props.onRetry}
          type={"button"}
        >
          Failed to send. Tap to retry.
        </button>
      ) : null}
    </article>
  );
}
