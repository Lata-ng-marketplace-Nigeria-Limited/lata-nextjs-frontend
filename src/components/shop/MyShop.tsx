import { FetchMeta } from "@/interface/general";
import { Product } from "@/interface/products";
import { MyProductList } from "@components/shop/MyProductList";

interface Props {
  products: Product[]
  meta: FetchMeta;
  isEmpty?: boolean;
}
export const MyShop = async (props: Props) => {
  return (
    <div className={"mt-[0.4375rem]"}>
      <MyProductList
        products={props?.products}
        meta={props?.meta}
        isEmpty={props?.isEmpty}
      />
    </div>
  );
};
