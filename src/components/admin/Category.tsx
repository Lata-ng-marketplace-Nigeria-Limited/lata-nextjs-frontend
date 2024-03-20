"use client";

import React, { useState } from "react";
import CategoryIcon from "../atom/icons/Category";
import { Category } from "@/interface/products";
import Button from "../atom/Button";
import { renameCategories } from "@/utils/categories";
import ResizableDialog from "./ResizableDialog";
import EditCategory from "./AddCategory";
import XCancelFillIcon from "../atom/icons/XCancelFill";
import CustomPopover from "../molecule/CustomPopover";
import { useRouter } from "next/navigation";
import { deleteCategoryApi } from "@/api/admin.client";
import { showToast } from "@/utils";

interface Props {
  categories: Category[];
}

const Category = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <main>
      <div className="mb-6 flex justify-between">
        <h1 className="">Categories</h1>
        <Button format="primary" onClick={() => setShowModal(!showModal)}>
          + Add Category
        </Button>
      </div>
      <DisplayCategoryTiles categories={props.categories} />

      <ResizableDialog isShown={showModal} setIsShown={setShowModal}>
        <EditCategory setShowModal={setShowModal} />
      </ResizableDialog>
    </main>
  );
};

export default Category;

const DisplayCategoryTiles = (props: Props) => {
  const { refresh } = useRouter();

  const deleteCategory = async (id: string) => {
    console.log("delete category", id);
    if (!id) {
      showToast("Category not found", "destructive");
      return;
    }
    try {
      const res = await deleteCategoryApi(id);
      console.log("res", res);
      showToast("Category deleted successfully", "success");
      refresh();
    } catch (error) {
      console.log("error", error);
      showToast("Failed to delete category", "destructive");
    }
  };

  return (
    <section className="grid grid-cols-1 gap-2 xls:grid-cols-2 xls:gap-3 xs:grid-cols-auto-fit">
      {props.categories.map((category, index) => (
        <div
          key={category.id}
          className="flex min-h-[3.4rem] cursor-pointer items-center justify-between gap-[2px] rounded-[0.375rem] bg-purp2 p-2 xls:gap-1 "
        >
          <p className="basis-[10%] text-xl">•</p>
          <p className="basis-[60%]">{renameCategories(category)}</p>{" "}
          <CustomPopover
            content={
              <div
                key={category.id}
                className="flex min-h-[3.4rem] cursor-pointer items-center justify-between gap-[2px] rounded-[0.375rem] bg-purp2 p-2 xls:gap-1 "
              >
                <p className="basis-[10%] text-xl">•</p>
                <p className="basis-[60%]">{renameCategories(category)}</p>{" "}
                <XCancelFillIcon
                  className="ml-1 size-[24px] basis-[20%] xls:ml-2"
                  onClick={() => deleteCategory(category?.id)}
                />
              </div>
            }
          >
            <CategoryIcon className="ml-1 size-[24px] basis-[20%] xls:ml-2" />
          </CustomPopover>
        </div>
      ))}
    </section>
  );
};
