"use client";

import { cn } from "@/utils";
import Button from "@components/atom/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
  isDefaultActive?: boolean;
  query: string;
}
const BadgeWithCount = (props: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleClick = () => {
    if (props.query) {
      params.set("tab", props.query);
    } else {
      params.delete("tab");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const activeButtonVariant = () => {
    if (!params.get("tab") && props.isDefaultActive) return true;
    return params.get("tab") === props.query;
  };

  useEffect(() => {
    activeButtonVariant();
  }, []);

  return (
    <Button
      format="none"
      className={cn(
        props.className,
        {
          "bg-primary text-white hover:bg-primary hover:text-white":
            props.variant === "primary" &&
            // props.variant === props.activeVariant,
            activeButtonVariant(),
          "text-primary":
            props.variant === "primary" &&
            // props.variant !== props.activeVariant,
            !activeButtonVariant(),
        },
        {
          "bg-warning text-white hover:bg-warning hover:text-white":
            props.variant === "warning" &&
            // props.variant === props.activeVariant,
            activeButtonVariant(),
          "text-warning":
            props.variant === "warning" &&
            // props.variant !== props.activeVariant,
            !activeButtonVariant(),
        },
        {
          "bg-danger text-white hover:bg-danger hover:text-white":
            props.variant === "danger" &&
            //  props.variant === props.activeVariant,
            activeButtonVariant(),
          "text-danger":
            props.variant === "danger" &&
            // props.variant !== props.activeVariant,
            !activeButtonVariant(),
        },
        {
          "bg-grey9 text-white hover:bg-grey9 hover:text-white":
            props.variant === "normal" &&
            //  props.variant === props.activeVariant,
            activeButtonVariant(),
          "text-grey9":
            props.variant === "normal" &&
            // props.variant !== props.activeVariant,
            !activeButtonVariant(),
        },
        {
          "bg-success text-white hover:bg-success hover:text-white":
            props.variant === "success" &&
            // props.variant === props.activeVariant,
            activeButtonVariant(),
          "text-success":
            props.variant === "success" &&
            // props.variant !== props.activeVariant,
            !activeButtonVariant(),
        },
        "cursor-pointer capitalize outline-0",
      )}
      // onClick={props.onClick}
      onClick={handleClick}
    >{`${props.text}(${props.count || "0"})`}</Button>
  );
};

export default BadgeWithCount;
