import { Product } from "@/interface/products";
import ViewProductContainer from "@atom/ViewProductContainer";
import ProductDetails from "@components/product/ProductDetails";
import ProductInsights from "@components/product/ProductInsights";
import FeedbacksForProduct from "../feedback/FeedbacksForProduct";

interface Props {
  product: Product;
}

export default function ViewOwnProduct(props: Props) {
  return (
    <div>
      <ViewProductContainer>
        <ProductDetails product={props.product} />
        <div>
          <ProductInsights product={props.product} />
          {props.product ? (
            <div className="mt-8 max-h-[30rem] overflow-y-auto">
              <FeedbacksForProduct product={props.product as Product} />
            </div>
          ) : null}
        </div>
      </ViewProductContainer>
    </div>
  );
}
