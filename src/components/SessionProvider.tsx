"use client";

import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import SocketService from "@/service/SocketService";
import { useUserStore } from "@/store/states/userState";
import { useLocalStore } from "@/store/states/localStore";
import { Chat } from "@/interface/chat";
import { SessionData } from "@/interface/next-auth";

type Props = {
  children?: React.ReactNode;
  session: SessionData | null;
};

export const NextAuthProvider = ({ children, session }: Props) => {
  const {
    setIsSocketConnected,
    setHasInitializedSocketConnection,
    isSocketConnected,
    hasInitializedSocketConnection,
  } = useUserStore();
  const { setChats } = useLocalStore();

  useEffect(() => {
    if (!session?.token) return;
    SocketService.boot({
      onAuthenticated: (data) => {
        setIsSocketConnected(data.isAuthorized);
        setHasInitializedSocketConnection(true);
      },
      onConnect: () => {
        console.log("socket connected");
      },
      onDisconnect: () => {
        console.log("socket disconnected");
      },
      token: session?.token,
    });
  }, [session?.token, setHasInitializedSocketConnection, setIsSocketConnected]);

  useEffect(() => {
    if (!isSocketConnected) return;
    if (!hasInitializedSocketConnection) return;
    if (!session?.user?.id) return;

    const receiveChatsEvent = "receive-all:chats" + session.user.id;
    const getAllChatsEvent = "get-all:chats" + session.user.id;

    const handleReceiveChats = (data: Chat[]) => {
      console.log("Received chats:", data?.length);
      setChats(data);
    };

    const handleGetAllChats = () => {
      console.log("Re-fetching chats");
      SocketService.socket?.emit(getAllChatsEvent);
    };

    // Register listeners
    SocketService.socket?.on(receiveChatsEvent, handleReceiveChats);
    SocketService.socket?.on(getAllChatsEvent, handleGetAllChats);

    // Initial fetch
    SocketService.socket?.emit(getAllChatsEvent);

    // Cleanup function to remove listeners
    return () => {
      SocketService.socket?.off(receiveChatsEvent, handleReceiveChats);
      SocketService.socket?.off(getAllChatsEvent, handleGetAllChats);
    };
  }, [
    hasInitializedSocketConnection,
    isSocketConnected,
    setChats,
    session?.user?.id,
  ]);

  return <SessionProvider session={session as any}>{children}</SessionProvider>;
};
