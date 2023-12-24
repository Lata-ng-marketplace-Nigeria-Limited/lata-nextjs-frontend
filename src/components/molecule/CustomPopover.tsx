"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@/utils";

export type PopOverContentPropType =
  | React.ReactNode
  | (({ close }: { close: () => void }) => React.ReactNode);

interface Props {
  children: React.ReactNode;
  content: PopOverContentPropType;
  preventOutsideClickClose?: boolean;
  onTriggerClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  preventAutoFocus?: boolean;
  disabled?: boolean;
  triggerClass?: string;
}

export default function CustomPopover(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOutside = (event: Event) => {
    if (props.preventOutsideClickClose) {
      event.preventDefault();
      return;
    }
    setIsOpen(false);
  };

  const handleAutoFocus = (event: Event) => {
    if (props.preventAutoFocus) {
      event.preventDefault();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderContent = () => {
    if (typeof props.content === "function") {
      const content = props.content({ close: handleClose });
      return <>{content}</>;
    }
    return <>{props.content}</>;
  };
  return (
    <Popover open={isOpen}>
      <PopoverTrigger
        onClick={(e) => {
          props.onTriggerClick?.(e);
          setIsOpen(true);
        }}
        disabled={props.disabled}
        className={props.triggerClass}
        suppressHydrationWarning
      >
        {props.children}
      </PopoverTrigger>

      {props.content ? (
        <PopoverContent
          onPointerDownOutside={handleClickOutside}
          onOpenAutoFocus={handleAutoFocus}
          onEscapeKeyDown={handleClickOutside}
          className={cn(`
            rounded-[6px]
          `)}
        >
          {renderContent()}
        </PopoverContent>
      ) : (
        ""
      )}
    </Popover>
  );
}
