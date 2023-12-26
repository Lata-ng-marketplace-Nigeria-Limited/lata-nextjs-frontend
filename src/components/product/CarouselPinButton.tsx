import { cn } from "@/utils";
import * as React from "react";

interface Props {
  label?: string;
  index: number;
  total: number;
  current: number;
  onClick?: () => void;
}
export default function CarouselPinButton(props: Props) {
  return (
    <button
      type="button"
      className={cn(
        "w-2 h-2 rounded-full aria-[current=true]:bg-primary bg-offwhite",
        {
          "bg-primary": props.index === props.current,
        },
      )}
      aria-current="false"
      aria-label={props.label || `Slide ${props.index + 1}`}
      data-carousel-slide-to={`${props.index}`}
      onClick={props.onClick}
    >
      <span className="sr-only">
        Product image {props.index + 1} of {props.total}
      </span>
    </button>
  );
}
