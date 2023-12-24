"use server";

import { getApiUrl } from "@/utils";
import { $http } from "@/service/axios";
import { LegalDoc, LegalDocNames } from "@/interface/legal";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";

export const getLegalDocsApi = async (): Promise<{
  message: string;
  data: LegalDoc[];
} | null> => {
  try {
    const session = await getServerSession(authConfig);
    const res = await fetch(getApiUrl(`/legal`), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const getALegalDocApi = async ({
  name,
  id,
}: {
  id?: string;
  name?: LegalDocNames;
}): Promise<LegalDoc | null> => {
  try {
    const session = await getServerSession(authConfig);
    const url = id ? `/legal/${id}` : `/legal/show?name=${name}`;
    const res = await fetch(getApiUrl(url), {
      headers: {
        Authorization: "Bearer " + session?.token,
      },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error: any) {
    throw error.response || error;
  }
};

export const updateALegalDocApi = async (
  id: string,
  { json, html }: { html?: string; json?: string },
) => {
  try {
    const session = await getServerSession(authConfig);
    const res = await $http.put(
      "/legal",
      {
        id,
        ...(json && { json: JSON.parse(json) }),
        ...(html && { html }),
      },
      {
        headers: {
          Authorization: "Bearer " + session?.token,
        },
      },
    );
    return res.data;
  } catch (error: any) {
    throw error.response || error;
  }
};
