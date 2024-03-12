"use client";

import Image from "next/image";
import React from "react";
import Subcategory from "@components/product/Subcategory";
import { cn } from "@/utils";
import Modal from "../molecule/Modal";
import type { Category } from "@/interface/products";

interface Props {
  data: Category;
  onModalClose?: () => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
}

const Category = ({
  data,
  onModalClose,
  selectedCategory,
  selectedSubcategory,
}: Props) => {
  const [showInnerModal, setShowInnerModal] = React.useState(false);

  const isSelectedCategory = () => {
    if (selectedCategory !== data?.id) return;
    return true;
  };

  return (
    <div className="cursor-pointer" onClick={() => setShowInnerModal(true)}>
      <div className="mb-3 flex min-h-[4.375rem] min-w-[4.375rem] items-center justify-center rounded-lg bg-purp1 px-2 py-5">
        <Image
          src={data?.image}
          width={58}
          height={31}
          alt={`${data?.subcategories?.[0]?.displayName} image`}
        />
      </div>
      <div className="flex justify-center">
        <p
          className={cn(
            { "bg-primary p-1 !text-white": isSelectedCategory() },
            "text-sm font-semibold text-grey9",
          )}
        >
          {data?.subcategories?.[0]?.displayName}
        </p>
      </div>

      {showInnerModal ? (
        <Modal
          isShown={showInnerModal}
          setIsShown={setShowInnerModal}
          contentClass="max-h-[calc(100vh-20px)] w-screen max-w-lg !px-6"
        >
          <Subcategory
            selectedSubcategory={selectedSubcategory}
            category={data}
            onModalClose={onModalClose}
          />
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default Category;
