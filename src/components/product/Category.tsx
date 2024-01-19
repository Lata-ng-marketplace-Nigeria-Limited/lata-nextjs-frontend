"use client";

import Image from "next/image";
import React from "react";
import CustomPopover from "@components/molecule/CustomPopover";
import Subcategory from "@components/product/Subcategory";
import { Category } from "@/interface/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  data: Category;
  onModalClose?: () => void;
}

const Category = ({ data, onModalClose }: Props) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const handleSubcategoryChange = () => {
    const subCategoryId = data?.subcategories?.[0]?.id;
    const params = new URLSearchParams(searchParams);
    if (data?.id) {
      params.set("category", data?.id);
      params.set("subcategory", subCategoryId);
    } else {
      params.delete("category");
      params.delete("subcategory");
    }
    replace(`${pathname}?${params.toString()}`);

    onModalClose?.();
  };

  return (
    <CustomPopover
      side="left"
      contentClass={'w-fit'}
      isModalMode
      content={
        <Subcategory
          subcategory={data?.subcategories?.[0]}
          handleClick={handleSubcategoryChange}
        />
      }
    >
      <div className="cursor-pointer">
        <div className="mb-3 flex items-center justify-center rounded-lg bg-purp1 px-2 py-5 min-h-[4.375rem] min-w-[4.375rem]">
          <Image
            src={data?.image}
            width={58}
            height={31}
            alt={`${data?.subcategories?.[0]?.displayName} image`}
          />
        </div>
        <div className="flex justify-center">
        <p className="text-sm font-semibold text-grey9">
          {data?.subcategories?.[0]?.displayName}
        </p>
        </div>
      </div>
    </CustomPopover>
  );
};

export default Category;
