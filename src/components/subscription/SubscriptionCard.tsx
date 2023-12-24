import { cn } from "@/utils";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";

interface SubscriptionCardProps {
  imageSrc: string;
  name: string;
  bgColor: string;
  onClick?: () => void;
}

export default function SubscriptionCard(props: SubscriptionCardProps) {
  const isSm = useMediaQuery("(min-width: 640px)");
  return (
    <div
      className={cn(`
        flex 
        items-center 
        bg-[#1e0344] 
        h-[150px] 
        sm:h-[200px] 
        justify-center 
        sm:justify-start 
        xs:max-w-[366px]
        tablet:min-w-[260px]
        rounded-[10px]
        gap-x-3.5
        p-[20px]
        xlg:p-[30px]
        xl:p-[40px]
        cursor-pointer
    `)}
      onClick={props.onClick}
      style={{ backgroundColor: props.bgColor }}
    >
      <div className={"shrink-0"}>
        <Image
          src={props.imageSrc}
          className={cn(`rounded-full w-full h-full`)}
          alt={props.name}
          width={isSm ? 120 : 80}
          height={isSm ? 120 : 80}
        />
      </div>
      <div className={"text-white"}>
        <p className={"text-sm ms:text-lg"}>Run ads on</p>
        <p className={"text-sm tablet:text-xl font-semibold"}>{props.name}</p>
      </div>
    </div>
  );
}
