"use client";

import { useState } from "react";
import { SelectedImagePreview } from "@components/input/ImageUploader";
import { cn } from "@/utils";
import NewProductPreview, {
  ProductFormProductInfo,
} from "@components/product/NewProductPreview";
import ProductForm from "@components/forms/ProductForm";
import { FindAProductData } from "@/interface/products";
import { State } from "@/interface/location";

interface Props {
  data?: FindAProductData | null;
  sellerId?: string;
  statesInNigeria: State[];
}

export const CreateOrEditProduct = ({
  data,
  sellerId,
  statesInNigeria,
}: Props) => {
  const [productInfo, setProductInfo] = useState<ProductFormProductInfo>({
    name: "",
    description: "",
    price: "",
    state: "",
    city: "",
    categoryId: "",
    discount: "",
    subCategoryId: "",
  });
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedImagePreview>();

  return (
    <div
      className={cn(`
        flex
        h-full
        w-full
        flex-col
        justify-between
        gap-x-4
        gap-y-6
        sm:flex-row
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
        sellerId={sellerId}
        statesInNigeria={statesInNigeria}
      />
    </div>
  );
};
