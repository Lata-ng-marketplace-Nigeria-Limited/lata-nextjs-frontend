import "flowbite";
import "flowbite-react";
import { useEffect } from "react";
import { cn } from "@/utils";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imageClass?: string;
}

export default function CarouselItem(props: Props) {
  useEffect(() => {
    window.initCarousels();
  }, []);

  return (
    <div
      className={cn(
        "hidden bg-white w-full h-full ease-in-out",
        props.className,
      )}
      data-carousel-item
    >
      <img
        src={props.src}
        className={cn(
          "absolute rounded-[12px] w-full h-full object-contain block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",
          props.imageClass,
        )}
        alt={props.alt}
        // width={100}
        // height={100}
        // layout="fill"
        // objectFit={"contain"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
