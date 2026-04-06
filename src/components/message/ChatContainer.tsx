import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Chat, ChatMessage } from "@/interface/chat";
import { useUser } from "@hooks/useUser";
import { DateTime } from "luxon";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { CaretLeftIcon } from "@atom/icons/CaretLeft";
import AppAvatar from "@molecule/Avatar";
import ChatArea from "@components/message/ChatArea";
import ChatInputArea from "@components/input/ChatInputArea";
import SocketService from "@/service/SocketService";
import { useToast } from "@components/ui/use-toast";

type OptimisticStatus = "pending" | "failed";

interface OptimisticMessage {
  message: ChatMessage;
  status: OptimisticStatus;
}

export type ChatRenderMessage = ChatMessage & {
  _optimisticStatus?: OptimisticStatus;
};

const OPTIMISTIC_TIMEOUT_MS = 8000;

interface Props {
  activeChat: Chat | undefined;
  setActiveChat: React.Dispatch<SetStateAction<Chat | undefined>>;
}

export default function ChatContainer(props: Props) {
  const { user, isSocketConnected } = useUser();
  const { toast } = useToast();
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const messageTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const isOwner = (props.activeChat?.product?.userId || "") === (user?.id || "");
  const { name, picture } = useMemo(() => {
    if (!props.activeChat) {
      return { name: "", picture: "" };
    }

    if (isOwner) {
      return {
        name: props.activeChat.sender?.name || "Unknown user",
        picture: props.activeChat.sender?.avatar || "",
      };
    }

    return {
      name: props.activeChat.receiver?.name || "Unknown user",
      picture: props.activeChat.receiver?.avatar || "",
    };
  }, [isOwner, props.activeChat]);

  const serverMessages = props.activeChat?.messages || [];

  const clearMessageTimeout = useCallback((messageId: string) => {
    const timeout = messageTimeoutsRef.current[messageId];
    if (!timeout) return;
    clearTimeout(timeout);
    delete messageTimeoutsRef.current[messageId];
  }, []);

  const scheduleFailedTimeout = useCallback((messageId: string) => {
    clearMessageTimeout(messageId);
    messageTimeoutsRef.current[messageId] = setTimeout(() => {
      setOptimisticMessages((prev) =>
        prev.map((entry) => {
          if (entry.message.id !== messageId || entry.status !== "pending") {
            return entry;
          }

          return {
            ...entry,
            status: "failed",
          };
        }),
      );
    }, OPTIMISTIC_TIMEOUT_MS);
  }, [clearMessageTimeout]);

  const emitMessage = useCallback(
    (nextMessage: string) => {
      if (!props.activeChat?.id || !user?.id) {
        return false;
      }

      if (!isSocketConnected) {
        return false;
      }

      const otherUserId = isOwner
        ? props.activeChat?.sender?.id
        : props.activeChat?.receiver?.id;

      SocketService.socket?.emit(`send:message` + user?.id, {
        chatId: props.activeChat?.id,
        message: nextMessage,
        userId: user?.id,
        otherUserId,
      });

      return true;
    },
    [isOwner, isSocketConnected, props.activeChat, user?.id],
  );

  useEffect(() => {
    if (!user?.id) return;

    const receiveMessageEvent = `receive:chat-message${user.id}`;
    const getAllChatsEvent = `get-all:chats${user.id}`;

    const handleReceiveMessage = (payload?: Partial<ChatMessage>) => {
      // Force a refresh so list previews/unread counts always sync with server state.
      SocketService.socket?.emit(getAllChatsEvent);

      if (!payload?.id || !payload?.chatId || !payload?.userId) return;
      if (!payload?.createdAt || typeof payload.message !== "string") return;

      const payloadId = payload.id;
      const payloadChatId = payload.chatId;
      const payloadUserId = payload.userId;
      const payloadMessage = payload.message;
      const payloadCreatedAt = payload.createdAt;
      const payloadUpdatedAt = payload.updatedAt || payloadCreatedAt;

      props.setActiveChat((currentActiveChat) => {
        if (!currentActiveChat || currentActiveChat.id !== payloadChatId) {
          return currentActiveChat;
        }

        const currentMessages = currentActiveChat.messages || [];
        const alreadyExists = currentMessages.some(
          (message) => message.id === payloadId,
        );
        if (alreadyExists) {
          return currentActiveChat;
        }

        const nextMessage: ChatMessage = {
          id: payloadId,
          chatId: payloadChatId,
          userId: payloadUserId,
          message: payloadMessage,
          isRead: payload.isRead ?? false,
          isEdited: payload.isEdited ?? false,
          fileId: payload.fileId ?? null,
          readAt: payload.readAt ?? null,
          createdAt: payloadCreatedAt,
          updatedAt: payloadUpdatedAt,
        };

        const mergedMessages = [...currentMessages, nextMessage].sort((a, b) => {
          const aTime = DateTime.fromISO(a.createdAt).toMillis();
          const bTime = DateTime.fromISO(b.createdAt).toMillis();
          return aTime - bTime;
        });

        return {
          ...currentActiveChat,
          messages: mergedMessages,
          lastMessage: nextMessage.message,
          lastMessageAt: nextMessage.createdAt,
          lastMessageSenderId: nextMessage.userId,
          lastMessageData: nextMessage,
        };
      });
    };

    SocketService.socket?.on(receiveMessageEvent, handleReceiveMessage);

    return () => {
      SocketService.socket?.off(receiveMessageEvent, handleReceiveMessage);
    };
  }, [props.setActiveChat, user?.id]);

  useEffect(() => {
    if (!optimisticMessages.length) return;

    setOptimisticMessages((currentOptimistic) => {
      const unresolved = currentOptimistic.filter((optimisticMessage) => {
        return !serverMessages.some((serverMessage) => {
          if (serverMessage.userId !== optimisticMessage.message.userId) return false;
          if (serverMessage.message !== optimisticMessage.message.message) return false;

          const serverTime = DateTime.fromISO(serverMessage.createdAt);
          const optimisticTime = DateTime.fromISO(optimisticMessage.message.createdAt);

          if (!serverTime.isValid || !optimisticTime.isValid) {
            return false;
          }

          return Math.abs(serverTime.diff(optimisticTime, "seconds").seconds) <= 20;
        });
      });

      currentOptimistic.forEach((entry) => {
        const stillUnresolved = unresolved.some(
          (unresolvedEntry) => unresolvedEntry.message.id === entry.message.id,
        );
        if (!stillUnresolved) {
          clearMessageTimeout(entry.message.id);
        }
      });

      if (unresolved.length === currentOptimistic.length) {
        return currentOptimistic;
      }

      return unresolved;
    });
  }, [clearMessageTimeout, optimisticMessages.length, serverMessages]);

  const messages: ChatRenderMessage[] = useMemo(() => {
    const optimisticAsMessages: ChatRenderMessage[] = optimisticMessages.map((entry) => ({
      ...entry.message,
      _optimisticStatus: entry.status,
    }));
    const merged = [...serverMessages, ...optimisticAsMessages];

    return merged.sort((a, b) => {
      const aTime = DateTime.fromISO(a.createdAt).toMillis();
      const bTime = DateTime.fromISO(b.createdAt).toMillis();
      return aTime - bTime;
    });
  }, [optimisticMessages, serverMessages]);

  useEffect(() => {
    Object.keys(messageTimeoutsRef.current).forEach((messageId) => {
      clearMessageTimeout(messageId);
    });
    setOptimisticMessages([]);
  }, [clearMessageTimeout, props.activeChat?.id]);

  useEffect(() => {
    return () => {
      Object.keys(messageTimeoutsRef.current).forEach((messageId) => {
        clearMessageTimeout(messageId);
      });
    };
  }, [clearMessageTimeout]);

  function handleOptimisticSend(message: string) {
    if (!props.activeChat?.id || !user?.id) return;

    if (!emitMessage(message)) {
      toast({
        variant: "info",
        title: "Chat is currently unavailable",
        description: "Please try again later",
      });
      return;
    }

    const timestamp = new Date().toISOString();
    const optimisticMessage: ChatMessage = {
      id: `temp-${props.activeChat.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      chatId: props.activeChat.id,
      userId: user.id,
      message,
      isRead: true,
      isEdited: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setOptimisticMessages((prev) => [
      ...prev,
      {
        message: optimisticMessage,
        status: "pending",
      },
    ]);
    scheduleFailedTimeout(optimisticMessage.id);
  }

  function handleRetryOptimisticMessage(messageId: string) {
    const failedMessage = optimisticMessages.find(
      (entry) => entry.message.id === messageId,
    );
    if (!failedMessage) return;

    const didSend = emitMessage(failedMessage.message.message);
    if (!didSend) {
      toast({
        variant: "info",
        title: "Chat is currently unavailable",
        description: "Please try again later",
      });
      return;
    }

    const now = new Date().toISOString();
    setOptimisticMessages((prev) =>
      prev.map((entry) => {
        if (entry.message.id !== messageId) return entry;

        return {
          status: "pending",
          message: {
            ...entry.message,
            createdAt: now,
            updatedAt: now,
          },
        };
      }),
    );
    scheduleFailedTimeout(messageId);
  }

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
        py-2.5
        sm:px-6
        sm:py-3
        bg-primary
        rounded-[5px_5px_0_0]
        w-full
        relative
      `)}
      >
        <div className={"flex items-center gap-x-2.5 min-h-[32px]"}>
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
          <p className={"text-white text-xs sm:text-base font-semibold truncate"}>
            {name}
          </p>

          <p
            className={cn(`
              absolute 
              text-[9px] 
              sm:text-[10px]
              text-grey5
              left-1/2
              transform
              -translate-x-1/2
              -bottom-[28px]
            `)}
          >
            {DateTime.now().toFormat("LLL dd, yyyy")}
          </p>
        </div>
      </div>

      <ChatArea
        messages={messages}
        activeChat={props.activeChat}
        onRetryMessage={handleRetryOptimisticMessage}
      />

      <ChatInputArea
        activeChat={props.activeChat}
        isOwner={isOwner}
        onOptimisticSend={handleOptimisticSend}
      />
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
