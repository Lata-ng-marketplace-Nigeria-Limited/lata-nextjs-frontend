"use client";

import React, { useState } from "react";
import CategoryIcon from "../atom/icons/Category";
import type { Category } from "@/interface/products";
import Button from "../atom/Button";
import { renameCategories } from "@/utils/categories";
import ResizableDialog from "./ResizableDialog";
import AddCategory from "./AddCategory";
import Subcategory from "./SubCategory";

interface Props {
  categories: Category[];
}

const Category = (props: Props) => {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);

  return (
    <main>
      <div className="mb-6 flex justify-between">
        <h1 className="">Categories</h1>
        <Button
          format="primary"
          onClick={() => setShowAddCategoryModal(!showAddCategoryModal)}
        >
          + Add Category
        </Button>
      </div>
      <section className="grid grid-cols-1 gap-2 xls:grid-cols-2 xls:gap-3 xs:grid-cols-auto-fit">
        {props.categories.map((category) => (
          <div
            key={category.id}
            className="flex min-h-[3.4rem] cursor-pointer items-center justify-between gap-[2px] rounded-[0.375rem] bg-purp2 px-4 py-2 xls:gap-1 "
          >
            <p className="basis-[10%] text-xl">•</p>
            <p className="basis-[60%]">{renameCategories(category)}</p>{" "}
            <CategoryIcon
              className="ml-1 size-[24px] basis-[20%] xls:ml-2"
              onClick={() => {
                setSelectedCategory(category);
                setShowSubcategoryModal(true);
              }}
            />
          </div>
        ))}
      </section>

      <ResizableDialog
        isShown={showAddCategoryModal}
        setIsShown={setShowAddCategoryModal}
      >
        <AddCategory setShowModal={setShowAddCategoryModal} />
      </ResizableDialog>

      <ResizableDialog
        isShown={showSubcategoryModal}
        setIsShown={setShowSubcategoryModal}
      >
        <Subcategory
          selectedCategory={selectedCategory as Category}
          setShowSubcategoryModal={setShowSubcategoryModal}
        />
      </ResizableDialog>
    </main>
  );
};

export default Category;
