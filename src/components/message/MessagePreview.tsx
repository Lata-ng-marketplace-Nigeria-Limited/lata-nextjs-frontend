import { ChatMessage, ChatUser } from "@/interface/chat";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { cn } from "@/utils";
import AppAvatar from "@molecule/Avatar";
import { UserRole } from "@/interface/user";

interface Props {
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  lastMessageSender: "me" | "other";
  unreadCount?: number;
  productName?: string;
  isOwnProduct: boolean;
  seller?: ChatUser;
  buyer?: ChatUser;
  chatId?: string;
  onClick?: () => void;
  isActive?: boolean;
  lastMessageData?: ChatMessage;
  senderRole?: UserRole;
  receiverRole?: UserRole;
  productId?: string;
  ref: any;
}

export default function MessagePreview(props: Props) {
  const [name, setName] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLastMessageRead, setIsLastMessageRead] = useState(true);

  useEffect(() => {
    if (props.isOwnProduct) {
      setName(props.buyer?.name || "");
      setProfilePicture(props.buyer?.avatar || "");
    } else {
      setName(props.seller?.name || "");
      setProfilePicture(props.seller?.avatar || "");
    }

    if (props.lastMessageTime) {
      const time = DateTime.fromISO(props.lastMessageTime).toFormat("HH:mm");
      setLastMessageTime(time);
    }
  }, [
    props.buyer?.avatar,
    props.buyer?.name,
    props.isOwnProduct,
    props.lastMessageTime,
    props.seller?.avatar,
    props.seller?.name,
  ]);

  useEffect(() => {
    if (!props.lastMessageData) return;
    setIsLastMessageRead(props.lastMessageData.isRead);
  }, [props.lastMessageData]);

  const lastMessageSender = () => {
    return props.lastMessageSender === "me"
      ? "You"
      : props.receiverRole?.toLowerCase();
  };

  return (
    <div
      className={cn(
        `
          flex cursor-pointer 
          gap-x-[5px] 
          rounded-[10px] 
          px-[11px] 
          pt-1 
          sm:gap-x-[10px] 
          sm:px-4
          
        `,
        {
          "bg-offwhite": props.isActive,
        },
      )}
      onClick={props.onClick}
      ref={props.ref}
    >
      <div className={"grid place-items-center"}>
        <AppAvatar name={name} src={profilePicture} type={"message"} />
      </div>

      <div
        className={cn(`
        flex 
        w-full 
        flex-col 
        gap-y-1.5 
        border-b
        border-grey1
        pb-3
        sm:gap-x-2
        
      `)}
      >
        <div
          className={cn("flex w-full justify-between gap-x-2", {
            "font-extrabold":
              props.lastMessageSender === "other" && !isLastMessageRead,
          })}
        >
          <p className={cn("text-[10px] text-grey8  sm:text-[12px]")}>{name}</p>
          <p className={"text-[6px] text-grey6 sm:text-[8px]"}>
            {lastMessageTime}
          </p>
        </div>
        <p
          className={cn("text-sm text-grey11 sm:text-sm xl:text-base", {
            "font-extrabold":
              props.lastMessageSender === "other" && !isLastMessageRead,
          })}
        >
          {props.productName}
        </p>
        <p
          className={cn(
            "text-xs leading-tight tracking-tight text-grey8 xl:text-sm",
            {
              "font-extrabold":
                props.lastMessageSender === "other" && !isLastMessageRead,
            },
          )}
        >
          <span className={"capitalize"}>{lastMessageSender()}</span>:{" "}
          {props.lastMessage}
        </p>
      </div>
    </div>
  );
}
