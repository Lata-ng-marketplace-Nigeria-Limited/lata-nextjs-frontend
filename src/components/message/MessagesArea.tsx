"use client";

import EmptyMessages from "@components/message/EmptyMessages";
import { useLocalStore } from "@/store/states/localStore";
import { useEffect, useState } from "react";
import { Chat } from "@/interface/chat";
import MessagesListArea from "@components/message/MessagesListArea";
import ChatContainer from "@components/message/ChatContainer";
import { useSearchParams } from "next/navigation";

export const MessagesArea = () => {
  const { chats } = useLocalStore();
  const [activeChat, setActiveChat] = useState<Chat>();
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get("id") || searchParams.get("chatId");

  useEffect(() => {
    if (targetChatId && chats.length > 0) {
      const match = chats.find((chat) => chat.id === targetChatId);
      if (match) {
        setActiveChat(match);
      }
    }
  }, [targetChatId, chats]);

  return (
    <EmptyMessages hasChat={!!chats.length}>
      <div className={"flex h-full w-full gap-x-2 lg:gap-x-6"}>
        <MessagesListArea
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
        <ChatContainer activeChat={activeChat} setActiveChat={setActiveChat} />
      </div>
    </EmptyMessages>
  );
};
