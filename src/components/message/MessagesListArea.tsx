import React, { SetStateAction, useEffect, useState } from "react";
import { Chat } from "@/interface/chat";
import { useLocalStore } from "@/store/states/localStore";
import { cn } from "@/utils";
import MessageSearchInput from "@components/input/MessageSearchInput";
import MessageListVirtualizer from "@components/message/MessageListVirtualizer";

interface Props {
  setActiveChat: React.Dispatch<SetStateAction<Chat | undefined>>;
  activeChat: Chat | undefined;
}

export default function MessagesListArea(props: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const localStore = useLocalStore();

  useEffect(() => {
    const nextChats = localStore.chats || [];
    setChats(nextChats);

    if (props.activeChat) {
      const activeChat = nextChats.find(
        (chat) => chat.id === props.activeChat?.id,
      );
      if (activeChat) {
        props.setActiveChat(activeChat);
      }
    }
  }, [localStore.chats, props.activeChat?.id, props.setActiveChat]);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

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
      ) : (
        <div className={"h-full min-h-[200px] grid place-items-center px-4"}>
          <p className={"text-xs sm:text-sm text-grey8 text-center"}>
            No conversations match your search.
          </p>
        </div>
      )}
    </div>
  );
}
