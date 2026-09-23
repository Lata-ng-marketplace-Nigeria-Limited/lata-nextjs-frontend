import { ChatMessage, ChatUser } from "@/interface/chat";
import { forwardRef } from "react";
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
}

const MessagePreview = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const name = props.isOwnProduct
    ? props.buyer?.name || "Unknown user"
    : props.seller?.name || "Unknown user";
  const profilePicture = props.isOwnProduct
    ? props.buyer?.avatar || ""
    : props.seller?.avatar || "";
  const lastMessageTime = props.lastMessageTime
    ? DateTime.fromISO(props.lastMessageTime).toFormat("HH:mm")
    : "";
  const isLastMessageRead = props.lastMessageData?.isRead ?? true;
  const senderLabel =
    props.lastMessageSender === "me"
      ? "You"
      : props.senderRole?.toLowerCase() || "user";
  const showUnread = props.lastMessageSender === "other" && !isLastMessageRead;

  // Determine intelligent title instead of showing generic "Untitled product"
  const displayTitle = (() => {
    if (
      props.productName &&
      props.productName.trim() &&
      props.productName.toLowerCase() !== "untitled product"
    ) {
      return props.productName;
    }

    const messageStr = props.lastMessage || "";
    const requestMatch = messageStr.match(/request for ["']([^"']+)["']/i);
    if (requestMatch && requestMatch[1]) {
      return `Request: ${requestMatch[1]}`;
    }

    return "Product Inquiry";
  })();

  return (
    <div
      className={cn(
        `
          flex cursor-pointer 
          gap-x-2.5
          rounded-[10px] 
          px-2.5
          py-2
          sm:gap-x-[10px] 
          sm:px-4
          transition-colors
          hover:bg-offwhite/80
          
        `,
        {
          "bg-offwhite": props.isActive,
        },
      )}
      onClick={props.onClick}
      ref={ref}
    >
      <div className={"grid place-items-center"}>
        <AppAvatar name={name} src={profilePicture} type={"message"} />
      </div>

      <div
        className={cn(`
        flex 
        w-full 
        flex-col 
        gap-y-1 
        border-b
        border-grey1
        pb-2.5
        sm:gap-x-2
      `)}
      >
        <div
          className={cn("flex w-full justify-between items-center gap-x-2", {
            "font-extrabold": showUnread,
          })}
        >
          <p className={cn("text-xs font-semibold text-grey11 sm:text-sm xl:text-base truncate", { "font-extrabold text-gray-900": showUnread })}>
            {name}
          </p>
          <div className={"flex items-center gap-x-1.5 shrink-0"}>
            {showUnread ? <span className={"h-1.5 w-1.5 rounded-full bg-primary"} /> : null}
            <p className={"text-[9px] text-grey6 sm:text-[11px]"}>
              {lastMessageTime}
            </p>
          </div>
        </div>
        <p
          className={cn(
            "text-xs leading-tight tracking-tight text-grey8 xl:text-sm truncate",
            {
              "font-semibold text-gray-800": showUnread,
            },
          )}
          title={props.lastMessage || ""}
        >
          <span className={"capitalize"}>{senderLabel}</span>: {props.lastMessage}
        </p>
      </div>
    </div>
  );
});

MessagePreview.displayName = "MessagePreview";

export default MessagePreview;
