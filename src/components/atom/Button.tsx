import { cn } from "@/utils";
import React from "react";
import Link from "next/link";

export type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "link"
  | "icon";

type AsButton = {
  as?: "button";
};

type AsLink = {
  as?: "link";
  href: string;
};

export type ButtonProp = {
  format: ButtonType;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  (AsButton | AsLink);

const Button = React.forwardRef(({ as, format, ...props }: ButtonProp, ref) => {
  const componentProps = {
    ref: ref as any,
    ...props,
    className: cn(
      {
        [`
            rounded-xl 
            font-semibold 
            py-1 
            px-4 
            sm:py-3 
            sm:px-6 
            transition-all 
            hover:bg-bleached-silk
          `]: format !== "link",
      },
      {
        [`
            text-primary 
            text-xs 
            sm:text-sm
            disabled:opacity-30 
          `]: format === "link",
      },
      {
        [`
            border-primary 
            bg-primary 
            text-white 
            border 
            border-solid 
            hover:bg-purp8 
            active:bg-purp8 
            disabled:bg-purp3 
            disabled:border-purp3
          `]: format === "primary",
        [`
            border-primary  
            text-primary 
            border 
            border-solid 
            active:bg-purp2 
            disabled:border-snow-bank 
            disabled:text-snow-bank 
            disabled:bg-purp2
          `]: format === "secondary" || format === "danger",
        "border-danger text-danger": format === "danger",
        [`
            text-primary 
            active:bg-snow-bank 
            disabled:text-purp2 
            disabled:hover:bg-transparent 
            disabled:active:bg-transparent
          `]: format === "tertiary",
        [`
            p-0 
            sm:p-0
            relative
            after:contents['']
            after:absolute
            after:-top-[8px]
            after:-left-[5px]
            hover:bg-transparent
            
            after:w-[190%]
            after:h-[200%]
            after:bg-transparent
            
          `]: format === "icon",
      },
      props.className,
    ),
  };

  return (
    <>
      {as === "link" ? (
        <Link {...(componentProps as any)}>{props.children}</Link>
      ) : (
        <button {...componentProps}>{props.children}</button>
      )}
    </>
  );
});

Button.displayName = "Button";

export default Button;
