"use client";

import Input, { InputProps } from "@atom/Input";
import React, { useCallback, useId, useState } from "react";
import { cn } from "@/utils";
import { PasswordEyeIcon } from "@atom/icons/PasswordEye";
import { PasswordEyeSlashIcon } from "@atom/icons/PasswordEyeSlash";
import Button from "@atom/Button";
import InputLabel from "@atom/InputLabel";
import Small from "@atom/Small";

export interface TextInputProps extends Omit<InputProps, "className"> {
  wrapperClass?: string;
  inputClass?: string;
  labelClass?: string;
  label?: string;
  errorMessage?: string;
  errorClass?: string;
  isPassword?: boolean;
}

const TextInput = React.forwardRef(
  (
    {
      isPassword,
      wrapperClass,
      inputClass,
      labelClass,
      label,
      errorClass,
      errorMessage,
      hideLabel,
      ...props
    }: TextInputProps,
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [type, setType] = useState<"password" | "text">("password");
    const id = useId();

    const handleFocus = useCallback(() => {
      setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setFocused(false);
    }, []);

    return (
      <div className={cn(`relative`, wrapperClass)}>
        <div className={"relative w-full"}>
          <Input
            {...props}
            ref={ref}
            type={isPassword ? type : props.type || "text"}
            className={cn(
              {
                "pr-[2.375rem] sm:pr-[2.625rem]": isPassword,
              },
              inputClass,
            )}
            id={props.id || id}
            onFocus={handleFocus}
            focused={focused}
            onBlur={handleBlur}
            label={label}
            hideLabel={hideLabel}
          />

          {isPassword ? (
            <Button
              format={"icon"}
              className={cn(`
              absolute
              right-3
              top-1/2
              transform
              -translate-y-1/2
            `)}
              onClick={() => {
                setType(type === "password" ? "text" : "password");
              }}
              type={"button"}
            >
              {type === "password" ? (
                <PasswordEyeIcon
                  className={cn(`w-[1.125rem] h-[1.125rem] sm:w-6 sm:h-6`)}
                />
              ) : (
                <PasswordEyeSlashIcon
                  className={cn(`w-[1.125rem] h-[1.125rem] sm:w-6 sm:h-6`)}
                />
              )}
            </Button>
          ) : null}
        </div>

        {!hideLabel && label ? (
          <InputLabel
            value={props.value}
            focused={focused}
            htmlFor={props.id || id}
            className={cn(
              { "text-primary": !!props.value || focused },
              labelClass,
            )}
          >
            {label}
          </InputLabel>
        ) : null}

        <Small
          className={cn(`text-danger text-[11px] sm:text-xs `, errorClass)}
        >
          {errorMessage}
        </Small>
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
