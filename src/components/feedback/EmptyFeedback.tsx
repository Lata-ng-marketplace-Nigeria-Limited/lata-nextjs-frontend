"use client";

import Button from "@/components/atom/Button";
import { SimleyXEyesIcon } from "@/components/atom/icons/SimleyXEyes";
import { cn, copyTextToClipboard } from "@/utils";
import { DASHBOARD_PRODUCT_ROUTE } from "@/constants/routes";

interface Props {
  param?: string;
  showCopy?: boolean;
  productId?: string;
}

const EmptyFeedback = (props: Props) => {
  const handleCopyToClipboard = () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const URL = `${origin}${DASHBOARD_PRODUCT_ROUTE}/${props?.productId}`;

    copyTextToClipboard({
      text: URL,
      inputId: "seller-profile-link",
      toastMessage:
        "Your profile link has been copied to the clipboard" as string,
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
      <p className={cn("mb-3.5 text-center text-sm font-normal text-grey8")}>
        Ask your customers to drop feedbacks for you.
      </p>
      <p
        className={cn(
          { hidden: !props.showCopy },
          "mb-3.5  text-center text-sm font-normal text-grey8",
        )}
      >
        Copy and send the below link to them.
      </p>
      <Button
        format="primary"
        className={cn({ hidden: !props.showCopy }, "w-full")}
        onClick={handleCopyToClipboard}
      >
        Copy my link
      </Button>
      <input className="hidden" id="seller-profile-link" />
    </div>
  );
};

export default EmptyFeedback;
