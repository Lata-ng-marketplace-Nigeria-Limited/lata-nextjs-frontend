"use client";

import React from "react";
import BadgeWithCount, { IProductStatusType } from "../atom/BadgeWithCount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IProductStatusCount } from "@/interface/products";

interface IProductStatusList {
  status?: string;
  statusCounts: IProductStatusCount;
}

const ProductStatusList: React.FC<IProductStatusList> = (props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (status: IProductStatusType) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status", status);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-6">
      <BadgeWithCount
        status="active"
        count={props?.statusCounts?.active}
        className={`${
          props?.status === "active" || !props?.status
            ? "bg-primary text-white"
            : "text-primary"
        }`}
        onClick={() => handleClick("active")}
      />
      <BadgeWithCount
        status="reviewing"
        count={props?.statusCounts?.reviewing}
        className={`${
          props?.status === "reviewing"
            ? "bg-warning text-white"
            : "text-warning"
        }`}
        onClick={() => handleClick("reviewing")}
      />
      <BadgeWithCount
        status="denied"
        count={props?.statusCounts?.denied}
        className={`${
          props?.status === "denied" ? "bg-danger text-white" : "text-danger"
        }`}
        onClick={() => handleClick("denied")}
      />
      <BadgeWithCount
        status="draft"
        count={props?.statusCounts?.draft}
        className={`${
          props.status === "draft" ? "bg-grey9 text-white" : "text-grey9"
        }`}
        onClick={() => handleClick("draft")}
      />
    </div>
  );
};

export default ProductStatusList;
