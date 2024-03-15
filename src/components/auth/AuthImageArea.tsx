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
        hidden 
        min-h-screen 
        w-full 
        items-center 
        justify-center
        bg-primary 
        sm:flex 
      `,
        props.wrapperClass,
      )}
    >
      <Image
        src={props.href}
        className={cn(
          "h-full max-h-screen object-contain lg:object-cover ",
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
