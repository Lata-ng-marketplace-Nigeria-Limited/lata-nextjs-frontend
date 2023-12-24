import React, { SetStateAction, useEffect, useState } from "react";
import { Chat, ChatMessage } from "@/interface/chat";
import { useUser } from "@hooks/useUser";
import { DateTime } from "luxon";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { CaretLeftIcon } from "@atom/icons/CaretLeft";
import AppAvatar from "@molecule/Avatar";
import ChatArea from "@components/message/ChatArea";
import ChatInputArea from "@components/input/ChatInputArea";

interface Props {
  activeChat: Chat | undefined;
  setActiveChat: React.Dispatch<SetStateAction<Chat | undefined>>;
}

export default function ChatContainer(props: Props) {
  const [isOwner, setIsOwner] = useState(false);
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useUser();

  useEffect(() => {
    setMessages([]);
    if (!props.activeChat) return;
    const isOwner = props.activeChat?.product?.userId === user?.id;
    setIsOwner(isOwner);
    const name = isOwner
      ? props.activeChat?.buyer?.name
      : props.activeChat?.seller?.name;
    setName(name!);
    const picture = isOwner
      ? props.activeChat?.buyer?.avatar
      : props.activeChat?.seller?.avatar;
    setPicture(picture!);
    setMessages(props.activeChat?.messages || []);
  }, [props.activeChat, user?.id]);

  return (
    <NoChatSelected
      activeChat={props.activeChat}
      isChatSelected={!!props.activeChat}
    >
      <div
        className={cn(`
        flex
        flex-col
        px-2.5
        py-2
        sm:px-6
        sm:py-[6px]
        bg-primary
        rounded-[5px_5px_0_0]
        w-full
        relative
      `)}
      >
        <div className={"flex items-center gap-x-2.5"}>
          <Button
            format={"icon"}
            className={cn(`
              block 
              sm:hidden
            `)}
            onClick={() => {
              props.setActiveChat(undefined);
            }}
          >
            <CaretLeftIcon
              className={cn(`
                w-4 
                h-4 
                text-white 
              `)}
            />
          </Button>
          <AppAvatar name={name} type={"user"} src={picture} />
          <p className={"text-white text-xs sm:text-base font-semibold"}>
            {name}
          </p>

          <p
            className={cn(`
              absolute 
              text-[8px] 
              sm:text-[10px]
              text-grey6
              left-1/2
              transform
              -translate-x-1/2
              -bottom-[32px]  
            `)}
          >
            {DateTime.now().toFormat("LLL dd, yyyy")}
          </p>
        </div>
      </div>

      <ChatArea
        messages={messages}
        activeChat={props.activeChat}
        isOwner={isOwner}
      />

      <ChatInputArea activeChat={props.activeChat} isOwner={isOwner} />
    </NoChatSelected>
  );
}

export function NoChatSelected(props: {
  children: React.ReactNode;
  isChatSelected: boolean;
  activeChat?: Chat;
}) {
  return (
    <div
      className={cn(
        "hidden sm:flex flex-col w-full h-full min-h-[calc(100vh-50px-200px)]  md:min-h-[calc(100vh-60px-200px)] rounded-[10px]",
        {
          "p-4 justify-center items-center bg-offwhite": !props.isChatSelected,
          flex: !!props.activeChat,
        },
      )}
    >
      {props.isChatSelected ? (
        <>{props.children}</>
      ) : (
        <p className={"text-zinc-600 tablet:text-xl font-medium text-center"}>
          Select a chat to view your messages
        </p>
      )}
    </div>
  );
}
