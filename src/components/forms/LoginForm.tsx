"use client";

import TextInput from "@components/input/TextInput";
import { FORGOT_PASSWORD_ROUTE, LANDING_ROUTE } from "@/constants/routes";
import ALink from "@atom/ALink";
import Button from "@atom/Button";
import AuthParagraph from "@atom/AuthParagraph";
import React, { SetStateAction, useEffect, useState } from "react";
import Alert from "@atom/Alert";
import { loginApi, resendOtpApi } from "@/api/auth";
import { useFastLocalStore } from "@/store/states/localStore";
import { useUser } from "@/hooks/useUser";
import ResendEmail from "@molecule/ResendEmail";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmailData] = useState("");
  const [password, setPassword] = useState("");
  const [shouldVerifyEmail, setShouldVerifyEmail] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const { loginUser } = useUser();
  const { setSelectedRole } = useFastLocalStore();
  const { push } = useRouter();

  useEffect(() => {
    setSelectedRole(undefined);
  }, [setSelectedRole]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setShouldVerifyEmail(false);
    setLoading(true);
    try {
      const loginRes = await loginApi({
        email,
        password,
      });

      if (loginRes.error) {
        setErrorMessage(loginRes.error.errorInfo);
        setLoading(false);
        return;
      }

      if (loginRes.isBlocked) {
        push("/blocked");
        return;
      }

      if (!loginRes.isEmailVerified) {
        setShouldVerifyEmail(true);
        setEmailData(email);
        setLoading(false);
        return;
      }

      if (loginRes.authorized && loginRes.publicToken) {
        const { error, message } = await loginUser(loginRes?.publicToken);

        if (error) {
          setErrorMessage(message);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      setLoading(false);
      if ((error as Error).message.includes("CredentialsSignin")) {
        return "CredentialSignin";
      }
      throw error;
    }
  };

  const handleResendEmail = async (
    setRestart: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    setResendError("");
    setResendLoading(true);
    if (!email) return;
    try {
      await resendOtpApi({
        email,
        type: "verify-email",
      });
      setRestart(true);
    } catch (error) {
      setResendError("Could not resend email. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={"flex flex-col gap-y-6"}>
      <TextInput
        placeholder={"Enter email"}
        type="email"
        label={"Email"}
        name={"email"}
        value={email}
        setValue={setEmailData}
        onChange={() => {
          setErrorMessage("");
        }}
      />

      <div>
        <TextInput
          placeholder={"Enter password"}
          type="password"
          label={"Password"}
          isPassword
          name={"password"}
          value={password}
          setValue={setPassword}
          onChange={() => {
            setErrorMessage("");
          }}
        />
        <ALink href={"/auth" + FORGOT_PASSWORD_ROUTE} className={"mt-[0.5rem]"}>
          Forgot Password?
        </ALink>
      </div>

      <div className={"flex flex-col items-center"}>
        <div className={"flex w-full flex-col gap-y-2"}>
          <Button
            type={"submit"}
            disabled={loading}
            format={"primary"}
            className={"w-full"}
          >
            Login
          </Button>
          <Alert type="danger">{resendError || errorMessage}</Alert>

          {shouldVerifyEmail ? (
            <>
              {" "}
              <Alert type="info">
                Please verify your email address! A verification link has been
                sent to {email}{" "}
                <ResendEmail
                  onCountDownEnd={() => {}}
                  startCountDown={true}
                  buttonClass={"text-blue-100 font-medium"}
                  spanTextClass={"text-slate-50"}
                  initialCount={15}
                  disabledBtn={resendLoading}
                  onResendEmail={handleResendEmail}
                />
              </Alert>
            </>
          ) : null}
        </div>
        <AuthParagraph className={"mt-3"}>
          Don’t have an account?{" "}
          <ALink href={"/auth" + LANDING_ROUTE}>Sign up</ALink>
        </AuthParagraph>
      </div>
    </form>
  );
};
