"use client";

import { SELLER_SIGN_UP_ROUTE } from "@/constants/routes";
import { copyTextToClipboard } from "@/utils";
import { Copy } from "lucide-react";
import React from "react";

interface Props {
  referralCode: string;
}
const ReferralLink = (props: Props) => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const refferalUrl: string = `${origin}/auth${SELLER_SIGN_UP_ROUTE}?ref=${props.referralCode}`;
  return (
    <>
      <div
        className="flex max-w-max cursor-pointer gap-4 rounded-lg bg-primary px-6 py-2"
        onClick={() => {
          copyTextToClipboard({
            text: refferalUrl,
            inputId: "copy-staff-referral-code",
            toastMessage: "Referral link copied!",
          });
        }}
      >
        <p className="text-white">Copy link</p>
        <Copy className="text-white" />
      </div>
      <input type="text" className="hidden" id="copy-staff-referral-code" />
    </>
  );
};

export default ReferralLink;
