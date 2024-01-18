"use client";

import Image from "next/image";
import React from "react";
import CustomPopover from "@components/molecule/CustomPopover";
import Subcategory from "@components/product/Subcategory";
import { Category } from "@/interface/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  data: Category;
  // setShowModal: React.SetStateAction<boolean>;
  onModalClose?: () => void;
}

const Category = ({ data, onModalClose }: Props) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSubcategoryChange = () => {
    console.log({ data });
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
      content={
        <Subcategory
          subcategory={data?.subcategories?.[0]?.items}
          handleClick={handleSubcategoryChange}
        />
      }
    >
      <div className="cursor-pointer">
        <div className="mb-3 flex items-center justify-center rounded-lg bg-purp1 px-2 py-5">
          <Image
            src={data?.image}
            width={58}
            height={31}
            alt={`${data?.subcategories?.[0]?.display_name} image`}
          />
        </div>
        <p className="text-center text-sm font-semibold">
          {data?.subcategories?.[0]?.display_name}
        </p>
      </div>
    </CustomPopover>
  );
};

export default Category;
