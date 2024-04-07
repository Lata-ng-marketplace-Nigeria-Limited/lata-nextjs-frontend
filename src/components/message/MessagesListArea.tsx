import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Chat } from "@/interface/chat";
import { useMediaQuery } from "usehooks-ts";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useLocalStore } from "@/store/states/localStore";
import { cn } from "@/utils";
import MessageSearchInput from "@components/input/MessageSearchInput";
import MessageListVirtualizer from "@components/message/MessageListVirtualizer";

interface Props {
  setActiveChat: React.Dispatch<SetStateAction<Chat | undefined>>;
  activeChat: Chat | undefined;
}

export default function MessagesListArea(props: Props) {
  const isSmall = useMediaQuery("(max-width: 640px)");
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const containerRef = useRef<any>(null);
  const [count, setCount] = useState(0);
  const localStore = useLocalStore();

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 45,
    overscan: 5,
  });

  useEffect(() => {
    if (!localStore.chats?.length) return;
    setChats(localStore.chats);
    if (props.activeChat) {
      const activeChat = localStore.chats.find(
        (chat) => chat.id === props.activeChat?.id,
      );
      if (!activeChat) return;
      props.setActiveChat(activeChat);
    }
  }, [localStore.chats, props, props.activeChat, props.setActiveChat]);

  useEffect(() => {
    setCount(filteredChats.length);
  }, [filteredChats]);

  const items = virtualizer.getVirtualItems();

  return (
    <div
      className={cn(
        `
        flex 
        w-full 
        shrink-0 
        flex-col 
        gap-y-6 
        sm:flex 
        sm:max-w-[250px] 
        tablet:max-w-[250px] 
        lg:max-w-[340px] 
        xl:max-w-[390px]   
     `,
        {
          hidden: !!props.activeChat,
        },
      )}
    >
      <div
        className={cn(`
        flex
        w-full
        rounded-[5px]
        bg-primary
        px-2.5
        py-2
        sm:px-4
        sm:py-3.5
        
        
      `)}
      >
        <h2 className={"text-sm font-semibold text-white sm:text-base"}>
          My messages
        </h2>
      </div>

      <MessageSearchInput chats={chats} setFilteredChats={setFilteredChats} />

      {filteredChats.length ? (
        <MessageListVirtualizer
          setActiveChat={props.setActiveChat}
          activeChat={props.activeChat}
          chatList={filteredChats}
        />
      ) : null}
    </div>
  );
}
