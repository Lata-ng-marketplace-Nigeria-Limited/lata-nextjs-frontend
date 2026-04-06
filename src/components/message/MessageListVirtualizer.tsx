import React, { SetStateAction, useRef } from "react";
import { Chat } from "@/interface/chat";
import { useUser } from "@hooks/useUser";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/utils";
import MessagePreview from "@components/message/MessagePreview";
import { UserRole } from "@/interface/user";

interface Props {
  setActiveChat: React.Dispatch<SetStateAction<Chat | undefined>>;
  activeChat: Chat | undefined;
  chatList: Chat[];
}

export default function MessageListVirtualizer(props: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  const virtualizer = useVirtualizer({
    count: props.chatList.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 92,
    overscan: 6,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      className={cn(`
          w-full
          sm:max-h-[calc(100vh-317px)]
          max-h-[calc(100vh-200px)]
          sm:min-h-[calc(100vh-317px)]
          min-h-[calc(100vh-200px)]
          overflow-y-auto
          pr-1
        `)}
      ref={containerRef}
    >
      <div
        className={cn(`
          relative
          w-full
        `)}
        style={{
          height: virtualizer.getTotalSize() + "px",
        }}
      >
        {virtualItems.map((virtualRow) => {
          const chat = props.chatList[virtualRow.index];
          if (!chat) return null;

          return (
            <div
              className={"absolute left-0 top-0 w-full"}
              key={chat.id}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <MessagePreview
                onClick={() => {
                  props.setActiveChat(chat);
                }}
                isActive={props.activeChat?.id === chat.id}
                lastMessageSender={
                  user?.id === chat.lastMessageSenderId ? "me" : "other"
                }
                isOwnProduct={user?.id === chat.product?.userId}
                seller={chat.receiver}
                buyer={chat.sender}
                lastMessage={chat.lastMessage}
                productName={chat.product?.name}
                productId={chat.product?.id}
                senderRole={chat.sender?.role as UserRole}
                receiverRole={chat.receiver?.role as UserRole}
                lastMessageTime={chat.lastMessageAt}
                lastMessageData={chat.lastMessageData}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
