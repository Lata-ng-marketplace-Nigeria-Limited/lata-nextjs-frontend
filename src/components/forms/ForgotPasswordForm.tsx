"use client";

import React, { SetStateAction, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { forgotPasswordSchema } from "@/store/schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getFormErrorObject } from "@/utils";
import AuthParagraph from "@atom/AuthParagraph";
import TextInput from "@components/input/TextInput";
import Button from "@atom/Button";
import ALink from "@atom/ALink";
import { LANDING_ROUTE } from "@/constants/routes";
import Alert from "@atom/Alert";
import { resendOtpApi } from "@/api/auth";
import ResendEmail from "@molecule/ResendEmail";
import { ApiErrorResponse } from "@/interface/general";
import { useToast } from "@components/ui/use-toast";
import { forgetPasswordApi } from "@/api/auth.client";

export const ForgotPasswordForm = () => {
  const [view, setView] = useState<"enter-email" | "resend-email">(
    "enter-email",
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const { toast } = useToast();
  const resendRef = useRef<any>(null);

  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
    getValues,
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    try {
      await forgetPasswordApi(values);
      setView("resend-email");
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<
        z.infer<typeof forgotPasswordSchema>
      > = error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        setLoading(false);
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof forgotPasswordSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }
      setLoading(false);
      toast({
        description: `Something went wrong`,
        variant: "destructive",
      });
    }
  };

  const handleResendEmail = async (
    setRestart: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    setResendError("");
    setResendLoading(true);
    const email = getValues("email");
    if (!email) return;
    try {
      await resendOtpApi({
        email,
        type: "forgot-password",
      });
      // setRestart(true);
      resendRef.current?.startCountDown();
    } catch (error) {
      setResendError("Could not resend email. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };
  return (
    <React.Fragment>
      <form
        className={cn("flex flex-col gap-y-6 w-full", {
          hidden: view === "resend-email",
        })}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthParagraph>Enter your email to reset your password</AuthParagraph>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder={"Enter email"}
              type="email"
              label={"Email"}
              disabled={loading}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <div className={"flex flex-col items-center"}>
          <div className={"w-full flex flex-col gap-y-2"}>
            <Button
              type={"submit"}
              disabled={loading}
              format={"primary"}
              className={"w-full mt-0"}
            >
              Recover Password
            </Button>
            {/*<Alert type="danger">{forgetPasswordForm.response.message}</Alert>*/}
          </div>
          <AuthParagraph className={"mt-3"}>
            Don’t have an account?{" "}
            <ALink href={"/auth" + LANDING_ROUTE}>Sign up</ALink>
          </AuthParagraph>
        </div>
      </form>

      {view === "resend-email" ? (
        <>
          <AuthParagraph className={cn(`text-grey9`)}>
            A verification code has been sent to you
          </AuthParagraph>
          <AuthParagraph className={cn(`text-grey9`)}>
            {`Didn't`} receive email?{" "}
            <ResendEmail
              disabledBtn={resendLoading}
              ref={resendRef}
              onCountDownEnd={() => {}}
              startCountDown={view === "resend-email"}
              onResendEmail={handleResendEmail}
            />
          </AuthParagraph>
          <Alert type="danger">{resendError}</Alert>
        </>
      ) : null}
    </React.Fragment>
  );
};
