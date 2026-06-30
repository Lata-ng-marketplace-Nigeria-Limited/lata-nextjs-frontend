"use client";

import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import SocketService from "@/service/SocketService";
import { useUserStore } from "@/store/states/userState";
import { useLocalStore } from "@/store/states/localStore";
import { Chat } from "@/interface/chat";
import { SessionData } from "@/interface/next-auth";
import BuyerRolePromptModal from "@/components/organism/BuyerRolePromptModal";

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
    if (!session?.token) {
      console.log("❌ No session token found");
      return;
    }
    console.log("🔌 Initializing socket connection...");
    
    let authTimeout: NodeJS.Timeout;
    
    SocketService.boot({
      onAuthenticated: (data) => {
        console.log("🔐 Socket authentication:", data);
        clearTimeout(authTimeout);
        setIsSocketConnected(data.isAuthorized);
        setHasInitializedSocketConnection(true);
      },
      onConnect: () => {
        console.log("✅ Socket connected");
        
        // Fallback: If no auth event is received within 3 seconds, assume connected
        authTimeout = setTimeout(() => {
          console.warn("⚠️ No socket:auth event received after 3s, assuming authenticated");
          setIsSocketConnected(true);
          setHasInitializedSocketConnection(true);
        }, 3000);
      },
      onDisconnect: () => {
        console.log("❌ Socket disconnected");
        clearTimeout(authTimeout);
      },
      token: session?.token,
    });
    
    return () => {
      clearTimeout(authTimeout);
    };
  }, [session?.token, setHasInitializedSocketConnection, setIsSocketConnected]);

  useEffect(() => {
    if (!isSocketConnected) {
      console.log("⏳ Socket not connected yet...");
      return;
    }
    if (!hasInitializedSocketConnection) {
      console.log("⏳ Socket not initialized yet...");
      return;
    }
    if (!session?.user?.id) {
      console.log("❌ No user ID found in session");
      return;
    }

    const receiveChatsEvent = "receive-all:chats" + session.user.id;
    const getAllChatsEvent = "get-all:chats" + session.user.id;

    console.log("📡 Setting up chat listeners for user:", session.user.id);
    console.log("📡 Receive event:", receiveChatsEvent);
    console.log("📡 Get all event:", getAllChatsEvent);

    const handleReceiveChats = (data: Chat[]) => {
      console.log("📨 Received chats:", data?.length || 0);
      console.log("📨 Chat data:", data);
      setChats(data);
    };

    const handleGetAllChats = () => {
      console.log("🔄 Re-fetching chats for user:", session?.user?.id);
      SocketService.socket?.emit(getAllChatsEvent);
    };

    // Register listeners
    SocketService.socket?.on(receiveChatsEvent, handleReceiveChats);
    SocketService.socket?.on(getAllChatsEvent, handleGetAllChats);

    // Debug: Listen to ALL socket events to see what the server is actually sending
    const debugHandler = (eventName: string, ...args: any[]) => {
      console.log("🔔 ALL Socket events:", eventName, args);
    };
    SocketService.socket?.onAny(debugHandler);

    // Initial fetch
    console.log("🚀 Emitting initial chat request:", getAllChatsEvent);
    SocketService.socket?.emit(getAllChatsEvent);

    // Cleanup function to remove listeners
    return () => {
      console.log("🧹 Cleaning up chat listeners");
      SocketService.socket?.off(receiveChatsEvent, handleReceiveChats);
      SocketService.socket?.off(getAllChatsEvent, handleGetAllChats);
      SocketService.socket?.offAny(debugHandler);
    };
  }, [
    hasInitializedSocketConnection,
    isSocketConnected,
    setChats,
    session?.user?.id,
  ]);

  return (
    <SessionProvider session={session as any}>
      {children}
      <BuyerRolePromptModal />
    </SessionProvider>
  );
};
