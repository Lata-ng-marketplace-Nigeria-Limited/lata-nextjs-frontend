import { FetchMeta } from "@/interface/general";
import { State } from "@/interface/location";
import { Product } from "@/interface/products";
import { MyProductList } from "@components/shop/MyProductList";

interface Props {
  products: Product[];
  meta: FetchMeta;
  isEmpty?: boolean;
  statesInNigeria: State[];
}
export const MyShop = async (props: Props) => {
  return (
    <div className={"mt-[0.4375rem]"}>
      <MyProductList
        statesInNigeria={props?.statesInNigeria}
        products={props?.products}
        meta={props?.meta}
        isEmpty={props?.isEmpty}
      />
    </div>
  );
};
