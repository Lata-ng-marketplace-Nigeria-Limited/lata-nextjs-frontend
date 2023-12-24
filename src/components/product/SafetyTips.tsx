import { cn } from "@/utils";
import MobileBorderArea from "../atom/MobileBorderArea";
import ProductAsideHeader from "../atom/HeaderText";

export default function SafetyTips() {
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
      <ProductAsideHeader>Safety tips</ProductAsideHeader>

      <ul
        className={cn(`
        list-disc
        list-inside
        text-xs
        md:text-sm
        text-grey8
        flex
        flex-col
        gap-y-2
        md:gap-y-3
      `)}
      >
        <li>Meet seller at a safe place</li>
        <li>Check the items well before paying</li>
        <li>Don’t pay for items in advance</li>
        <li>Only pay when you are satisfied with the items</li>
      </ul>
    </MobileBorderArea>
  );
}
