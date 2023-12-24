import { cn } from "@/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  class?: string;
}

export default function ProductAsideArea(props: Props) {
  return (
    <div
      className={cn(
        `
          flex-col 
          flex 
          w-full 
          max-w-full 
          min-w-full 
          sm:min-w-[322px] 
          lg:min-w-[430px] 
          sm:max-w-[430px]
          gap-y-6
        `,
        props.class,
      )}
    >
      {props.children}
    </div>
  );
}
