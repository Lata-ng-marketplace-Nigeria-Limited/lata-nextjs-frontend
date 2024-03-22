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
            props.variant === "primary" && activeButtonVariant(),
          "text-primary": props.variant === "primary" && !activeButtonVariant(),
        },
        {
          "bg-warning text-white hover:bg-warning hover:text-white":
            props.variant === "warning" && activeButtonVariant(),
          "text-warning": props.variant === "warning" && !activeButtonVariant(),
        },
        {
          "bg-danger text-white hover:bg-danger hover:text-white":
            props.variant === "danger" && activeButtonVariant(),
          "text-danger": props.variant === "danger" && !activeButtonVariant(),
        },
        {
          "bg-grey9 text-white hover:bg-grey9 hover:text-white":
            props.variant === "normal" && activeButtonVariant(),
          "text-grey9": props.variant === "normal" && !activeButtonVariant(),
        },
        {
          "bg-success text-white hover:bg-success hover:text-white":
            props.variant === "success" && activeButtonVariant(),
          "text-success": props.variant === "success" && !activeButtonVariant(),
        },
        "cursor-pointer capitalize outline-0",
      )}
      onClick={handleClick}
    >{`${props.text}(${props.count || "0"})`}</Button>
  );
};

export default BadgeWithCount;
