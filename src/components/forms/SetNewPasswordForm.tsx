"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { setPasswordSchema } from "@/store/schemas/setPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthParagraph from "@atom/AuthParagraph";
import TextInput from "@components/input/TextInput";
import Button from "@atom/Button";
import Alert from "@atom/Alert";
import ALink from "@atom/ALink";
import { LANDING_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import { resetPasswordApi } from "@/api/auth";
import { useToast } from "@components/ui/use-toast";
import { ApiErrorResponse } from "@/interface/general";
import { getFormErrorObject } from "@/utils";
import { VerifyEmailApiOutput } from "@/actions/auth";

interface Props {
  response: VerifyEmailApiOutput | null;
}

export const SetNewPasswordForm = ({ response }: Props) => {
  const [loading, setLoading] = useState(true);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    control,
    setError,
  } = useForm<z.infer<typeof setPasswordSchema>>({
    resolver: zodResolver(setPasswordSchema),
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!response || !response.verified || !response.resetToken || !response.email) {
      setError("password", {
        type: "manual",
        message: "Invalid or expired code. Please request a new password reset.",
      });
    } else {
      setLoading(false);
    }
  }, [response, setError]);

  const onSubmit = async (values: z.infer<typeof setPasswordSchema>) => {
    if (!response?.email || !response?.resetToken) {
      toast({
        description: "Session expired. Please request a new password reset.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { passwordChanged } = await resetPasswordApi({
        password: values.password,
        email: response.email,
        resetToken: response.resetToken,
      });
      if (passwordChanged) {
        setIsPasswordChanged(true);
        toast({
          description: "Your password has been changed successfully. Redirecting to login...",
        });
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/auth" + LOGIN_ROUTE);
        }, 2000);
        return;
      }

      toast({
        description: "Something went wrong! Password not changed.",
        variant: "destructive",
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse<z.infer<typeof setPasswordSchema>> =
        error;
      const errorObj = getFormErrorObject(errorResponse);
      if (errorObj) {
        const errorArray = Object.entries(errorObj);
        errorArray.forEach(([key, value]) => {
          setError(key as keyof z.infer<typeof setPasswordSchema>, {
            type: "manual",
            message: value,
          });
        });
        return;
      }
      toast({
        description: `Something went wrong`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className={"flex flex-col gap-y-6"} onSubmit={handleSubmit(onSubmit)}>
      <AuthParagraph className={"text-grey9"}>
        Set a new password for your account
      </AuthParagraph>

      <Controller
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder={"Set new password"}
            label={"New password"}
            type={"password"}
            isPassword
            disabled={loading}
            errorMessage={errors.password?.message}
          />
        )}
        name={"password"}
        control={control}
      />

      <div>
        <div className={"w-full flex flex-col gap-y-2"}>
          <Button
            type={"submit"}
            disabled={loading}
            format={"primary"}
            className={"w-full"}
          >
            Reset password
          </Button>

          {isPasswordChanged ? (
            <Alert type="success">
              Your password has been changed successfully. Please{" "}
              <ALink
                className={"text-blue-100 font-medium uppercase"}
                href={"/auth" + LOGIN_ROUTE}
              >
                login
              </ALink>{" "}
              with your new password.
            </Alert>
          ) : null}
        </div>

        <AuthParagraph className={"mt-3 text-center sm:text-start"}>
          Don’t have an account?{" "}
          <ALink href={"/auth" + LANDING_ROUTE}>Sign up</ALink>
        </AuthParagraph>
      </div>
    </form>
  );
};
