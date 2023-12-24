import { ChatMessage, ChatUser } from "@/interface/chat";
import { useEffect, useState } from "react";
import { useUser } from "@hooks/useUser";
import { DateTime } from "luxon";
import { cn } from "@/utils";
import AppAvatar from "@molecule/Avatar";

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
  ref: any;
}

export default function MessagePreview(props: Props) {
  const [name, setName] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLastMessageRead, setIsLastMessageRead] = useState(true);
  const { user } = useUser();

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

  return (
    <div
      className={cn(
        `
          flex px-[11px] 
          sm:px-4 
          pt-1 
          gap-x-[5px] 
          sm:gap-x-[10px] 
          cursor-pointer 
          rounded-[10px]
          
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
        flex-col 
        w-full 
        gap-y-1.5 
        sm:gap-x-2
        pb-3
        border-b
        border-grey1
        
      `)}
      >
        <div
          className={cn("flex justify-between w-full gap-x-2", {
            "font-extrabold":
              props.lastMessageSender === "other" && !isLastMessageRead,
          })}
        >
          <p className={cn("text-[10px] sm:text-[12px]  text-grey8")}>{name}</p>
          <p className={"text-grey6 text-[6px] sm:text-[8px]"}>
            {lastMessageTime}
          </p>
        </div>
        <p
          className={cn("text-sm sm:text-sm xl:text-base text-grey11", {
            "font-extrabold":
              props.lastMessageSender === "other" && !isLastMessageRead,
          })}
        >
          {props.productName}
        </p>
        <p
          className={cn(
            "text-xs xl:text-sm text-grey8 leading-tight tracking-tight",
            {
              "font-extrabold":
                props.lastMessageSender === "other" && !isLastMessageRead,
            },
          )}
        >
          <span className={"capitalize"}>
            {props.lastMessageSender === "me"
              ? "You"
              : props.isOwnProduct
              ? "Buyer"
              : "Seller"}
          </span>
          : {props.lastMessage}
        </p>
      </div>
    </div>
  );
}
