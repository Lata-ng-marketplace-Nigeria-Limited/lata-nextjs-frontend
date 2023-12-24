import axios, { AxiosResponse } from "axios";
import { deleteCookies, getCookies } from "@/utils";
import { ApiErrorResponse } from "@/interface/general";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { signOut } from "next-auth/react";

const noneAuthUrls = [""];

const baseURL = process.env.NEXT_PUBLIC_LATA_API_URL;
const baseURL2 = process.env.NEXT_PUBLIC_LATA_API_URL_2;

export const $http = axios.create({
  baseURL,
});

export const $httpFile = axios.create({
  baseURL: baseURL2,
});

$httpFile.interceptors.request.use(async (config: any) => {
  return await handleConfig(config);
});

$httpFile.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (axiosResponse) => {
    return await handleErrorResponse(axiosResponse);
  },
);

$http.interceptors.request.use(async (config: any) => {
  return await handleConfig(config);
});

$http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (axiosResponse) => {
    return await handleErrorResponse(axiosResponse);
  },
);

const handleConfig = async (config: any) => {
  let isServer = typeof window === "undefined";
  let token: string | undefined;

  if (isServer) {
    const session = await getServerSession(authConfig);
    token = session?.token;
  } else {
    token = getCookies("token");
  }

  if (!noneAuthUrls.includes(config.url)) {
    if (config.headers.Authorization) return config;
    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + token,
    };
  }
  return config;
};

const handleErrorResponse = async (axiosResponse: any) => {
  const resp: ApiErrorResponse = axiosResponse.response;
  const errArr = resp?.data?.errors || [];

  errArr?.forEach((err) => {
    if (err.message.includes("Rate limit") && err.retryAfter) {
      console.log(
        "Rate limit exceeded, please try again after",
        err.retryAfter,
        "seconds",
      );
    }
  });

  if (
    resp?.status === 401 ||
    (resp?.data && resp?.data?.error && resp?.data?.error?.redirectTo)
    // ||
    // (userState.isLoggedIn && resp?.data?.errorInfo?.includes("Unauthorized"))
  ) {
    let isServer = typeof window === "undefined";
    if (isServer) {
      const session = await getServerSession(authConfig);
      if (session?.user) {
        await fetch("/api/auth/signout", {
          method: "POST",
        });
      }
    } else {
      await signOut();
      deleteCookies("token");
    }
  }
  throw axiosResponse;
};
