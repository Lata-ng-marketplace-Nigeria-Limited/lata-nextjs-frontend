import { findMySavedProductsApi } from "@/api/product";
import { SavedProductList } from "@components/saved/SavedProductList";

interface Props {
  page: string;
}
export const SavedProducts = async ({ page }: Props) => {
  const res = await findMySavedProductsApi({
    page,
  });

  return (
    <SavedProductList
      key={res?.data?.length}
      savedProducts={res.data}
      meta={res.meta}
      hideIsEmpty={(res.data.length || 0) > 0}
    />
  );
};
