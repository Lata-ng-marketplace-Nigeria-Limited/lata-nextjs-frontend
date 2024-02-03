"use client";

import React from "react";
import { IGetProductFeedback, getProductFeedback } from "@/api/feedback";
import CreateFeedback from "./CreateFeedback";
import { Product } from "@/interface/products";
import FeedbackContent from "./FeedbackContent";
import { cn } from "@/utils";
import EmptyFeedback from "./EmptyFeedback";
import { useUser } from "@/hooks/useUser";
import FeedbackContentSkeleton from "../skeleton/FeedbackContentSkeleton";

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

          {/* hidden if productFeedback.data array is empty */}
          <div className={cn({ " hidden ": productFeedback.isEmpty })}>
            {productFeedback.data.map((feedback) => (
              <FeedbackContent
                key={feedback?.id}
                feedback={feedback}
                hideLink
              />
            ))}
          </div>

          {/* Only dislayed if productFeedback.data array is empty and product does not belong to this user */}
          <p
            className={cn(
              {
                hidden:
                  !productFeedback.isEmpty && user?.id !== props?.product?.id,
              },
              "mt-4 font-semibold text-gray-500 ",
            )}
          >
            No feeback for this product yet
          </p>

          {/* Only dislayed if productFeedback.data array is empty and product belongs to this user */}
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
        <FeedbackContentSkeleton hideLink />
      )}
    </>
  );
};

export default FeedbacksForProduct;
