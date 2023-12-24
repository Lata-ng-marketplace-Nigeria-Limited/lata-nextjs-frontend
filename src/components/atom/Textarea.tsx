import React, { SetStateAction } from "react";
import { cn } from "@/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  setValue?: React.Dispatch<SetStateAction<string>>;
  className?: string;
  hideLabel?: boolean;
  focused?: boolean;
  value?: string;
  label?: string;
}

const Textarea = React.forwardRef(
  (
    {
      setValue,
      className,
      hideLabel,
      focused,
      value,
      label,
      ...props
    }: TextareaProps,
    ref,
  ) => {
    return (
      <textarea
        {...props}
        ref={ref as any}
        className={cn(
          `
          h-[3.125rem]
          sm:h-[4.375rem]
          px-4
          w-full
          rounded-md
          outline-none
          text-xs
          sm:text-sm
          text-grey9
          placeholder:text-grey5
          border
          border-solid
          border-grey5
          hover:border-grey7
          resize-none
          caret-primary
          py-[0.62rem]
          disabled:bg-grey1
          disabled:cursor-not-allowed
          `,
          {
            "border-primary hover:border-primary focus:border-primary active:border-primary":
              !!value || focused,
            "pt-3.5 sm:pt-[22px]": label && !hideLabel && (!!value || focused),
          },
          className,
        )}
        placeholder={!!value || focused ? "" : props.placeholder}
        name={props.name || label}
        onChange={(e) => {
          // @ts-ignore
          props.onChange?.(e);
          setValue?.(e.target.value);
        }}
        defaultValue={value}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
