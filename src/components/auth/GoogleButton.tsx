"use client";

import React, { useCallback, useState } from "react";
import Button from "@atom/Button";
import { cn, getApiUrl } from "@/utils";
import { GoogleIcon } from "@atom/icons/google";
import {
  CredentialResponse,
  TokenResponse,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { useFastLocalStore } from "@/store/states/localStore";
import { AuthorizeResponse } from "@/interface/user";
import { useUser } from "@hooks/useUser";
import { useRegistrationFormStore } from "@/store/states/userState";
import { usePathname, useRouter } from "next/navigation";
import { SELLER_SIGN_UP_ROUTE } from "@/constants/routes";
import { useToast } from "@components/ui/use-toast";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function GoogleButton(props: Props) {
  const [loading, setLoading] = useState(false);
  const { selectedRole, setSelectedRole } = useFastLocalStore();
  const { loginUser } = useUser();
  const { setRegistrationForm, shouldCompleteForm } =
    useRegistrationFormStore();
  const nav = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  const disableOneTap =
    shouldCompleteForm && pathname === "/auth" + SELLER_SIGN_UP_ROUTE;

  const handleError = useCallback(() => {
    toast({
      title: "Something went wrong!",
      variant: "destructive",
    });
    setLoading(false);
  }, [toast]);

  const handleOnSuccess = useCallback(
    async (
      response:
        | CredentialResponse
        | Omit<TokenResponse, "error" | "error_description" | "error_uri">,
    ) => {
      setLoading(true);

      try {
        const paramObject: any = {};
        if ("credential" in response) {
          paramObject.credential = response.credential;
        }
        if ("access_token" in response) {
          paramObject.accessToken = response.access_token;
        }
        if (selectedRole) {
          paramObject.role = selectedRole;
        }
        const params = new URLSearchParams(paramObject);

        const res = await fetch(
          getApiUrl(`/auth/google-callback-token?${params.toString()}`),
        );

        if (!res.ok) {
          handleError();
          return;
        }
        const data = (await res.json()) as AuthorizeResponse;

        if (data.shouldCompleteProfile) {
          setRegistrationForm({
            email: data.email,
            name: data.name,
            avatar: data.avatar,
            shouldCompleteForm: true,
          });
          if (pathname !== "/auth" + SELLER_SIGN_UP_ROUTE) {
            nav.refresh();
          } else {
            nav.push("/auth" + SELLER_SIGN_UP_ROUTE);
          }
          return;
        }

        if (data.authorized && data.publicToken) {
          setSelectedRole(undefined);
          const { error } = await loginUser(data.publicToken);
          if (error) {
            handleError();
            return;
          }
        }
      } catch (error) {
        handleError();
      }
    },
    [
      handleError,
      loginUser,
      nav,
      pathname,
      selectedRole,
      setRegistrationForm,
      setSelectedRole,
    ],
  );

  useGoogleOneTapLogin({
    onSuccess: handleOnSuccess,
    onError: () => {
      setLoading(false);
    },
    disabled: disableOneTap,
  });

  const login = useGoogleLogin({
    onSuccess: handleOnSuccess,
    onError: () => {
      handleError();
    },
    onNonOAuthError: () => {
      setLoading(false);
    },
    scope: "openid profile email",
  });

  return (
    <Button
      {...props}
      format={"secondary"}
      className={cn(
        `
        rounded-md
        text-grey6
        flex
        items-center
        justify-center
        gap-x-2.5
        py-2.5 
        border-grey5
 
        sm:border-primary
        hover:bg-transparent
        active:bg-transparent
        
        font-normal
        sm:font-semibold
        `,
        props.className,
      )}
      onClick={() => {
        setLoading(true);
        login();
      }}
      disabled={loading}
    >
      <GoogleIcon />
      Sign up with Google
    </Button>
  );
}
