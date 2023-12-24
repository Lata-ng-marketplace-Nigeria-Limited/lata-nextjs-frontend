"use client";
import { VerifyEmailApiOutput } from "@/actions/auth";
import { LataLogo } from "@atom/icons/Lata";
import { cn, getFormErrorObject } from "@/utils";
import { useEffect, useState } from "react";
import Alert from "@atom/Alert";
import ALink from "@atom/ALink";
import { LOGIN_ROUTE } from "@/constants/routes";
import Button from "@atom/Button";
import { resendOtpApi } from "@/api/auth";
import { ApiErrorResponse } from "@/interface/general";

interface Props {
  response: VerifyEmailApiOutput | null;
  email: string;
}
export const VerifyEmail = ({ response, email }: Props) => {
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "danger";
    text: string;
  }>({
    type: "success",
    text: "",
  });

  useEffect(() => {
    if (!response || !response.verified) {
      setMessage({
        type: "danger",
        text: "Invalid or Expired Link.",
      });
    }

    if (response && response.verified) {
      setSuccess(true);
      setMessage({
        type: "success",
        text: response.message,
      });
    }
  }, [response]);

  const handleResendEmail = async () => {
    if (!email) return;
    setResendLoading(true);
    try {
      const data = await resendOtpApi({ email, type: "verify-email" });
      setMessage({
        type: "success",
        text: data.message,
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = error;
      const errorObj = getFormErrorObject(errorResponse);
      setMessage({
        type: "danger",
        text: errorResponse.data.message || errorObj?.retryAfter,
      });
      if (errorResponse.data.message === "Email already verified!") {
        return;
      }
      setResendLoading(false);
    }
  };
  return (
    <div
      className={
        "min-h-screen flex justify-center items-center flex-col relative"
      }
    >
      <LataLogo className={cn(`mb-16`)} />
      <h1 className={"text-2xl font-bold mb-5"}>
        {success ? "Email Verified" : "Email Verification Failed"}
      </h1>
      <Alert type={message.type}>{message.text}</Alert>

      {success ? (
        <p className={"text-lg mt-3 text-center"}>
          You can now{" "}
          <ALink href={"/auth" + LOGIN_ROUTE} className={"text-lg sm:text-lg"}>
            login
          </ALink>{" "}
          with your email and password
        </p>
      ) : (
        <Button
          onClick={handleResendEmail}
          format={"secondary"}
          disabled={resendLoading}
          className={"mt-3"}
        >
          Resend Email Verification
        </Button>
      )}
    </div>
  );
};
