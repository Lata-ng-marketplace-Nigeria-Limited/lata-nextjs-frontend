import { cn } from "@/utils";
import Image from "next/image";
import { IMAGE_BLUR_URL } from "@/constants/others";

interface Props {
  src: string;
  alt: string;
  wrapperClass?: string;
  imgClass?: string;
}

export default function HeroImage(props: Props) {
  return (
    <div
      className={cn(
        `
        h-[8.125rem]
        xms:h-[10rem]
        xls:h-[11.25rem]
        xs:h-[14.375rem]
        sm:h-[16.875rem]
        tablet:h-[15rem]
        sl:h-[18.75rem]
        lg:h-[20.3125rem]
        xlg:h-[21.875rem]
        xl:h-[24.375rem]
    `,
        props.wrapperClass,
      )}
    >
      <Image
        className={cn("w-full h-full", props.imgClass)}
        src={props.src}
        alt={props.alt}
        width={1162}
        height={400}
        priority
        placeholder={"blur"}
        blurDataURL={IMAGE_BLUR_URL}
      />
    </div>
  );
}
