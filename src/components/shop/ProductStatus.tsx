import React from "react";
import BadgeWithCount from "../atom/BadgeWithCount";
import { IProductStatusCount } from "@/interface/products";

interface IProductStatusList {
  status?: string;
  statusCounts: IProductStatusCount;
}

export type IProductStatusType = "active" | "reviewing" | "denied" | "draft";

const ProductStatusList: React.FC<IProductStatusList> = (props) => {
  return (
    <div className="grid grid-cols-4 gap-4 sl:gap-6">
      <BadgeWithCount
        count={props?.statusCounts?.active}
        query="active"
        isDefaultActive
        className="max-xs:text-[10px]"
        variant="primary"
        text="active"
      />
      <BadgeWithCount
        count={props?.statusCounts?.reviewing}
        query="reviewing"
        className="max-xs:text-[10px]"
        text="reviewing"
        variant="warning"
      />
      <BadgeWithCount
        count={props?.statusCounts?.denied}
        query="denied"
        className="max-xs:text-[10px]"
        text="denied"
        variant="danger"
      />
      <BadgeWithCount
        count={props?.statusCounts?.draft + props?.statusCounts?.unsubscribed}
        query="draft"
        className="max-xs:text-[10px]"
        text="draft"
        variant="normal"
      />
    </div>
  );
};

export default ProductStatusList;
