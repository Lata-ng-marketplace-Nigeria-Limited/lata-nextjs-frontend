import { Chat } from "@/interface/chat";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@hooks/useUser";
import SocketService from "@/service/SocketService";
import { useToast } from "@components/ui/use-toast";
import { cn } from "@/utils";
import Button from "@atom/Button";
import { PaperPlaneRightIcon } from "@atom/icons/PaperPlaneRight";
import TextInput from "@components/input/TextInput";
import EmojiPopover from "@components/input/EmojiPopover";
import { EmojiIcon } from "@atom/icons/Emoji";

interface Props {
  activeChat: Chat | undefined;
  isOwner: boolean;
}

export default function ChatInputArea(props: Props) {
  const [message, setMessage] = useState("");
  const { user, isSocketConnected } = useUser();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isSocketConnected) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isSocketConnected]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message) return;
    const otherUserId = props.isOwner
      ? props.activeChat?.sender?.id
      : props.activeChat?.receiver?.id;
    setLoading(true);
    SocketService.socket?.emit(`send:message` + user?.id, {
      chatId: props.activeChat?.id,
      message: message,
      userId: user?.id,
      otherUserId,
    });
    SocketService.socket?.on(`receive:chat-message` + user?.id, () => {
      setLoading(false);
      setMessage("");
    });
  }

  return (
    <form
      className={cn(`
          bg-primary 
          flex 
          items-center 
          gap-x-3 
          px-2.5 
          sm:px-6 
          py-3.5 
          sm:py-4
          rounded-[5px]
          
          `)}
      onSubmit={handleSubmit}
    >
      <EmojiPopover
        disabled={loading}
        inputRef={inputRef.current}
        setValue={setMessage}
      >
        <EmojiIcon className={"w-4 h-4 sm:w-6 sm:h-6"} />
      </EmojiPopover>

      <div className={"w-full relative"}>
        <TextInput
          value={message}
          setValue={setMessage}
          placeholder={"Type a message"}
          wrapperClass={"w-full"}
          inputClass={cn("disabled:border-transparent")}
          disabled={loading}
          ref={inputRef}
        />
        <div
          className={cn(
            `
            w-full 
            h-full 
            bg-transparent 
            absolute 
            top-0 
            left-0
          `,
            {
              hidden: !loading,
            },
          )}
          onClick={() => {
            toast({
              variant: "info",
              title: "Chat is currently unavailable",
              description: "Please try again later",
            });
          }}
        />
      </div>

      <Button
        format={"icon"}
        className={cn({
          hidden: !message,
        })}
        disabled={loading}
      >
        <PaperPlaneRightIcon
          className={cn("w-4 h-4 sm:w-6 sm:h-6")}
          pathClass={"fill-grey5"}
        />
      </Button>
    </form>
  );
}
