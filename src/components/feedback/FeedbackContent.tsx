"use client";

import React from "react";
import FeedbackButton from "./FeedbackButton";
import { IFeedback } from "@/interface/feedback";
import Link from "next/link";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";
import { cn } from "@/utils";
import DeleteIcon from "../atom/icons/Delete";
import ResizableDialog from "../admin/ResizableDialog";
import Button from "../atom/Button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { deleteFeedbackApi } from "@/api/admin.client";

interface Props {
  feedback?: IFeedback;
  hideLink?: boolean;
}

const FeedbackContent = (props: Props) => {
  const [openModal, setOpenModal] = React.useState(false);
  const { refresh } = useRouter();
  const { user } = useUser();

  const feedbackRating = {
    1: "negative" as const,
    2: "neutral" as const,
    3: "positive" as const,
  };

  const onDeleteFeedback = async () => {
    if (!props.feedback?.id) return;
    try {
      const response = await deleteFeedbackApi(props.feedback?.id);
      if (response.success) {
        toast({
          title: "Feedback deleted",
          description: "You have successfully deleted the feedback",
          variant: "success",
        });
        refresh();
      } else {
        toast({
          title: "Failed to delete feedback",
          description: "Please try again later",
          variant: "destructive",
        });
      }
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-grey2 px-5 py-4 tablet:mb-6 tablet:px-10 tablet:py-6">
      <div className={cn({ "flex justify-between": user?.role === "ADMIN" })}>
        <FeedbackButton
          isActive
          type={feedbackRating[props.feedback?.rating || 2]}
          className="pointer-events-none !mb-2 !max-w-max tablet:!mb-5"
        />
        {user?.role === "ADMIN" ? (
          <DeleteIcon
            className="cursor-pointer"
            onClick={() => setOpenModal(!openModal)}
          />
        ) : null}
      </div>

      <h2 className="mb-2 text-base font-semibold text-grey9 tablet:mb-5 tablet:text-xl">
        {props?.feedback?.sender || "Anonymous"}
      </h2>
      <p className="text-sm font-normal text-grey7">
        {props.feedback?.description || "No description"}
      </p>
      <Link
        href={`${DASHBOARD_PRODUCT_ROUTE}/${props?.feedback?.product?.id}`}
        className={cn(
          { hidden: props?.hideLink },
          "text-sm font-semibold text-blue-700",
        )}
      >
        View product
      </Link>
      <ResizableDialog isShown={openModal} setIsShown={setOpenModal}>
        <p className="mb-4">
          You are about to delete a product feedback for{" "}
          <span className="font-semibold text-primary">
            {props?.feedback?.product?.user?.name}{" "}
          </span>
          . Click on "Confirm" to proceed.
        </p>
        <div className="flex items-center justify-end gap-5">
          <Button format="secondary" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            format="danger"
            onClick={onDeleteFeedback}
            className="bg-danger text-white hover:bg-danger hover:text-white"
          >
            Confirm
          </Button>
        </div>
      </ResizableDialog>
    </div>
  );
};

export default FeedbackContent;
