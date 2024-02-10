import React from "react";
import { ViewProduct } from "@components/product/ViewProduct";

const page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <div>
      <ViewProduct id={params.id} />
    </div>
  );
};

export default page;
