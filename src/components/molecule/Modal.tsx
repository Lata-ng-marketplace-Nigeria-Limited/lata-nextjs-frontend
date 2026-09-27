"use client";

import React, { Ref, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/utils";

interface Props {
  children: React.ReactNode;
  isShown: boolean;
  setIsShown: React.Dispatch<SetStateAction<boolean>>;
  modal?: boolean;
  id?: string;
  onOpenChange?: (open: boolean) => void;
  preventOverlayClose?: boolean;
  openModal?: boolean;
  contentClass?: string;
  hideCloseButton?: boolean;
}

export default function Modal(props: Props) {
  const [onMounted, setOnMounted] = useState(false);

  const handleEscapeClick = (event: KeyboardEvent) => {
    if (props.preventOverlayClose) {
      event.preventDefault();
      return;
    }
    props.setIsShown(false);
  };

  const handleClickOutside = (event: Event) => {
    event.preventDefault();
    if (props.preventOverlayClose) {
      event.preventDefault();
      return;
    }
    props.setIsShown(false);
  };

  const handleOpenChange = (open: boolean) => {
    props.setIsShown(open);
    props.onOpenChange?.(open);
  };

  useEffect(() => {
    if (onMounted) return;
    if (props.isShown) {
      setOnMounted(true);
    }
  }, [onMounted, props.isShown]);

  useEffect(() => {
    if (!onMounted) return;
    if (props.isShown) {
      props.onOpenChange?.(true);
    } else {
      props.onOpenChange?.(false);
    }
  }, [onMounted, props]);

  return (
    <Dialog
      open={props.isShown}
      modal={props.modal !== undefined ? props.modal : true}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onEscapeKeyDown={handleEscapeClick}
        hideCloseButton={props.hideCloseButton}
        className={cn(
          "rounded-[16px] overflow-y-auto max-h-[calc(100vh-16px)]",
          props.contentClass || "!w-[94vw] !max-w-[500px] bg-white p-4 sm:p-6"
        )}
      >
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
