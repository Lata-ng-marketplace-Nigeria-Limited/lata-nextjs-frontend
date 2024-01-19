import { SubCategory, SubCategoryItems } from "@/interface/products";
import React from "react";

interface Props {
  subcategory: SubCategory;
  handleClick?: () => void;
}

const Subcategory = ({ subcategory, handleClick }: Props) => {
  return (
    <div
      className="overflow-y-auto bg-white rounded-md shadow-black/15 max-w-max"
      onClick={handleClick}
    >
      {JSON.parse(subcategory?.items).map(
        (item: SubCategoryItems, index: number) => (
          <div
            className="cursor-pointer border-b border-grey2 p-3 hover:bg-purp1"
            key={index}
          >
            <p>{item?.label}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Subcategory;
