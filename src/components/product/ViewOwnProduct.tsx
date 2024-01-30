import { Product } from "@/interface/products";
import ViewProductContainer from "@atom/ViewProductContainer";
import ProductDetails from "@components/product/ProductDetails";
import ProductInsights from "@components/product/ProductInsights";

interface Props {
  product: Product;
}

export default function ViewOwnProduct(props: Props) {
  return (
    <div>
      <ViewProductContainer>
        <ProductDetails product={props.product} />
        <ProductInsights product={props.product} />
      </ViewProductContainer>
    </div>
  );
}
