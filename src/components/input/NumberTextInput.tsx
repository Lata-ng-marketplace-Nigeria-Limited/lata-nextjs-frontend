"use client";

import TextInput, { TextInputProps } from "@components/input/TextInput";
import React, { useEffect, useRef } from "react";
import { checkIfInputNumber } from "@/utils";

interface NumberTextInputProps extends Omit<TextInputProps, "type"> {
  numberRangeStart?: number;
  numberRangeEnd?: number;
  limit?: number;
  onTyping?: () => void;
}

export const NumberTextInput = React.forwardRef(
  (
    {
      numberRangeStart,
      numberRangeEnd,
      limit,
      onTyping,
      onInput,
      onChange,
      setValue,
      maxLength,
      ...props
    }: NumberTextInputProps,
    ref,
  ) => {
    const inputRef = useRef<any>(null);

    useEffect(() => {
      if (!inputRef.current) return;
      if (!ref) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref = inputRef;
    }, [inputRef, ref]);

    const removeLastEntry = (e: any) => {
      if (!inputRef.current) return;
      inputRef.current!.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    };

    const handleNumberChange = (e: any) => {
      onTyping?.();
      //@ts-ignore
      onInput?.(e);
      //@ts-ignore
      onChange?.(e);
      if (!checkIfInputNumber(e.target.value)) removeLastEntry(e);

      if (numberRangeStart) {
        if (Number(e.target.value) < numberRangeStart!) removeLastEntry(e);
      }

      if (numberRangeEnd || numberRangeEnd === 0) {
        if (Number(e.target.value) > numberRangeEnd!) removeLastEntry(e);
      }

      if (limit && e.target.value.length > limit) removeLastEntry(e);

      setValue?.(e.target.value);
    };

    return (
      <TextInput
        {...props}
        onInput={handleNumberChange}
        onChange={handleNumberChange}
        maxLength={limit || maxLength}
        ref={inputRef}
        onWheel={() => {
          inputRef.current?.blur();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }}
      />
    );
  },
);

NumberTextInput.displayName = "NumberTextInput";
