import { formatPrice } from "@/utils";
import { SelectedImagePreview } from "@components/input/ImageUploader";
import ProductCard from "@components/product/ProductCard";

export interface ProductFormProductInfo {
  name: string;
  description: string;
  price: string;
  state: string;
  city: string;
  discount?: number;
  categoryId: string;
  subCategoryId?: string;
}

interface Props {
  selectedPhotos: SelectedImagePreview | undefined;
  productInfo: ProductFormProductInfo;
}

export default function NewProductPreview(props: Props) {
  return (
    <div>
      <h3
        className={
          "text-sm sm:text-[0.9375rem] tablet:text-[1rem] sl:text-[1.25rem] tablet:font-medium text-grey6 mb-3"
        }
      >
        Your Product will be displayed like this
      </h3>
      <ProductCard
        imageSrc={props.selectedPhotos?.image.url}
        createProductPreview={true}
        description={props.productInfo?.description}
        state={props.productInfo?.state}
        city={props.productInfo?.city}
        price={
          props.productInfo?.price
            ? isNaN(Number(props.productInfo?.price))
              ? "Invalid price"
              : formatPrice(Number(props.productInfo?.price))
            : undefined
        }
        productName={props.productInfo?.name}
      />
    </div>
  );
}
