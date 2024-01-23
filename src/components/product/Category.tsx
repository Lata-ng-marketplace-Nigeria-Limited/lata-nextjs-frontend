"use client";

import Image from "next/image";
import React, { useState } from "react";
import CustomPopover from "@components/molecule/CustomPopover";
import Subcategory from "@components/product/Subcategory";
import { Category } from "@/interface/products";
import { useSelectedSubcategory } from "@/store/states/localStore";
import { cn } from "@/utils";
import Modal from "../molecule/Modal";

interface Props {
  data: Category;
  onModalClose?: () => void;
}

const Category = ({ data, onModalClose }: Props) => {
  // const { selectedCategory } = useSelectedSubcategory();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [showInnerModal, setShowInnerModal] = React.useState(false);

  const isSelectedCategory = () => {
    if (selectedCategory !== data?.name) return;
    return selectedCategory === data?.name;
  };

  return (
    <div
      className={cn({ "bg-green-800": isSelectedCategory() }, "cursor-pointer")}
      onClick={() => setShowInnerModal(true)}
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

      {showInnerModal ? (
          <Modal
            isShown={showInnerModal}
            setIsShown={setShowInnerModal}
            contentClass="max-h-[calc(100vh-20px)] w-screen max-w-lg !px-6"
          >
            <Subcategory
              selectedSubcategory={selectedSubcategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedSubcategory={setSelectedSubcategory}
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
