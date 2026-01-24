import { cache } from "react";
import { auth } from "@/auth";

/**
 * Cached server session getter - deduplicates auth calls within a single request.
 * Use this instead of direct auth() calls in API/Server functions
 * to avoid redundant authentication checks.
 */
export const getCachedSession = cache(async () => {
    return await auth();
});
