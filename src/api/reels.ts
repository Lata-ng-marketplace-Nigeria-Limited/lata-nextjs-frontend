"use server";

import { getApiUrl } from "@/utils";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export interface ReelUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber?: string;
}

export interface Reel {
  id: string;
  title: string;
  description: string;
  video_url: string;
  cloudinary_public_id: string;
  created_at: string;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED";
}

export interface GroupedReels {
  user_id: string;
  user: ReelUser;
  reels: Reel[];
}

export const getReelsApi = async (queries?: {
  sellerId?: string;
}): Promise<{ reels: GroupedReels[] } | null> => {
  try {
    const params = new URLSearchParams();
    if (queries?.sellerId) {
      params.append("sellerId", queries.sellerId);
    }
    const url = `/reels?${params.toString()}`;
    const session = await auth();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.token) {
      headers["Authorization"] = `Bearer ${session.token}`;
    }

    const res = await fetch(getApiUrl(url), {
      method: "GET",
      headers,
      next: {
        revalidate: 60, // 1 minute cache
        tags: ["reels_feed"],
      },
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getReelsApi:", error);
    return null;
  }
};

export const getInActiveReelsApi = async (queries?: {
  page?: string;
  limit?: string;
  search?: string;
}): Promise<{
  meta: any;
  data: (Reel & { user: ReelUser })[];
} | null> => {
  try {
    const params = new URLSearchParams();
    if (queries?.page) params.append("page", queries.page);
    if (queries?.limit) params.append("limit", queries.limit);
    if (queries?.search) params.append("search", queries.search);

    const url = `/admin/reels?${params.toString()}`;
    const session = await auth();

    if (!session || !session.token) {
      return null;
    }

    const res = await fetch(getApiUrl(url), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      next: {
        revalidate: 0, // no cache for admin panel
      },
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error in getInActiveReelsApi:", error);
    return null;
  }
};

export const activateReelApi = async (id: string) => {
  try {
    const session = await auth();
    const res = await fetch(getApiUrl(`/admin/reels/activate/${id}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to activate reel");
    }
    revalidatePath("/review-reels");
    revalidatePath("/");
    return await res.json();
  } catch (error) {
    console.error("Error in activateReelApi:", error);
    throw error;
  }
};

export const cancelReelApi = async (id: string) => {
  try {
    const session = await auth();
    const res = await fetch(getApiUrl(`/admin/reels/cancel/${id}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to cancel reel");
    }
    revalidatePath("/review-reels");
    revalidatePath("/");
    return await res.json();
  } catch (error) {
    console.error("Error in cancelReelApi:", error);
    throw error;
  }
};
