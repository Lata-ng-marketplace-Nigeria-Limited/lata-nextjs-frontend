"use client";

import React from "react";
import Button from "@components/atom/Button";
import FeedbackModal from "@components/feedback/FeedbackModal";
import { Product } from "@/interface/products";
import { useUser } from "@/hooks/useUser";
import { toast } from "@components/ui/use-toast";
import { cn } from "@/utils";

interface Props {
  product: Product;
  className?: string;
  isOwnProduct?: boolean;
}

const CreateFeedback = (props: Props) => {
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false);
  const { isLoggedIn } = useUser();

  const handleModal = () => {
    if (!isLoggedIn) {
      return toast({
        title: "Login to leave a feedback",
        variant: "destructive",
        duration: 15000,
      });
    } else {
      setOpenFeedbackModal(true);
    }
  };

  return (
    <div className={props.className}>
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-grey9">Feedbacks</p>
        <Button
          type="button"
          format="primary"
          onClick={handleModal}
          className={cn({
            "pointer-events-none opacity-0": props.isOwnProduct,
          })}
        >
          Leave Feedback
        </Button>
      </div>
      <FeedbackModal
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        product={props.product}
      />
    </div>
  );
};

export default CreateFeedback;
