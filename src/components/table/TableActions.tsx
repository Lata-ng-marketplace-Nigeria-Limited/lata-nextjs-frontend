import React from "react";
import Button, { ButtonType } from "@atom/Button";
import { cn } from "@/utils";

interface Props {
  buttons: {
    label: React.ReactNode;
    onClick: () => void;
    format: ButtonType;
    className?: string;
  }[];
}

export default function TableActions({ buttons }: Props) {
  return (
    <div className={"flex flex-col gap-y-2"}>
      {buttons.map((button, i) => (
        <Button
          className={cn(
            `
              py-1 
              px-2 
              sm:py-1 
              sm:px-2 `,
            button.className,
          )}
          key={i}
          format={button.format}
          onClick={button.onClick}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}
