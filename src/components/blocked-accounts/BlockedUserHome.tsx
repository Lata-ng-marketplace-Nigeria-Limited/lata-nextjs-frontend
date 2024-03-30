"use client";

import React from "react";
import PadlockIcon from "../atom/icons/Padlock";
import Button from "../atom/Button";
import { useRouter } from "next/navigation";
import {
  BLOCKED_ACCOUNTS_ROUTE,
  CONTACT_SUPPORT_ROUTE,
  UPLOAD_ID_ROUTE,
} from "@/constants/routes";

interface Props {
  userId: string;
}
const BlockedAccountHome = (props: Props) => {
  const { push } = useRouter();
  return (
    <div className="mt-12 xs:flex xs:flex-row-reverse xs:items-center xs:justify-center xs:gap-10">
      <div className="flex justify-center xs:block">
        <PadlockIcon className="mb-8" />
      </div>
      <div>
        <div className="mb-6 text-center xs:text-left">
          <h1 className="mb-3 text-xl font-semibold xs:text-2xl">
            Your account has been blocked!
          </h1>
          <p className="text-grey9">
            To unblock your account kindly upload a valid ID or contact support
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 xs:justify-start xs:gap-6">
          <Button
            format="primary"
            className="mb- xs:mb-0"
            onClick={() =>
              push(
                `${BLOCKED_ACCOUNTS_ROUTE}/${props.userId}/${UPLOAD_ID_ROUTE}`,
              )
            }
          >
            Upload ID
          </Button>
          <Button
            format="secondary"
            onClick={() =>
              push(
                `${BLOCKED_ACCOUNTS_ROUTE}/${props.userId}/${CONTACT_SUPPORT_ROUTE}`,
              )
            }
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccountHome;
