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
        w-[70px] 
        h-[70px] 
        sm:w-[100px] 
        sm:h-[100px] 
        bg-purp3 
        flex 
        justify-center 
        items-center 
        cursor-pointer
        shrink-0
      `,
        {
          "rounded-full ": props.format === "profile",
          "rounded-[7px] h-[61px] sm:w-[130px] sm:h-[120px]":
            props.format === "product",
        },
        props.className,
      )}
      htmlFor={props.name || "upload-image"}
    >
      {props.children}
    </label>
  );
}
