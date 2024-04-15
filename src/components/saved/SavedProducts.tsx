import { FetchMeta } from "@/interface/general";
import { SavedProduct } from "@/interface/products";
import { SavedProductList } from "@components/saved/SavedProductList";

interface Props {
  data: SavedProduct[];
  meta: FetchMeta;
}
export const SavedProducts = async ({ data, meta }: Props) => {
  return (
    <SavedProductList
      key={data?.length}
      savedProducts={data}
      meta={meta}
      hideIsEmpty={(data.length || 0) > 0}
    />
  );
};
