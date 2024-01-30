"use client";

import Button from "@/components/atom/Button";
import { SimleyXEyesIcon } from "@/components/atom/icons/SimleyXEyes";
import { toast } from "../ui/use-toast";

interface Props {
  param?: string;
}

const EmptyFeedback = (props: Props) => {
  const onCopyToClipboard = () => {
    toast({
      title: "Your profile link has been copied to the clipboard",
      variant: "success",
      duration: 15000,
    });
  };
  return (
    <div className="mx-auto max-w-[447px] rounded-lg border border-offwhite px-14 py-6">
      <div className="flex justify-center">
        <SimleyXEyesIcon />
      </div>
      <p className="mb-3.5 text-center text-sm font-normal text-grey8">
        You have not {props.param === "sent" ? "sent" : "received"} any Feedback
        yet.
      </p>
      <p className="mb-3.5 text-center text-sm font-normal text-grey8">
        Ask your customers to drop feedbacks for you.
      </p>
      {/* <p className="mb-3.5  text-center text-sm font-normal text-grey8">
        Copy and send the below link to them.
      </p>
      <Button
        format="primary"
        className=" w-full"
        onClick={onCopyToClipboard}
      >
        Copy my link
      </Button> */}
    </div>
  );
};

export default EmptyFeedback;
