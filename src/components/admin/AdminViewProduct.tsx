import React from "react";
import { ViewProduct } from "../product/ViewProduct";

interface Props {
  id: string;
}
const AdminViewProduct = async (props: Props) => {
  return <ViewProduct id={props?.id} />;
};

export default AdminViewProduct;
