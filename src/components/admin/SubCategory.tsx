import { renameCategories } from "@/utils/categories";
import React, { useState } from "react";
import XCancelFillIcon from "../atom/icons/XCancelFill";
import { Category, SubCategory } from "@/interface/products";
import ResizableDialog from "./ResizableDialog";
import AddSubCategory from "./AddSubCategory";
import DeleteModalContent from "./DeleteModalContent";
import { showToast } from "@/utils";
import { deleteCategoryApi, deleteSubcategoryApi } from "@/api/admin.client";
import { useRouter } from "next/navigation";

interface Props {
  selectedCategory: Category;
  setShowSubcategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const Subcategory = (props: Props) => {
  const { refresh } = useRouter();
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteSubcategoryModal, setShowDeleteSubcategoryModal] =
    useState(false);
  const [selecetdSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(null);

  const deleteCategory = async (id: string) => {
    if (!id) {
      showToast("Category not found", "destructive");
      return;
    }
    try {
      await deleteCategoryApi(id);
      setShowDeleteCategoryModal(false);
      props.setShowSubcategoryModal(false);
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
      setShowDeleteSubcategoryModal(false);
      showToast("Subcategory deleted successfully", "success");
      refresh();
    } catch (error) {
      console.log("error", error);
      showToast("Failed to delete subcategory", "destructive");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold">
          {renameCategories(props.selectedCategory)}
        </h3>
        <XCancelFillIcon
          className="ml-1 size-[24px] basis-[20%] cursor-pointer xls:ml-2"
          onClick={() => setShowDeleteCategoryModal(true)}
        />
      </div>
      {props.selectedCategory?.subcategories?.length > 0 ? (
        props.selectedCategory?.subcategories?.map((subcategory, index) => (
          <div
            key={subcategory.id + index}
            className="mb-6 flex items-center justify-between border-b border-grey7 pb-3"
          >
            <p className="">{subcategory.name}</p>

            <p
              className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-purp2 p-2"
              onClick={() => {
                setSelectedSubcategory(subcategory);
                setShowDeleteSubcategoryModal(true);
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
        onClick={() => setShowAddSubcategory(true)}
      >
        <p className="flex size-8 items-center justify-center rounded-full bg-purp2 p-2">
          <span className="text-lg font-bold">+</span>
        </p>
        <p> Add Subcategory</p>
      </div>
      <ResizableDialog
        isShown={showAddSubcategory}
        setIsShown={setShowAddSubcategory}
      >
        <AddSubCategory
          category={props.selectedCategory}
          setShowAddSubCategory={setShowAddSubcategory}
        />
      </ResizableDialog>
      <ResizableDialog
        isShown={showDeleteCategoryModal}
        setIsShown={setShowDeleteCategoryModal}
      >
        <DeleteModalContent
          setShowModal={setShowDeleteCategoryModal}
          onDelete={() => deleteCategory(props.selectedCategory?.id)}
          type="category"
          name={props.selectedCategory?.name}
        />
      </ResizableDialog>
      <ResizableDialog
        isShown={showDeleteSubcategoryModal}
        setIsShown={setShowDeleteSubcategoryModal}
      >
        <DeleteModalContent
          setShowModal={setShowDeleteSubcategoryModal}
          onDelete={() =>
            deleteSubcategory((selecetdSubcategory as SubCategory)?.id)
          }
          type="subcategory"
          name={(selecetdSubcategory as SubCategory)?.name}
        />
      </ResizableDialog>
    </div>
  );
};

export default Subcategory;
