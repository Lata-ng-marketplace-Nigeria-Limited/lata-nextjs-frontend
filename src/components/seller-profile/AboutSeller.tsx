import { User } from "@/interface/user";
import MobileBorderArea from "@atom/MobileBorderArea";
import { cn } from "@/utils";
import HeaderText from "@atom/HeaderText";

interface Props {
  sellerInfo?: User | null;
}

export default function AboutSeller(props: Props) {
  return (
    <MobileBorderArea
      className={cn(
        `
        px-[10px]
        py-6
        sm:px-[20px]
        h-max
        w-full
      `,
      )}
      showBorderInDesktop
    >
      <HeaderText>About seller</HeaderText>

      <p className={"text-xs md:text-sm text-grey7"}>
        {props.sellerInfo?.aboutBusiness || "No information about seller"}
      </p>
    </MobileBorderArea>
  );
}
