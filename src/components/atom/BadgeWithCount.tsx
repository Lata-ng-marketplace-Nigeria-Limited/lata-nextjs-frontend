import { cn } from "@/utils";
import Button from "./Button";

export type IProductStatusType = "active" | "reviewing" | "denied" | "draft";

interface Props {
  className?: string;
  status: IProductStatusType;
  count?: number | string;
  onClick?: () => void;
  activeStatus?: IProductStatusType;
}
const BadgeWithCount = (props: Props) => {
  return (
    <Button
      format="none"
      className={cn(
        props.className,
        { "hover:bg-purp1": props.status !== props.activeStatus },
        "cursor-pointer rounded-xl px-2 py-1 text-xs font-semibold capitalize sm:px-4 sm:py-1.5 sm:text-base tablet:px-6 tablet:py-3",
      )}
      onClick={props.onClick}
    >{`${props.status}(${props.count || "0"})`}</Button>
  );
};

export default BadgeWithCount;
