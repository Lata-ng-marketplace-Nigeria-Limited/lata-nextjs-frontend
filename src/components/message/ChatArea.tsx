import { Chat, ChatMessage } from "@/interface/chat";
import { useUser } from "@hooks/useUser";
import { useEffect, useRef } from "react";
import { cn } from "@/utils";
import { DateTime } from "luxon";
import MessageText from "@components/message/MessageText";
import { Fragment } from "react";
import { ChatRenderMessage } from "@components/message/ChatContainer";

interface Props {
  activeChat: Chat | undefined;
  messages: ChatRenderMessage[];
  onRetryMessage?: (messageId: string) => void;
}

export default function ChatArea(props: Props) {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCount = useRef(0);
  const { user } = useUser();

  useEffect(() => {
    if (!props.activeChat || !lastMessageRef.current) return;

    const switchedChat = props.messages.length < previousMessageCount.current;
    if (switchedChat || previousMessageCount.current === 0) {
      lastMessageRef.current.scrollIntoView({
        behavior: "auto",
        inline: "nearest",
        block: "end",
      });
      previousMessageCount.current = props.messages.length;
      return;
    }

    const container = containerRef.current;
    const isNearBottom =
      !container ||
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (props.messages.length > previousMessageCount.current && isNearBottom) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "end",
      });
    }

    previousMessageCount.current = props.messages.length;
  }, [props.activeChat?.id, props.messages.length]);

  useEffect(() => {
    previousMessageCount.current = props.messages.length;
  }, [props.activeChat?.id]);

  const firstUnreadIndex = props.messages.findIndex((chatMessage) => {
    if (chatMessage.id.startsWith("temp-")) return false;
    if (chatMessage.userId === user?.id) return false;
    return !chatMessage.isRead;
  });

  const getDateLabel = (isoDate: string) => {
    const date = DateTime.fromISO(isoDate);
    if (!date.isValid) return "";
    if (date.hasSame(DateTime.now(), "day")) return "Today";
    if (date.hasSame(DateTime.now().minus({ days: 1 }), "day")) return "Yesterday";
    return date.toFormat("LLL dd, yyyy");
  };

  if (!props.messages.length) {
    return (
      <div
        className={cn(
          `
          min-h-[calc(100vh-200px)]
          sm:h-full
          sm:max-h-[calc(100vh-300px)]
          sm:min-h-[calc(100vh-300px)]
          max-h-[calc(100vh-200px)]
          overflow-y-auto
          px-2.5
          sm:px-6
          pt-8
          pb-7
          bg-offwhite
          grid
          place-items-center
        `,
        )}
      >
        <p className={"text-xs sm:text-sm text-grey8 text-center"}>
          No messages yet. Say hello to start the conversation.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        `
        min-h-[calc(100vh-200px)]
        sm:h-full
        sm:max-h-[calc(100vh-300px)]
        sm:min-h-[calc(100vh-300px)]
        max-h-[calc(100vh-200px)]
        overflow-y-auto
        flex-col
        gap-y-3
        flex
        pt-6
        pb-7
        px-2.5
        sm:px-6
        sm:pt-6
        bg-offwhite
      `,
      )}
      ref={containerRef}
    >
      {props.messages.map((chatMessage, index) => {
        const previousMessage = props.messages[index - 1];
        const showDateDivider =
          !previousMessage ||
          !DateTime.fromISO(previousMessage.createdAt).hasSame(
            DateTime.fromISO(chatMessage.createdAt),
            "day",
          );
        const showUnreadDivider = firstUnreadIndex === index;
        const isPending = chatMessage._optimisticStatus === "pending";
        const isFailed = chatMessage._optimisticStatus === "failed";
        const messageTime = DateTime.fromISO(chatMessage.createdAt);

        return (
          <Fragment key={chatMessage.id}>
            {showDateDivider ? (
              <div className={"w-full flex justify-center py-1"}>
                <span className={"rounded-full border border-grey2 bg-white/70 px-2.5 py-1 text-[10px] text-grey7 sm:text-[11px]"}>
                  {getDateLabel(chatMessage.createdAt)}
                </span>
              </div>
            ) : null}

            {showUnreadDivider ? (
              <div className={"relative flex items-center py-1.5"}>
                <span className={"h-px w-full bg-grey2"} />
                <span className={"absolute left-1/2 -translate-x-1/2 rounded-full bg-offwhite px-2 text-[10px] font-medium uppercase tracking-wide text-primary"}>
                  New messages
                </span>
              </div>
            ) : null}

            <MessageText
              lastRef={lastMessageRef}
              index={index}
              totalLength={props.messages.length}
              owner={user?.id === chatMessage.userId ? "me" : "other"}
              message={chatMessage.message}
              messageData={chatMessage}
              chatId={props.activeChat?.id}
              isPending={isPending}
              isFailed={isFailed}
              onRetry={
                isFailed
                  ? () => props.onRetryMessage?.(chatMessage.id)
                  : undefined
              }
              time={
                messageTime.isValid
                  ? messageTime.toLocaleString(DateTime.TIME_SIMPLE)
                  : ""
              }
            />
          </Fragment>
        );
      })}
    </div>
  );
}
