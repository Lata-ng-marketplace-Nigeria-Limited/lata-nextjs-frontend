import React from "react";
import { cn } from "@/utils";

interface MobileBorderAreaProps {
  children: React.ReactNode;
  removeBorder?: boolean;
  showBorderInDesktop?: boolean;
  className?: string;
  removePadding?: boolean;
}

export default function MobileBorderArea(props: MobileBorderAreaProps) {
  return (
    <div
      className={cn(
        "h-full",
        {
          [`
            rounded-[10px]    
            border 
            border-gray-200 
            gap-y-6 
          `]: !props.removeBorder,
          [`
            p-3
            xls:p-4
            xs:p-6
          `]: !props.removePadding,
        },

        {
          "sm:border-none sm:rounded-none sm:gap-y-0 sm:p-0":
            !props.showBorderInDesktop,
        },
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
