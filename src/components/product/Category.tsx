"use client";

import Image from "next/image";
import React from "react";
import CustomPopover from "@components/molecule/CustomPopover";
import Subcategory from "@components/product/Subcategory";
import { Category } from "@/interface/products";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelectedSubcategory } from "@/store/states/localStore";
import { cn } from "@/utils";

interface Props {
  data: Category;
  onModalClose?: () => void;
}

const Category = ({ data, onModalClose }: Props) => {
  const { selectedCategory } = useSelectedSubcategory();

  const isSelectedCategory = () => {
    if (selectedCategory !== data?.name) return;
    return selectedCategory === data?.name;
  };

  return (
    <CustomPopover
      side="left"
      contentClass={"w-fit"}
      isModalMode
      content={<Subcategory category={data} onModalClose={onModalClose} />}
    >
      <div
        className={cn(
          { "bg-green-800": isSelectedCategory() },
          "cursor-pointer"
        )}
      >
        <div
          className={cn(
            { "bg-red-800": isSelectedCategory() },
            "mb-3 flex items-center justify-center rounded-lg bg-purp1 px-2 py-5 min-h-[4.375rem] min-w-[4.375rem]"
          )}
        >
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
