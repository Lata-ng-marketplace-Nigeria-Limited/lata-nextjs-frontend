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
    SocketService.socket?.emit("get-all:chats" + session?.user?.id);
    SocketService.socket?.on(
      "receive-all:chats" + session?.user?.id,
      (data: Chat[]) => {
        setChats(data);
      },
    );
    SocketService.socket?.on("get-all:chats" + session?.user?.id, () => {
      SocketService.socket?.emit("get-all:chats" + session?.user?.id);
    });
  }, [
    hasInitializedSocketConnection,
    isSocketConnected,
    setChats,
    session?.user?.id,
  ]);

  return <SessionProvider session={session as any}>{children}</SessionProvider>;
};
