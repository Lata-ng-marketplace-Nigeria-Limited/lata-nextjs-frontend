"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils";
import style from "./styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSideMenuStore } from "@/store/states/sideMenuState";
import { useLocalStore } from "@/store/states/localStore";
import {
  DASHBOARD_MESSAGES_ROUTE,
  DASHBOARD_NOTIFICATIONS_ROUTE,
} from "@/constants/routes";

interface NavLinkProps {
  href: string;
  wrapperClass?: string;
  iconAreaClass?: string;
  iconClass?: string;
  textClass?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fill?: boolean;
}

export default function NavLink(props: NavLinkProps) {
  const pathname = usePathname();
  const [showDot, setShowDot] = useState(false);
  const { setIsOpen } = useSideMenuStore();
  const { chats, user } = useLocalStore();

  useEffect(() => {
    setShowDot(false);
    if (props.href === DASHBOARD_MESSAGES_ROUTE) {
      if (!chats?.length) return;
      const unreadChat = chats?.find(
        (chat) =>
          chat.lastMessageData?.isRead === false &&
          chat.lastMessageSenderId !== user?.id,
      );
      if (!unreadChat) return;
      setShowDot(true);
      return;
    }

    if (props.href === DASHBOARD_NOTIFICATIONS_ROUTE) {
      if (user?.notifications.length) {
        setShowDot(true);
      }
    }
  }, [chats, pathname, props.href, user?.id, user?.notifications.length]);

  return (
    <Link
      href={props.href}
      onClickCapture={() => {
        setIsOpen(false);
      }}
      className={cn(
        `
        hover:bg-purp2
        
        flex
        w-full
        px-3
        sm:px-6
        py-1.5
        items-center
        gap-x-3
        max-h-[44px]
        rounded-md
        
        `,
        {
          "bg-purp2 group text-primary": pathname === props.href,
        },
        style["nav-link"],
        props.wrapperClass,
      )}
    >
      <span
        className={cn(
          `
          w-8 
          h-8
          rounded-full
          bg-neutral-100
          flex
          items-center
          justify-center
          relative
          
          after:absolute
          after:top-0
          after:left-0
          after:contents-['']
          after:w-1.5
          after:h-1.5
          after:rounded-full
          after:bg-red-500 
          text-grey9
                  
        `,

          {
            [style["nav-link-icon-fill"]]: props.fill,
            [style["nav-link-icon-stroke"]]: !props.fill,
            [style["active"]]: pathname === props.href && props.fill,
            [style["active"]]: pathname === props.href && !props.fill,
            "text-primary": pathname === props.href,
            "after:block": showDot,
            "after:hidden": !showDot,
          },
          props.iconAreaClass,
        )}
      >
        {props.icon}
      </span>

      <span
        className={cn(
          `
            text-[13px]
            xl:text-sm
          `,
          {
            "text-primary": pathname === props.href,
          },
          props.textClass,
        )}
      >
        {props.children}
      </span>
    </Link>
  );
}
