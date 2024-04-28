import { FetchMeta } from "@/interface/general";
import { State } from "@/interface/location";
import { SavedProduct } from "@/interface/products";
import { SavedProductList } from "@components/saved/SavedProductList";

interface Props {
  data: SavedProduct[];
  meta: FetchMeta;
  statesInNigeria: State[];
}
export const SavedProducts = async ({ data, meta, statesInNigeria }: Props) => {
  return (
    <SavedProductList
      statesInNigeria={statesInNigeria}
      key={data?.length}
      savedProducts={data}
      meta={meta}
      hideIsEmpty={(data.length || 0) > 0}
    />
  );
};
