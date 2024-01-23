import { Category, SubCategoryItems } from "@/interface/products";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, safeParseJSON } from "@/utils";

interface Props {
  category: Category;
  onModalClose?: () => void;
  selectedSubcategory: string | null;
}

const Subcategory = (props: Props) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    props.onModalClose?.();
  };

  const onSelectSubCategory = (item: SubCategoryItems) => {
    localStorage.setItem("subcategory", item?.value);
  };

  return (
    <div
      className="max-w-max overflow-y-auto rounded-md bg-white shadow-black/15"
      onClick={handleSubcategoryChange}
    >
      {safeParseJSON(props.category?.subcategories?.[0]?.items).map(
        (item: SubCategoryItems, index: number) => (
          <div
            className={cn(
              {
                "border-primary bg-primary hover:!bg-primary":
                  props.selectedSubcategory === item.label,
              },
              "cursor-pointer border-b border-grey2 p-3 hover:bg-purp1",
            )}
            key={index}
            onClick={() => onSelectSubCategory(item)}
          >
            <p
              className={cn({
                "text-white hover:text-white":
                  props.selectedSubcategory === item.label,
              })}
            >
              {item?.label}
            </p>
          </div>
        ),
      )}
    </div>
  );
};

export default Subcategory;
