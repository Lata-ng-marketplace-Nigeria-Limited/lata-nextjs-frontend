import React from "react";
import { cn } from "@/utils";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  focused: boolean;
}

export default function InputLabel({ focused, ...props }: Props) {
  return (
    <label
      {...props}
      className={cn(
        `
          absolute 
          hidden 
          text-primary 
          top-[2px]
          sm:top-[0.45rem]
          left-[1rem]
          text-[0.625rem]
          sm:text-xs
          pointer-events-none 
          `,
        {
          block: !!props.value || focused,
        },
        props.className,
      )}
    >
      {props.children}
    </label>
  );
}
