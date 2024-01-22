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
  maxWidth?: string;
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
      onOpenChange={props.onOpenChange}
    >
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onEscapeKeyDown={handleEscapeClick}
        className={cn(
          "rounded-[6px] overflow-y-auto max-w-fit max-h-[calc(100vh-16px)] px-[16px] py-[12px] sm:px-[40px] sm:py-[24px] w-fit",
          props.contentClass
        )}
        style={{
          maxWidth: props.maxWidth ?? "fit-content",
        }}
      >
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
