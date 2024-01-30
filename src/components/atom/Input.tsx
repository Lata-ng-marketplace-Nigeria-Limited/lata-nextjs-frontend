import { cn } from "@/utils";
import React, { SetStateAction } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue?: React.Dispatch<SetStateAction<string>>;
  focused?: boolean;
  hideLabel?: boolean;
  label?: string;
  value?: string | any;
  ignoreBorderDefaultStyle?: boolean;
}

const Input = React.forwardRef(
  (
    {
      setValue,
      focused,
      hideLabel,
      label,
      ignoreBorderDefaultStyle,
      ...props
    }: InputProps,
    ref,
  ) => {
    return (
      <input
        {...props}
        ref={ref as any}
        className={cn(
          `
          h-12 
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
          caret-primary
          disabled:bg-grey1
          disabled:cursor-not-allowed
          
          `,
          {
            "border-primary hover:border-primary focus:border-primary active:border-primary ":
              (!!props.value || focused) && !ignoreBorderDefaultStyle,
            "pt-4 sm:pt-6": label && !hideLabel && (!!props.value || focused),
          },
          props.className,
        )}
        placeholder={!!props.value || focused ? "" : props.placeholder}
        name={props.name || label}
        onChange={(e) => {
          props.onChange?.(e);
          setValue?.(e.target.value);
        }}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
