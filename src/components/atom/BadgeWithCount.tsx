import { cn } from "@/utils";

export type IProductStatusType = "active" | "reviewing" | "denied" | "draft";

interface Props {
  className?: string;
  status: IProductStatusType;
  count?: number | string;
  onClick?: () => void
}
const BadgeWithCount = (props: Props) => {
  return (
    <p
      className={cn(
        props.className,
        " capitalize cursor-pointer rounded-xl px-6 py-2 text-base font-semibold",
      )}
      onClick={props.onClick}
    >{`${props.status}(${props.count || "0"})`}</p>
  );
};

export default BadgeWithCount;
