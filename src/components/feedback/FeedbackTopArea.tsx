"use client";

import React from "react";
import Button from "@components/atom/Button";
import FeedbackContent from "@components/feedback/FeedbackContent";
import FeedbackModal from "@components/feedback/FeedbackModal";
import { Product } from "@/interface/products";

interface Props {
  product: Product;
}

const FeedbackTopArea = (props: Props) => {
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState(false);

  const handleModal = () => {
    setOpenFeedbackModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-grey9">Feedbacks</p>
        <Button type="button" format="primary" onClick={handleModal}>
          Leave Feedback
        </Button>
      </div>
      <FeedbackContent />
      <FeedbackModal
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        product={props.product}
      />
    </div>
  );
};

export default FeedbackTopArea;
