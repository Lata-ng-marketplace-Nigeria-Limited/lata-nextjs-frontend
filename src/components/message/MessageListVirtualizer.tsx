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
  const containerRef = useRef<any>(null);
  const { user } = useUser();

  const virtualizer = useVirtualizer({
    count: props.chatList.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 45,
  });

  return (
    <div
      className={cn(`
          flex
          flex-col
          gap-y-6 
          sm:max-h-[calc(100vh-317px)]
          max-h-[calc(100vh-200px)]
          sm:min-h-[calc(100vh-317px)]
          min-h-[calc(100vh-200px)]
          overflow-y-auto
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
        <div
          className={cn(`
            absolute
            top-0
            left-0
            w-full
          `)}
          style={{
            transform: `translateY(${virtualizer.getVirtualItems()?.[0]
              ?.start}px)`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow, i) => (
            <MessagePreview
              ref={virtualizer.measureElement}
              key={i}
              onClick={() => {
                // @ts-ignore
                props.setActiveChat(undefined);
                props.setActiveChat(props.chatList?.[virtualRow.index]);
              }}
              isActive={
                props.activeChat?.id === props.chatList?.[virtualRow.index]?.id
              }
              lastMessageSender={
                user?.id ===
                props.chatList?.[virtualRow.index]?.lastMessageSenderId
                  ? "me"
                  : "other"
              }
              isOwnProduct={
                user?.id === props.chatList?.[virtualRow.index]?.product?.userId
              }
              seller={props.chatList?.[virtualRow.index]?.receiver}
              buyer={props.chatList?.[virtualRow.index]?.sender}
              lastMessage={props.chatList?.[virtualRow.index]?.lastMessage}
              productName={props.chatList?.[virtualRow.index]?.product?.name}
              productId={props.chatList?.[virtualRow.index]?.product?.id}
              senderRole={props.chatList?.[virtualRow.index]?.sender?.role as UserRole}
              receiverRole={props.chatList?.[virtualRow.index]?.receiver?.role  as UserRole}
              lastMessageTime={
                props.chatList?.[virtualRow.index]?.lastMessageAt
              }
              lastMessageData={
                props.chatList?.[virtualRow.index]?.lastMessageData
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
