import { cn } from "@/utils";
import Image from "next/image";

interface Props {
  href: string;
  wrapperClass?: string;
  imgClass?: string;
}

export default function AuthImageArea(props: Props) {
  return (
    <section
      className={cn(
        `
        w-full 
        bg-primary 
        min-h-screen 
        items-center 
        justify-center
        hidden 
        sm:flex 
      `,
        props.wrapperClass,
      )}
    >
      <Image
        src={props.href}
        className={cn(
          "max-h-screen h-full object-contain lg:object-cover ",
          props.imgClass,
        )}
        alt={"lata"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "100%" }} // optional
      />
    </section>
  );
}
