import React from "react";
import { getProductFeedback } from "@/api/feedback";
import CreateFeedback from "./CreateFeedback";
import { Product } from "@/interface/products";
import FeedbackContent from "./FeedbackContent";
import { cn } from "@/utils";

interface Props {
  page?: string;
  product: Product;
  isOwnProduct?: boolean;
  hideLink?: boolean;
}

const FeedbacksForProduct = async (props: Props) => {
  const productFeedback = await getProductFeedback(props.product?.id);

  return (
    <>
      <CreateFeedback
        product={props.product}
        className="mb-3"
        isOwnProduct={props.isOwnProduct}
      />

      <div className={cn({ " hidden ": productFeedback.isEmpty })}>
        {productFeedback.data.map((feedback) => (
          <FeedbackContent key={feedback.id} feedback={feedback} hideLink />
        ))}
      </div>
    </>
  );
};

export default FeedbacksForProduct;
