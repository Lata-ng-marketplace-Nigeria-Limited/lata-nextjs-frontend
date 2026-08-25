import { getApiUrl } from "@/utils";
import { auth } from "@/auth";
import { FetchMeta } from "@/interface/general";

export interface AuditLogAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  targetUserId: string;
  action: string;
  payload?: string;
  statusCode: number;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
  admin: AuditLogAdmin;
  targetUser: AuditLogAdmin;
}

export interface GetAuditLogsInput {
  page?: string;
  search?: string;
  tab?: string;
  activityType?: string;
}

export const getAdminAuditLogsApi = async (
  input?: GetAuditLogsInput,
): Promise<{
  data: AuditLog[];
  meta: FetchMeta;
  stats: {
    total: number;
    admin: number;
    staff: number;
  };
}> => {
  const page = input?.page || "1";
  const query = input?.search || "";
  const tab = input?.tab || "ALL";
  const activityType = input?.activityType || "";

  try {
    const session = await auth();
    const res = await fetch(
      getApiUrl(
        `/admin/audit-logs?page=${page}&query=${encodeURIComponent(query)}&tab=${tab}&activityType=${activityType}`,
      ),
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        next: {
          revalidate: 0,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch audit logs");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getAdminAuditLogsApi:", error);
    throw error;
  }
};
