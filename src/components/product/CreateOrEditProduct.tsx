"use client";

import { useState } from "react";
import { SelectedImagePreview } from "@components/input/ImageUploader";
import { cn } from "@/utils";
import NewProductPreview, {
  ProductFormProductInfo,
} from "@components/product/NewProductPreview";
import ProductForm from "@components/forms/ProductForm";
import { FindAProductData } from "@/interface/products";

interface Props {
  data?: FindAProductData | null;
}

export const CreateOrEditProduct = ({ data }: Props) => {
  const [productInfo, setProductInfo] = useState<ProductFormProductInfo>({
    name: "",
    description: "",
    price: "",
    state: "",
    city: "",
    categoryId: "",
    discount: "0",
    subCategoryId: "",
  });
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedImagePreview>();

  return (
    <div
      className={cn(`
        flex
        flex-col
        sm:flex-row
        gap-x-4
        gap-y-6
        justify-between
        h-full
        w-full
      `)}
    >
      <NewProductPreview
        productInfo={productInfo}
        selectedPhotos={selectedPhotos}
      />

      <ProductForm
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
        setProductInfo={setProductInfo}
        product={data?.product}
      />
    </div>
  );
};
