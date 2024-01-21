import { Category, SubCategory, SubCategoryItems } from "@/interface/products";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelectedSubcategory } from "@/store/states/localStore";
import { cn } from "@/utils";

interface Props {
  category: Category;
  onModalClose?: () => void;
}

const Subcategory = (props: Props) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubategory,
  } = useSelectedSubcategory();

  const handleSubcategoryChange = () => {
    const subcategory = localStorage.getItem("subcategory") || "";

    const params = new URLSearchParams(searchParams);
    if (props.category?.id) {
      params.set("category", props.category?.id);
      params.set("subcategory", subcategory);
    } else {
      params.delete("category");
      params.delete("subcategory");
    }
    replace(`${pathname}?${params.toString()}`);
    setSelectedCategory(props.category.name);
    props.onModalClose?.();
  };

  const onSelectSubCategory = (item: SubCategoryItems) => {
    localStorage.setItem("subcategory", item?.value);
  };

  return (
    <div
      className="overflow-y-auto bg-white rounded-md shadow-black/15 max-w-max"
      onClick={handleSubcategoryChange}
    >
      {JSON.parse(props.category?.subcategories?.[0]?.items).map(
        (item: SubCategoryItems, index: number) => (
          <div
            className={cn(
              { "bg-blue-400": selectedSubcategory === item.label },
              "cursor-pointer border-b border-grey2 p-3 hover:bg-purp1"
            )}
            key={index}
            onClick={() => {
              onSelectSubCategory(item);
              setSelectedSubategory(item.value);
            }}
          >
            <p>{item?.label}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Subcategory;
