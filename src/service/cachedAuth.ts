import { cache } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";

/**
 * Cached server session getter - deduplicates auth calls within a single request.
 * Use this instead of direct getServerSession(authConfig) calls in API/Server functions
 * to avoid redundant authentication checks.
 */
export const getCachedSession = cache(async () => {
    return await getServerSession(authConfig);
});
