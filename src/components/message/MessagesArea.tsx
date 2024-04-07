"use client";

import EmptyMessages from "@components/message/EmptyMessages";
import { useLocalStore } from "@/store/states/localStore";
import { useState } from "react";
import { Chat } from "@/interface/chat";
import MessagesListArea from "@components/message/MessagesListArea";
import ChatContainer from "@components/message/ChatContainer";

export const MessagesArea = () => {
  const { chats } = useLocalStore();
  const [activeChat, setActiveChat] = useState<Chat>();

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
