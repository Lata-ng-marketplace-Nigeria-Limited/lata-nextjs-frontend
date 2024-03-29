import React from "react";
import { UploadImageFormat } from "@/interface/image";
import { cn } from "@/utils";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  format: UploadImageFormat;
  name?: string;
}
export default function UploadImageArea(props: Props) {
  return (
    <label
      {...props}
      className={cn(
        `
        flex 
        h-[70px] 
        w-[70px] 
        shrink-0 
        cursor-pointer 
        items-center 
        justify-center 
        sm:h-[100px]
        sm:w-[100px]
      `,
        {
          "rounded-full ": props.format === "profile",
          "h-[61px] rounded-[7px] sm:h-[120px] sm:w-[130px]":
            props.format === "product",
          "bg-purp3": props.format !== "blocked-account",
          "z-10 h-full w-full sm:h-full sm:w-full":
            props.format === "blocked-account",
        },
        props.className,
      )}
      htmlFor={props.name || "upload-image"}
    >
      {props.children}
    </label>
  );
}
