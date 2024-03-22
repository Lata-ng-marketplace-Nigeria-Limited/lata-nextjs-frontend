"use client";

import React, { useState } from "react";
import CategoryIcon from "../atom/icons/Category";
import type { Category } from "@/interface/products";
import Button from "../atom/Button";
import { renameCategories } from "@/utils/categories";
import ResizableDialog from "./ResizableDialog";
import XCancelFillIcon from "../atom/icons/XCancelFill";
import CustomPopover from "../molecule/CustomPopover";
import { useRouter } from "next/navigation";
import { deleteCategoryApi, deleteSubcategoryApi } from "@/api/admin.client";
import { showToast } from "@/utils";
import DeleteModalContent from "./DeleteModalContent";
import AddSubCategory from "./AddSubCategory";
import AddCategory from "./AddCategory";

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
        <AddCategory setShowModal={setShowModal} />
      </ResizableDialog>
    </main>
  );
};

export default Category;

const DisplayCategoryTiles = (props: Props) => {
  const { refresh } = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [subcategoryId, setSubcategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const deleteCategory = async (id: string) => {
    if (!id) {
      showToast("Category not found", "destructive");
      return;
    }
    try {
      await deleteCategoryApi(id);
      setShowDeleteModal(false);
      showToast("Category deleted successfully", "success");
      refresh();
    } catch (error) {
      console.log("error", error);
      showToast("Failed to delete category", "destructive");
    }
  };

  const deleteSubcategory = async (id: string) => {
    if (!id) {
      showToast("Subcategory not found", "destructive");
      return;
    }
    try {
      await deleteSubcategoryApi(id);
      setShowDeleteModal(false);
      showToast("Subcategory deleted successfully", "success");
      refresh();
    } catch (error) {
      console.log("error", error);
      showToast("Failed to delete subcategory", "destructive");
    }
  };

  return (
    <section className="grid grid-cols-1 gap-2 xls:grid-cols-2 xls:gap-3 xs:grid-cols-auto-fit">
      {props.categories.map((category, index) => (
        <div
          key={category.id}
          className="flex min-h-[3.4rem] cursor-pointer items-center justify-between gap-[2px] rounded-[0.375rem] bg-purp2 py-2 px-6 xls:gap-1 "
        >
          <p className="basis-[10%] text-xl">•</p>
          <p className="basis-[60%]">{renameCategories(category)}</p>{" "}
          <CustomPopover
            content={
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold">
                    {renameCategories(category)}
                  </h3>
                  <XCancelFillIcon
                    className="ml-1 size-[24px] basis-[20%] cursor-pointer xls:ml-2"
                    onClick={() => {
                      setCategoryId(category?.id);
                      setSelectedCategoryName(category?.name);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
                {category.subcategories?.length > 0 ? (
                  category.subcategories?.map((subcategory, index) => (
                    <div
                      key={subcategory.id + index}
                      className="mb-6 flex items-center justify-between border-b border-grey7 pb-3"
                    >
                      <p className="">{subcategory.name}</p>

                      <p
                        className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-purp2 p-2"
                        onClick={() => {
                          setSubcategoryId(subcategory.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <span className="text-lg">×</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="mb-6">No subcategories found</p>
                )}{" "}
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAddSubcategory(true);
                  }}
                >
                  <p className="flex size-8 items-center justify-center rounded-full bg-purp2 p-2">
                    <span className="text-lg font-bold">+</span>
                  </p>
                  <p> Add Subcategory</p>
                </div>
              </div>
            }
          >
            <CategoryIcon className="ml-1 size-[24px] basis-[20%] xls:ml-2" />
          </CustomPopover>
        </div>
      ))}

      <ResizableDialog
        isShown={showDeleteModal}
        setIsShown={setShowDeleteModal}
      >
        <DeleteModalContent
          setShowModal={setShowDeleteModal}
          onDelete={() => deleteCategory(categoryId)}
          type="category"
          name={selectedCategoryName}
        />
      </ResizableDialog>

      <ResizableDialog
        isShown={showDeleteModal}
        setIsShown={setShowDeleteModal}
      >
        <DeleteModalContent
          setShowModal={setShowDeleteModal}
          onDelete={() => deleteSubcategory(subcategoryId)}
          type="subcategory"
          name={selectedCategoryName}
        />
      </ResizableDialog>

      <ResizableDialog
        isShown={showAddSubcategory}
        setIsShown={setShowAddSubcategory}
      >
        <AddSubCategory
          category={selectedCategory as Category}
          setShowAddSubCategory={setShowAddSubcategory}
        />
      </ResizableDialog>
    </section>
  );
};
