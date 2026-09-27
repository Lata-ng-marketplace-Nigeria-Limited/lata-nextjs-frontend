"use client";

import EmptyMessages from "@components/message/EmptyMessages";
import { useLocalStore } from "@/store/states/localStore";
import { useEffect, useState } from "react";
import { Chat } from "@/interface/chat";
import MessagesListArea from "@components/message/MessagesListArea";
import ChatContainer from "@components/message/ChatContainer";
import { useSearchParams } from "next/navigation";
import { getChatsApi, getChatByIdApi } from "@/api/chat";
import { Loader2 } from "lucide-react";

export const MessagesArea = () => {
  const { chats, setChats } = useLocalStore();
  const [activeChat, setActiveChat] = useState<Chat>();
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get("id") || searchParams.get("chatId");

  useEffect(() => {
    let isMounted = true;

    const loadChats = async () => {
      try {
        setLoading(true);
        const res = await getChatsApi();
        const fetchedChats: Chat[] = res?.data || res || [];

        if (isMounted) {
          if (Array.isArray(fetchedChats) && fetchedChats.length > 0) {
            setChats(fetchedChats);
          }

          if (targetChatId) {
            const match = (fetchedChats || []).find(
              (chat) => String(chat.id) === String(targetChatId),
            );
            if (match) {
              setActiveChat(match);
            } else {
              try {
                const singleRes = await getChatByIdApi(targetChatId);
                const singleChat: Chat = singleRes?.data || singleRes;
                if (singleChat && singleChat.id) {
                  setActiveChat(singleChat);
                  setChats([singleChat, ...(fetchedChats || [])]);
                }
              } catch (err) {
                console.error("Failed to fetch target chat by ID:", err);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading chats in MessagesArea:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadChats();

    return () => {
      isMounted = false;
    };
  }, [targetChatId]);

  useEffect(() => {
    if (targetChatId && chats.length > 0 && !activeChat) {
      const match = chats.find(
        (chat) => String(chat.id) === String(targetChatId),
      );
      if (match) {
        setActiveChat(match);
      }
    }
  }, [targetChatId, chats, activeChat]);

  const hasChat = Boolean(
    targetChatId || activeChat || (chats && chats.length > 0),
  );

  return (
    <EmptyMessages hasChat={hasChat}>
      <div className={"flex h-full w-full gap-x-2 lg:gap-x-6"}>
        <MessagesListArea
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
        {loading && !activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-grey6 gap-3 bg-white rounded-[10px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-medium">Loading conversation...</p>
          </div>
        ) : (
          <ChatContainer activeChat={activeChat} setActiveChat={setActiveChat} />
        )}
      </div>
    </EmptyMessages>
  );
};
