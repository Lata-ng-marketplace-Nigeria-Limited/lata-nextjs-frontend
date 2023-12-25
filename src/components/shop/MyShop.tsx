import { findAllMyProductsApi } from "@/api/product";
import { MyProductList } from "@components/shop/MyProductList";

interface Props {
  page?: string;
}
export const MyShop = async ({ page }: Props) => {
  const products = await findAllMyProductsApi({
    page,
  });

  return (
    <div className={"mt-[0.4375rem]"}>
      <MyProductList
        products={products.data}
        meta={products.meta}
        isEmpty={products.isEmpty}
      />
    </div>
  );
};
