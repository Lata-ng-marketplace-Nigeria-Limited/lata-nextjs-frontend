"use client";

import React, { useCallback } from "react";
import { CredentialResponse, useGoogleOneTapLogin } from "@react-oauth/google";
import { getApiUrl } from "@/utils";
import { useIsUserBlocked } from "@/store/states/localStore";
import { AuthorizeResponse } from "@/interface/user";
import { useUser } from "@hooks/useUser";
import { useRegistrationFormStore } from "@/store/states/userState";
import { useRouter } from "next/navigation";
import { SELLER_SIGN_UP_ROUTE } from "@/constants/routes";
import { useToast } from "@components/ui/use-toast";

export default function GoogleOneTapWrapper() {
  const { loginUser } = useUser();
  const { setRegistrationForm } = useRegistrationFormStore();
  const { userIsBlocked } = useIsUserBlocked();
  const nav = useRouter();
  const { toast } = useToast();

  const handleError = useCallback(() => {
    toast({
      title: "Google One Tap login failed!",
      variant: "destructive",
    });
  }, [toast]);

  const handleOnSuccess = useCallback(
    async (response: CredentialResponse) => {
      try {
        const paramObject: any = {};
        if (response.credential) {
          paramObject.credential = response.credential;
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
          nav.push("/auth" + SELLER_SIGN_UP_ROUTE);
          return;
        }

        if (data.authorized && data.publicToken) {
          const { error } = await loginUser(data.publicToken);
          if (error) {
            if (userIsBlocked === "true") return;
            handleError();
            return;
          }
          nav.refresh();
        }
      } catch (error) {
        if (userIsBlocked === "true") return;
        handleError();
      }
    },
    [handleError, loginUser, nav, setRegistrationForm, userIsBlocked],
  );

  useGoogleOneTapLogin({
    onSuccess: handleOnSuccess,
    onError: () => {
      console.log("Google One Tap login error or dismissed");
    },
  });

  return null;
}
