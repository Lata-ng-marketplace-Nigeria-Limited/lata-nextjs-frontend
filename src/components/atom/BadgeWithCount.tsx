import { cn } from "@/utils";
import Button from "./Button";

export type IBadgeWithCountVariants =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "normal";

interface Props {
  className?: string;
  count: number | string;
  variant: IBadgeWithCountVariants;
  text: string;
  onClick?: () => void;
  activeVariant?: IBadgeWithCountVariants;
}
const BadgeWithCount = (props: Props) => {
  return (
    <Button
      format="none"
      className={cn(
        props.className,
        {
          "bg-primary text-white hover:bg-primary hover:text-white":
            props.variant === "primary" &&
            props.variant === props.activeVariant,
          "text-primary":
            props.variant === "primary" &&
            props.variant !== props.activeVariant,
        },
        {
          "bg-warning text-white hover:bg-warning hover:text-white":
            props.variant === "warning" &&
            props.variant === props.activeVariant,
          "text-warning":
            props.variant === "warning" &&
            props.variant !== props.activeVariant,
        },
        {
          "bg-danger text-white hover:bg-danger hover:text-white":
            props.variant === "danger" && props.variant === props.activeVariant,
          "text-danger":
            props.variant === "danger" && props.variant !== props.activeVariant,
        },
        {
          "bg-grey9 text-white hover:bg-grey9 hover:text-white":
            props.variant === "normal" && props.variant === props.activeVariant,
          "text-grey9":
            props.variant === "normal" && props.variant !== props.activeVariant,
        },
        "cursor-pointer capitalize",
      )}
      onClick={props.onClick}
    >{`${props.text}(${props.count || "0"})`}</Button>
  );
};

export default BadgeWithCount;
