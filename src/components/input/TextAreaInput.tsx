import Textarea, { TextareaProps } from "@atom/Textarea";
import React, { useId, useState } from "react";
import { cn } from "@/utils";
import InputLabel from "@atom/InputLabel";
import Small from "@atom/Small";

interface Props extends Omit<TextareaProps, "class"> {
  wrapperClass?: string;
  inputClass?: string;
  labelClass?: string;
  label?: string;
  errorMessage?: string;
  errorClass?: string;
}

const TextAreaInput = React.forwardRef(
  (
    {
      wrapperClass,
      inputClass,
      labelClass,
      label,
      errorClass,
      errorMessage,
      hideLabel,
      ...props
    }: Props,
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const id = useId();

    const handleFocus = () => {
      setFocused(true);
    };

    const handleBlur = () => {
      setFocused(false);
    };

    return (
      <div className={cn("relative flex flex-col", wrapperClass)}>
        <Textarea
          {...props}
          className={inputClass}
          rows={props.rows || 5}
          cols={props.cols || 5}
          onFocus={handleFocus}
          onBlur={handleBlur}
          focused={focused}
          id={id}
          ref={ref as any}
          hideLabel={hideLabel}
        />

        {!hideLabel && label ? (
          <InputLabel
            value={props.value}
            htmlFor={id || props.name}
            focused={focused}
            className={cn(
              `
            bg-white
            top-[1px]
            sm:top-[1px]
            pt-[2px]
            sm:pt-[0.62rem]
            pl-[1rem]
            rounded-tl-md
            rounded-tr-md
            sm:w-[99%]
            w-[98%]
            left-[1px]
            `,
              labelClass,
            )}
          >
            {label}
          </InputLabel>
        ) : null}

        <Small className={cn(`text-danger`, errorClass)}>{errorMessage}</Small>
      </div>
    );
  },
);

TextAreaInput.displayName = "TextAreaInput";

export default TextAreaInput;
