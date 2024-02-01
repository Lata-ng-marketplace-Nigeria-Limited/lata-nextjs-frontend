"use client";

import React from "react";
import { IGetProductFeedback, getProductFeedback } from "@/api/feedback";
import CreateFeedback from "./CreateFeedback";
import { Product } from "@/interface/products";
import FeedbackContent from "./FeedbackContent";
import { cn } from "@/utils";
import EmptyFeedback from "./EmptyFeedback";
import { useUser } from "@/hooks/useUser";

interface Props {
  page?: string;
  product: Product;
  hideLink?: boolean;
}

const FeedbacksForProduct = (props: Props) => {
  const { user } = useUser();

  const [productFeedback, setProductFeedback] =
    React.useState<IGetProductFeedback | null>(null);

  React.useEffect(() => {
    const fetchFeedback = async () => {
      const feedback = await getProductFeedback(props.product?.id);
      setProductFeedback(feedback);
    };

    fetchFeedback();
  }, [props.product?.id]);

  return (
    <>
      {productFeedback ? (
        <>
          <CreateFeedback
            product={props.product}
            className="mb-3"
            isOwnProduct={user?.id === props.product?.user?.id}
          />

          <div className={cn({ " hidden ": productFeedback.isEmpty })}>
            {productFeedback.data.map((feedback) => (
              <FeedbackContent
                key={feedback?.id}
                feedback={feedback}
                hideLink
              />
            ))}
          </div>
          <div
            className={cn({
              hidden:
                !productFeedback?.isEmpty ||
                !(user?.id === props.product?.user?.id),
            })}
          >
            <EmptyFeedback
              showCopy={user?.id === props.product?.user?.id}
              product={props.product}
            />
          </div>
        </>
      ) : (
        <div>Feedbacks not found</div>
      )}
    </>
  );
};

export default FeedbacksForProduct;
