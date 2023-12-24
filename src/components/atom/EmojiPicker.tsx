import React, { SetStateAction, useEffect } from "react";

export interface EmojiPickerProps {
  setValue: React.Dispatch<SetStateAction<string>>;
  inputRef?: HTMLInputElement | null;
}

interface EmojiClickEvent {
  detail: {
    unicode: string;
    skinTone: number;
    emoji: {
      annotation: string;
      group: number;
      order: number;
      shortcodes: string[];
      tags: string[];
      unicode: string;
      version: number;
    };
  };
}

export default function EmojiPicker(props: EmojiPickerProps) {
  useEffect(() => {
    document
      .querySelector("emoji-picker")
      ?.addEventListener("emoji-click", (event: any & EmojiClickEvent) => {
        const emoji = event.detail.unicode;
        const input = props.inputRef;
        if (input) {
          const cursorPosition = input.selectionStart!;
          const textBeforeCursorPosition = input.value.substring(
            0,
            cursorPosition,
          );
          const textAfterCursorPosition = input.value.substring(
            cursorPosition,
            input.value.length,
          );
          input.value =
            textBeforeCursorPosition + emoji + textAfterCursorPosition;
          input.selectionStart = cursorPosition + emoji.length;
          input.selectionEnd = cursorPosition + emoji.length;
          input.focus();
          props.setValue(input.value);
          return;
        }
        props.setValue((prev) => prev + emoji);
      });
  }, [props]);

  // @ts-ignore
  return <emoji-picker class={"light"}></emoji-picker>;
}
