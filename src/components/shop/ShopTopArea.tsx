"use client";

import React from "react";
import HeaderText from "../atom/HeaderText";
import ProductStatusList from "./ProductStatus";
import { IProductStatusCount } from "@/interface/products";
import { User } from "@/interface/user";
import { useUser } from "@/hooks/useUser";

interface Props {
  statusCounts: IProductStatusCount;
  status?: string;
  seller?: User;
}
const ShopTopArea = (props: Props) => {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-start justify-between gap-4 sl:flex-row sl:items-center">
      <HeaderText title>
        {user?.role === "ADMIN" ? `${props.seller?.name} ` : "My "} Shop
      </HeaderText>
      <ProductStatusList
        status={props?.status}
        statusCounts={props?.statusCounts}
      />
    </div>
  );
};

export default ShopTopArea;
