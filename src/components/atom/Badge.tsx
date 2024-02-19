import { cn } from "@/utils";
import Button from "@components/atom/Button";

export type IBadgeVariants =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "normal";

interface Props {
  className?: string;
  variant: IBadgeVariants;
  text: string;
  onClick?: () => void;
  activeVariant?: IBadgeVariants;
}
const Badge = (props: Props) => {
  return (
    <Button
      format="none"
      className={cn(
        props.className,
        {
          "bg-primary text-white hover:bg-primary hover:text-white":
            props.variant === "primary",
        },
        {
          "bg-warning text-white hover:bg-warning hover:text-white":
            props.variant === "warning",
        },
        {
          "bg-danger text-white hover:bg-danger hover:text-white":
            props.variant === "danger",
        },
        {
          "bg-grey9 text-white hover:bg-grey9 hover:text-white":
            props.variant === "normal",
        },
        {
          "bg-success text-white hover:bg-success hover:text-white":
            props.variant === "success",
        },
        "cursor-pointer rounded-[0.3125rem] !p-1 text-xs font-medium capitalize",
      )}
      onClick={props.onClick}
    >
      {props.text.toLowerCase()}
    </Button>
  );
};

export default Badge;
