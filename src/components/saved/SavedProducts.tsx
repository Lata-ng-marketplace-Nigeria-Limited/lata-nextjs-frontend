import { findMySavedProductsApi } from "@/api/product";
import { SavedProductList } from "@components/saved/SavedProductList";

interface Props {
  page: string;
}
export const SavedProducts = async ({ page }: Props) => {
  const data = await findMySavedProductsApi({
    page,
  });

  // const products: Product[] =
  //   data?.data?.map((savedProduct) => {
  //     return savedProduct.product;
  //   }) || [];

  return (
    <SavedProductList
      key={data?.data?.length}
      savedProducts={data.data}
      meta={data.meta}
      hideIsEmpty={!data.isEmpty}
    />
  );
};
