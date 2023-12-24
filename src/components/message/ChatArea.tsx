import { Chat, ChatMessage } from "@/interface/chat";
import { useUser } from "@hooks/useUser";
import { useEffect, useRef } from "react";
import { cn } from "@/utils";
import { DateTime } from "luxon";
import MessageText from "@components/message/MessageText";

interface Props {
  activeChat: Chat | undefined;
  isOwner: boolean;
  messages: ChatMessage[];
}

export default function ChatArea(props: Props) {
  const lastMessageRef = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!lastMessageRef.current) return;
    if (!props.activeChat) return;
    lastMessageRef.current?.scrollIntoView({
      behavior: "instant",
      inline: "nearest",
      block: "end",
    });
  });

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
        gap-y-4
        flex
        pt-8
        pb-7
        px-2.5
        sm:px-6
        sm:pt-8
        bg-offwhite
      `,
      )}
      ref={containerRef}
    >
      {props.messages.map((chatMessage, index) => (
        <MessageText
          lastRef={lastMessageRef}
          index={index}
          key={index}
          totalLength={props.messages?.length}
          owner={user?.id === chatMessage.userId ? "me" : "other"}
          message={chatMessage.message}
          messageData={chatMessage}
          time={DateTime.fromISO(chatMessage.createdAt).toLocaleString(
            DateTime.TIME_SIMPLE,
          )}
        />
      ))}
    </div>
  );
}
