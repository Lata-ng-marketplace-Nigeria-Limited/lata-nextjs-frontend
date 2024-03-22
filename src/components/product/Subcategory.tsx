import { Category, SubCategory, SubCategoryItems } from "@/interface/products";
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

  const onSelectSubCategory = (subcategory: SubCategory) => {
    localStorage.setItem("subcategory", subcategory?.name);
  };

  return (
    <div
      className="max-w-max overflow-y-auto rounded-md bg-white shadow-black/15"
      onClick={handleSubcategoryChange}
    >
      {props.category?.subcategories?.map((sub) => (
        <div
          className={cn(
            {
              "border-primary bg-primary hover:!bg-primary":
                props.selectedSubcategory === sub.name,
            },
            "cursor-pointer border-b border-grey2 p-3 hover:bg-purp1",
          )}
          key={sub.id}
          onClick={() => onSelectSubCategory(sub)}
        >
          <p
            className={cn({
              "text-white hover:text-white":
                props.selectedSubcategory === sub.name,
            })}
          >
            {sub?.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Subcategory;
