"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import TextAreaInput from "@components/input/TextAreaInput";
import { cn } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@components/atom/Button";
import FeedbackButton from "@components/feedback/FeedbackButton";
import { Dialog, DialogContent } from "../ui/dialog";
import { Product } from "@/interface/products";
import {
  NEGATIVE_FEEDBACK_RATING,
  NEUTRAL_FEEDBACK_RATING,
  POSITIVE_FEEDBACK_RATING,
} from "@/constants/feedback";
import { saveCustomerFeedback } from "@/api/feedback";
import { ICustomerFeedback } from "@/interface/feedback";
import { toast } from "../ui/use-toast";
import { useUser } from "@/hooks/useUser";

interface Props {
  openFeedbackModal: boolean;
  setOpenFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
}

const FeedbackModal = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [productRating, setProductRating] = React.useState<3 | 2 | 1 | 0>(0);
  const { user } = useUser();

  const createFeedbackSchema = z.object({
    description: z
      .string()
      .trim()
      .min(10, "Please enter at least 10 characters"),
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<z.infer<typeof createFeedbackSchema>>({
    resolver: zodResolver(createFeedbackSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createFeedbackSchema>) => {
    if (!productRating) {
      return toast({
        title: "Click on positive, negative or neutral before sending",
        variant: "destructive",
        duration: 15000,
      });
    }
    try {
      setLoading(true);
      const payload: ICustomerFeedback = {
        ...values,
        productId: props.product?.id,
        rating: productRating,
        type: "PRODUCT",
        userId: user?.id,
        sender: user?.name,
      };

      const res = await saveCustomerFeedback(payload);

      if (res.success) {
        toast({
          title: "Your feedback has been sent successfully",
          description: res.message,
          variant: "success",
          duration: 15000,
        });
        props.setOpenFeedbackModal(false);
      }

      if (!res.success) {
        const errorMessage = "You cannot give feedback to your own product";
        if (res.isOwnProduct) {
          toast({
            title: errorMessage,
            variant: "destructive",
            duration: 15000,
          });
        }
        return;
      }
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
        duration: 15000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEscapeClick = () => {
    props.setOpenFeedbackModal(false);
  };

  const handleClickOutside = () => {
    props.setOpenFeedbackModal(false);
  };

  return (
    <Dialog open={props.openFeedbackModal} modal>
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onEscapeKeyDown={handleEscapeClick}
        className="px-2 xls:px-4 xs:px-6"
      >
        <div>
          <p className="mb-2 font-semibold">
            Leave a feedback for{" "}
            <span className="text-primary">{props.product?.user?.name}</span>
          </p>
          <p className="mb-6 text-xs font-normal">How was your experience?</p>
        </div>
        <div className="flex items-center justify-between gap-1 max-xms:flex-wrap max-xms:gap-y-0 xls:gap-3 xs:gap-6">
          <FeedbackButton
            type="positive"
            isActive={productRating === POSITIVE_FEEDBACK_RATING}
            onClick={() => setProductRating(POSITIVE_FEEDBACK_RATING)}
          />
          <FeedbackButton
            type="neutral"
            isActive={productRating === NEUTRAL_FEEDBACK_RATING}
            onClick={() => setProductRating(NEUTRAL_FEEDBACK_RATING)}
          />
          <FeedbackButton
            type="negative"
            isActive={productRating === NEGATIVE_FEEDBACK_RATING}
            onClick={() => setProductRating(NEGATIVE_FEEDBACK_RATING)}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextAreaInput
                {...field}
                wrapperClass={"w-full mb-6"}
                placeholder={"Please write your feedback"}
                inputClass={cn(`h-[9.375rem] sm:h-[12.5rem]`)}
                name={field.name}
                disabled={loading}
                value={field.value || ""}
                errorMessage={errors.description?.message}
              />
            )}
          />
          <div className="flex items-center justify-end gap-3">
            <Button
              format="tertiary"
              type="button"
              onClick={() => props.setOpenFeedbackModal(false)}
            >
              Cancel
            </Button>
            <Button format="primary" type="submit">
              Send Feedback
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
