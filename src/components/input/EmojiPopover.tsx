import CustomPopover from "@molecule/CustomPopover";
import EmojiPicker, { EmojiPickerProps } from "@atom/EmojiPicker";
import React from "react";

interface Props extends EmojiPickerProps {
  children: React.ReactNode;
  disabled?: boolean;
}
export default function EmojiPopover(props: Props) {
  return (
    <CustomPopover
      content={({ close }) => (
        <EmojiPicker inputRef={props.inputRef} setValue={props.setValue} />
      )}
      onTriggerClick={() => {
        const input = props.inputRef;
        if (input) {
          input.focus();
        }
      }}
      preventAutoFocus
      disabled={props.disabled}
    >
      {props.children}
    </CustomPopover>
  );
}
