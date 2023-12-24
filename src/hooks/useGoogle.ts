"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getApiUrl } from "@/utils";
import React, { SetStateAction } from "react";
import { AuthorizeResponse } from "@/interface/user";
import { ApiErrorResponse } from "@/interface/general";
import { useFastLocalStore } from "@/store/states/localStore";

export const useGoogle = () => {
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const { selectedRole, setSelectedRole } = useFastLocalStore();

  const googleRedirect = async () => {
    console.log("googleRedirect");
    try {
      const res = await fetch(getApiUrl("/auth/google-redirect"), {
        method: "GET",
        headers: {
          "Content-Type": "application/text",
        },
      });

      if (!res.ok) {
        console.log("error");
        throw new Error("Something went wrong");
      }
      console.log("suc");
      const link = await res.text();
      console.log("link", link);
      window.open(link, "_self");
    } catch (error: any) {
      console.log("error", error);
      throw error.response || error;
      // toast({
      //   title: "Error",
      //   description: "Something went wrong",
      //   type: "error",
      // });
    }
  };

  const googleCallback = async (
    setResponse?: React.Dispatch<SetStateAction<AuthorizeResponse | undefined>>,
    setError?: React.Dispatch<SetStateAction<ApiErrorResponse | undefined>>,
  ): Promise<AuthorizeResponse | undefined> => {
    const role = selectedRole;
    try {
      const res = await fetch(
        getApiUrl(
          //@ts-ignore
          `/auth/google-callback?code=${searchParams.code}&role=${role}`,
        ),
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();

      setSelectedRole(undefined);
      setResponse?.(data);
      return data;
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = error.response;
      setError?.(errorResponse || { status: 500, message: "Server Error" });
      throw errorResponse;
    }
  };

  return { googleRedirect, googleCallback };
};
