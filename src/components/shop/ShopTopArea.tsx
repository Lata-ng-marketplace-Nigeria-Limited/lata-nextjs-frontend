import React from "react";
import HeaderText from "../atom/HeaderText";
import ProductStatusList from "./ProductStatus";
import { IProductStatusCount } from "@/interface/products";

interface Props {
  statusCounts: IProductStatusCount;
  status?: string;
}
const ShopTopArea = (props: Props) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sl:flex-row sl:items-center">
      <HeaderText title>My Shop</HeaderText>
      <ProductStatusList
        status={props?.status}
        statusCounts={props?.statusCounts}
      />
    </div>
  );
};

export default ShopTopArea;
