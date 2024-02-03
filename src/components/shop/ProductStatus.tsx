"use client";

import React from "react";
import BadgeWithCount, {
  IBadgeWithCountVariants,
} from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IProductStatusCount } from "@/interface/products";

interface IProductStatusList {
  status?: string;
  statusCounts: IProductStatusCount;
}

export type IProductStatusType = "active" | "reviewing" | "denied" | "draft";

const ProductStatusList: React.FC<IProductStatusList> = (props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = new URLSearchParams(searchParams);
  const handleClick = (status: IProductStatusType) => {
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status", status);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const activeButtonVariant = (): IBadgeWithCountVariants => {
    switch (params.get("status")) {
      case "active":
        return "primary";

      case "reviewing":
        return "warning";

      case "denied":
        return "danger";

      case "draft":
        return "normal";

      default:
        return "primary";
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 sl:gap-6">
      <BadgeWithCount
        count={props?.statusCounts?.active}
        activeVariant={activeButtonVariant()}
        className="max-xs:text-[10px]"
        variant="primary"
        text="active"
        onClick={() => handleClick("active")}
      />
      <BadgeWithCount
        count={props?.statusCounts?.reviewing}
        activeVariant={activeButtonVariant()}
        className="max-xs:text-[10px]"
        text="reviewing"
        variant="warning"
        onClick={() => handleClick("reviewing")}
      />
      <BadgeWithCount
        count={props?.statusCounts?.denied}
        activeVariant={activeButtonVariant()}
        className="max-xs:text-[10px]"
        text="denied"
        variant="danger"
        onClick={() => handleClick("denied")}
      />
      <BadgeWithCount
        count={props?.statusCounts?.draft + props?.statusCounts?.unsubscribed}
        activeVariant={activeButtonVariant()}
        className="max-xs:text-[10px]"
        text="draft"
        variant="normal"
        onClick={() => handleClick("draft")}
      />
    </div>
  );
};

export default ProductStatusList;
