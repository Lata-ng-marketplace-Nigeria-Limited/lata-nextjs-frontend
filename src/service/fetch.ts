"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import { getCookies } from "@/utils";

export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: BodyInit;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  referrerPolicy?: ReferrerPolicy;
  next?: {
    tags?: Array<string>;
    revalidate?: number | false | undefined;
  };
}

class Fetch {
  private options: any;

  constructor() {
    this.init();
  }

  init = async () => {
    const session = await getServerSession(authConfig);
    let token = session?.token;
    // if (!session) {
    //   try {
    //     token = getCookies("token") || "";
    //   } catch (error) {}
    // }
    this.options = {
      headers: {
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
    };
  };

  $http = async (url: string, options?: FetchOptions) => {
    const session = await getServerSession(authConfig);
    let token = session?.token;
    return await fetch(process.env.NEXT_PUBLIC_LATA_API_URL + url, {
      ...(options || {}),
      headers: {
        ...options?.headers,
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
    });
  };
}

const FetchService = async (url: string, options?: FetchOptions) => {
  const session = await getServerSession(authConfig);
  let token = session?.token;
  return await fetch(process.env.NEXT_PUBLIC_LATA_API_URL + url, {
    ...(options || {}),
    headers: {
      ...options?.headers,
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
  });
};

export default FetchService;
